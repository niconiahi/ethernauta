import {
  bool as bool_codec,
  bytes as bytes_codec,
  encode_sequence,
  function_selector,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { object, parse, string, tuple } from "valibot"
import { describe, expect, it } from "vitest"

import { estimate_op_fees } from "./estimate-op-fees"

const IS_ISTHMUS_SELECTOR = function_selector(
  "isIsthmus",
  [],
)
const GET_L1_FEE_SELECTOR = function_selector("getL1Fee", [
  bytes_codec(),
])
const GET_OPERATOR_FEE_SELECTOR = function_selector(
  "getOperatorFee",
  [uint256_codec()],
)

const EthCallParamsSchema = tuple([
  object({ to: string(), input: string() }),
])

function ok_response<T>(result: T): Response {
  return { id: "test", jsonrpc: "2.0", result }
}

function encode_bool_return(value: boolean): string {
  return bytes_to_hex(
    encode_sequence([bool_codec()], [value]),
  )
}

// 32-byte right-padded big-endian uint return. Same shape
// `getL1Fee` returns; mirrors `l1_fee_padded` below.
function pad32(value_hex: string): string {
  const hex = value_hex.startsWith("0x")
    ? value_hex.slice(2)
    : value_hex
  return `0x${"0".repeat(64 - hex.length)}${hex}`
}

function make_transport(config: {
  is_isthmus: boolean
  operator_fee_hex?: string
}): {
  transport: (_call: Call) => Promise<Response>
  operator_fee_calls: () => number
} {
  const counters = { operator_fee_calls: 0 }
  const l1_fee_padded = pad32("12c")
  const transport = async (
    _call: Call,
  ): Promise<Response> => {
    const [method, params] = _call
    if (method === "eth_feeHistory")
      return ok_response({
        oldestBlock: "0x1",
        baseFeePerGas: [
          "0x32",
          "0x3c",
          "0x46",
          "0x50",
          "0x64",
        ],
        gasUsedRatio: [0.5, 0.5, 0.5, 0.5],
        reward: [["0x4"], ["0x4"], ["0x4"], ["0x4"]],
      })
    if (method === "eth_getTransactionCount")
      return ok_response("0x7")
    if (method === "eth_estimateGas")
      return ok_response("0x5208")
    if (method !== "eth_call")
      throw new Error(
        `unexpected method: ${String(method)}`,
      )
    const [{ input }] = parse(EthCallParamsSchema, params)
    const selector = input.slice(0, 10)
    if (selector === IS_ISTHMUS_SELECTOR)
      return ok_response(
        encode_bool_return(config.is_isthmus),
      )
    if (selector === GET_L1_FEE_SELECTOR)
      return ok_response(l1_fee_padded)
    if (selector === GET_OPERATOR_FEE_SELECTOR) {
      counters.operator_fee_calls += 1
      return ok_response(
        pad32(config.operator_fee_hex ?? "0"),
      )
    }
    throw new Error(`unexpected selector: ${selector}`)
  }
  return {
    transport,
    operator_fee_calls: () => counters.operator_fee_calls,
  }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_8453.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

const TX_PARAMS = {
  tx: {
    to: parse(
      AddressSchema,
      "0x0000000000000000000000000000000000000001",
    ),
    value: parse(UintSchema, "0x0"),
    input: parse(BytesSchema, "0x"),
  },
  base_fee_multiplier: 1.5,
  priority_percentile: 10,
} as const

describe("estimate_op_fees", () => {
  it("composes feeHistory + nonce + estimateGas + getL1Fee on a pre-Isthmus chain", async () => {
    // L2 base fee = 0x64, priority = 0x4 → max_fee at 1.5x = 0x9a.
    // L1 fee = 0x12c (300 wei). Operator fee absent → 0x0, and
    // no `getOperatorFee` eth_call is made.
    const { transport, operator_fee_calls } =
      make_transport({
        is_isthmus: false,
      })
    const resolved = testing_reader(transport)
    const fees = await estimate_op_fees(TX_PARAMS)(resolved)
    expect(fees.base_fee_per_gas).toBe("0x64")
    expect(fees.max_priority_fee_per_gas).toBe("0x4")
    expect(fees.max_fee_per_gas).toBe("0x9a")
    expect(fees.l1_fee).toBe("0x12c")
    expect(fees.operator_fee).toBe("0x0")
    expect(operator_fee_calls()).toBe(0)
  })

  it("includes operator_fee on an Isthmus-active chain", async () => {
    const { transport, operator_fee_calls } =
      make_transport({
        is_isthmus: true,
        operator_fee_hex: "2710",
      })
    const resolved = testing_reader(transport)
    const fees = await estimate_op_fees(TX_PARAMS)(resolved)
    expect(fees.l1_fee).toBe("0x12c")
    expect(fees.operator_fee).toBe("0x2710")
    expect(operator_fee_calls()).toBe(1)
  })
})
