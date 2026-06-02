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
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  array,
  object,
  parse,
  string,
  tuple,
} from "valibot"
import { describe, expect, it } from "vitest"

import { start_withdraw_erc20 } from "./start-withdraw-erc20"

const ARB_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "421614",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
// Arb Sepolia L2GatewayRouter — from packages/arbitrum/src/deploys/eip155-421614.ts
const L2_ROUTER = parse(
  AddressSchema,
  "0x9fDD1C4E4AA24EEc1d913FABea4b0Bf2C0c30B62",
)
const L1_TOKEN = parse(
  AddressSchema,
  "0x3333333333333333333333333333333333333333",
)
const RECIPIENT = parse(
  AddressSchema,
  "0x4444444444444444444444444444444444444444",
)
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
)
const SELECTOR = function_selector("outboundTransfer", [
  address_codec(),
  address_codec(),
  uint256_codec(),
  bytes_codec(),
])

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
    l2: {
      chain_id: ARB_SEPOLIA,
      reader,
    },
    l1: {
      chain_id: SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l1 reader should not be invoked from start_withdraw_erc20",
        )
      },
    },
  }
}

describe("start_withdraw_erc20", () => {
  it("signs L2GatewayRouter.outboundTransfer on L2 with msg.value = 0 and broadcasts via eth_sendRawTransaction", async () => {
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
    const amount = parse(Uint256Schema, "0xde0b6b3a7640000")
    const hash = await start_withdraw_erc20({
      l1_token: L1_TOKEN,
      to: RECIPIENT,
      amount,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)
    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(L2_ROUTER)
    expect(signed.tx.value).toBe(parse(UintSchema, "0x0"))
    const empty_bytes = parse(BytesSchema, "0x")
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "outboundTransfer",
        args: [
          address_codec(),
          address_codec(),
          uint256_codec(),
          bytes_codec(),
        ] as const,
        values: [L1_TOKEN, RECIPIENT, amount, empty_bytes],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(signed.tx.input.startsWith(SELECTOR)).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature:
        "outboundTransfer(address,address,uint256,bytes)",
      names: ["_l1Token", "_to", "_amount", "_data"],
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
      start_withdraw_erc20({
        l1_token: L1_TOKEN,
        to: RECIPIENT,
        amount: parse(Uint256Schema, "0xde0b6b3a7640000"),
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
