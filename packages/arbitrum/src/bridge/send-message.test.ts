import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  function_selector,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  BytesSchema,
  Hash32Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Call,
  Reader,
  ResolvedBridge,
  Response,
  Signer,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import {
  bigint_to_hex,
  bytes_to_hex,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  array,
  object,
  parse,
  string,
  tuple,
} from "valibot"
import { describe, expect, it } from "vitest"

import { send_message } from "./send-message"

const ARB_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "421614",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const INBOX_PROXY = parse(
  AddressSchema,
  "0xaAe29B0366299461418F5324a79Afc425BE5ae21",
)
const L2_TARGET = parse(
  AddressSchema,
  "0x5555555555555555555555555555555555555555",
)
const REFUND = parse(
  AddressSchema,
  "0x6666666666666666666666666666666666666666",
)
const CALLVALUE_REFUND = parse(
  AddressSchema,
  "0x7777777777777777777777777777777777777777",
)
const CALLDATA = parse(BytesSchema, "0xdeadbeef")
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)
const SELECTOR = function_selector(
  "createRetryableTicket",
  [
    address_codec(),
    uint256_codec(),
    uint256_codec(),
    address_codec(),
    address_codec(),
    uint256_codec(),
    uint256_codec(),
    bytes_codec(),
  ],
)

const TxSchema = object({
  to: AddressSchema,
  value: UintSchema,
  input: BytesSchema,
  _ethernauta: object({
    function: object({
      signature: string(),
      names: array(string()),
    }),
  }),
})
type Tx = InferOutput<typeof TxSchema>
const SignParamsSchema = tuple([TxSchema])
const RawSendParamsSchema = tuple([BytesSchema])

function build_resolved({
  signer,
  reader,
}: {
  signer?: Signer
  reader: Reader
}): ResolvedBridge {
  return {
    signer,
    l1: {
      chain_id: SEPOLIA,
      reader,
    },
    l2: {
      chain_id: ARB_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l2 reader should not be invoked from send_message",
        )
      },
    },
  }
}

describe("send_message", () => {
  it("signs createRetryableTicket and broadcasts on L1 with the computed msg.value", async () => {
    const signer_calls: { method: string; tx: Tx }[] = []
    const signer: Signer = async (method, _params) => {
      const [tx] = parse(SignParamsSchema, _params)
      signer_calls.push({ method, tx })
      return SIGNED_TRANSACTION
    }
    const reader_calls: { method: string; bytes: Bytes }[] =
      []
    const reader: Reader = async (
      call: Call,
    ): Promise<Response> => {
      const [method, params] = call
      const [bytes] = parse(RawSendParamsSchema, params)
      reader_calls.push({ method, bytes })
      return {
        jsonrpc: "2.0",
        id: "1",
        result: RETURNED_HASH,
      }
    }
    const resolved = build_resolved({ signer, reader })
    const l2_call_value = parse(
      Uint256Schema,
      "0xde0b6b3a7640000", // 1 ETH
    )
    const max_submission_cost = parse(
      Uint256Schema,
      "0x2386f26fc10000", // 0.01 ETH
    )
    const gas_limit = parse(Uint256Schema, "0x186a0") // 100_000
    const max_fee_per_gas = parse(
      Uint256Schema,
      "0x3b9aca00", // 1 gwei
    )
    const hash = await send_message({
      to: L2_TARGET,
      l2_call_value,
      max_submission_cost,
      excess_fee_refund_address: REFUND,
      call_value_refund_address: CALLVALUE_REFUND,
      gas_limit,
      max_fee_per_gas,
      data: CALLDATA,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)
    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(INBOX_PROXY)
    const expected_value = parse(
      UintSchema,
      bigint_to_hex(
        BigInt(l2_call_value) +
          BigInt(max_submission_cost) +
          BigInt(gas_limit) * BigInt(max_fee_per_gas),
      ),
    )
    expect(signed.tx.value).toBe(expected_value)
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "createRetryableTicket",
        args: [
          address_codec(),
          uint256_codec(),
          uint256_codec(),
          address_codec(),
          address_codec(),
          uint256_codec(),
          uint256_codec(),
          bytes_codec(),
        ] as const,
        values: [
          L2_TARGET,
          l2_call_value,
          max_submission_cost,
          REFUND,
          CALLVALUE_REFUND,
          gas_limit,
          max_fee_per_gas,
          CALLDATA,
        ],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(signed.tx.input.startsWith(SELECTOR)).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature:
        "createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)",
      names: [
        "to",
        "l2CallValue",
        "maxSubmissionCost",
        "excessFeeRefundAddress",
        "callValueRefundAddress",
        "gasLimit",
        "maxFeePerGas",
        "data",
      ],
    })
    expect(reader_calls.length).toBe(1)
    const sent = reader_calls[0]
    if (!sent) throw new Error("expected one reader call")
    expect(sent.method).toBe("eth_sendRawTransaction")
    expect(sent.bytes).toBe(SIGNED_TRANSACTION)
  })

  it("throws when signer is undefined", async () => {
    const reader: Reader = async (
      _call: Call,
    ): Promise<Response> => {
      throw new Error(
        "reader should not be invoked when signer is missing",
      )
    }
    const resolved = build_resolved({ reader })
    await expect(
      send_message({
        to: L2_TARGET,
        l2_call_value: parse(
          Uint256Schema,
          "0xde0b6b3a7640000",
        ),
        max_submission_cost: parse(
          Uint256Schema,
          "0x2386f26fc10000",
        ),
        excess_fee_refund_address: REFUND,
        call_value_refund_address: CALLVALUE_REFUND,
        gas_limit: parse(Uint256Schema, "0x186a0"),
        max_fee_per_gas: parse(Uint256Schema, "0x3b9aca00"),
        data: CALLDATA,
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
