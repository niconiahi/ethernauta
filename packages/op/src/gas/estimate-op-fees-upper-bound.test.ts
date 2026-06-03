import {
  bytes as bytes_codec,
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
import { object, parse, string, tuple } from "valibot"
import { describe, expect, it } from "vitest"

import { estimate_op_fees } from "./estimate-op-fees"
import { estimate_op_fees_upper_bound } from "./estimate-op-fees-upper-bound"

const GET_L1_FEE_UPPER_BOUND_SELECTOR = function_selector(
  "getL1FeeUpperBound",
  [uint256_codec()],
)
const GET_L1_FEE_SELECTOR = function_selector("getL1Fee", [
  bytes_codec(),
])
const IS_ISTHMUS_SELECTOR = function_selector(
  "isIsthmus",
  [],
)

const EthCallParamsSchema = tuple([
  object({ to: string(), input: string() }),
])

function ok_response<T>(result: T): Response {
  return { id: "test", jsonrpc: "2.0", result }
}

function pad32(value_hex: string): string {
  const hex = value_hex.startsWith("0x")
    ? value_hex.slice(2)
    : value_hex
  return `0x${"0".repeat(64 - hex.length)}${hex}`
}

function make_transport(opts: {
  l1_fee_hex: string
  l1_fee_upper_bound_hex: string
}): (_call: Call) => Promise<Response> {
  return async (_call: Call): Promise<Response> => {
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
    if (selector === GET_L1_FEE_UPPER_BOUND_SELECTOR)
      return ok_response(pad32(opts.l1_fee_upper_bound_hex))
    if (selector === GET_L1_FEE_SELECTOR)
      return ok_response(pad32(opts.l1_fee_hex))
    if (selector === IS_ISTHMUS_SELECTOR)
      return ok_response(pad32("0"))
    throw new Error(`unexpected selector: ${selector}`)
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

describe("estimate_op_fees_upper_bound", () => {
  it("surfaces the getL1FeeUpperBound return as l1_fee_upper_bound", async () => {
    const resolved = testing_reader(
      make_transport({
        l1_fee_hex: "12c",
        l1_fee_upper_bound_hex: "ffff",
      }),
    )
    const fees =
      await estimate_op_fees_upper_bound(TX_PARAMS)(
        resolved,
      )
    expect(fees.l1_fee_upper_bound).toBe("0xffff")
  })

  it("returns the 1559 fees computed from eth_feeHistory", async () => {
    const resolved = testing_reader(
      make_transport({
        l1_fee_hex: "12c",
        l1_fee_upper_bound_hex: "ffff",
      }),
    )
    const fees =
      await estimate_op_fees_upper_bound(TX_PARAMS)(
        resolved,
      )
    expect(fees.base_fee_per_gas).toBe("0x64")
    expect(fees.max_priority_fee_per_gas).toBe("0x4")
    expect(fees.max_fee_per_gas).toBe("0x9a")
  })

  it("upper bound exceeds the accurate l1_fee on the same transport (D9-6)", async () => {
    const resolved_a = testing_reader(
      make_transport({
        l1_fee_hex: "12c",
        l1_fee_upper_bound_hex: "190",
      }),
    )
    const resolved_b = testing_reader(
      make_transport({
        l1_fee_hex: "12c",
        l1_fee_upper_bound_hex: "190",
      }),
    )
    const upper =
      await estimate_op_fees_upper_bound(TX_PARAMS)(
        resolved_a,
      )
    const accurate =
      await estimate_op_fees(TX_PARAMS)(resolved_b)
    expect(
      BigInt(upper.l1_fee_upper_bound),
    ).toBeGreaterThan(BigInt(accurate.l1_fee))
  })
})
