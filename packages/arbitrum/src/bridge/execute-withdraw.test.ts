import {
  address as address_codec,
  array,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  encode_function_call,
  function_selector,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  Uint64Schema,
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
  object,
  parse,
  string,
  tuple,
  array as v_array,
} from "valibot"
import { describe, expect, it } from "vitest"

import { execute_withdraw } from "./execute-withdraw"

const ARB_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "421614",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
// Arb Sepolia Outbox proxy — from packages/arbitrum/src/deploys/eip155-421614.ts
const OUTBOX = parse(
  AddressSchema,
  "0x65f07C7D521164a4d5DaC6eB8Fac8DA067A3B78F",
)
const L2_SENDER = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const PROOF_A = parse(
  Bytes32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)
const PROOF_B = parse(
  Bytes32Schema,
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
)
const SEND_ROOT = parse(
  Bytes32Schema,
  "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
)
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
)
const SELECTOR = function_selector("executeTransaction", [
  array(bytes32_codec()),
  uint256_codec(),
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  bytes_codec(),
])

const PROOF_BUNDLE = {
  message: {
    position: parse(Uint64Schema, "0x05"),
    l2Sender: L2_SENDER,
    to: TARGET,
    l2Block: parse(Uint256Schema, "0x4d2"),
    l1Block: parse(Uint256Schema, "0x1a4"),
    l2Timestamp: parse(Uint256Schema, "0x65"),
    value: parse(Uint256Schema, "0x0de0b6b3a7640000"),
    data: parse(BytesSchema, "0xdeadbeef"),
  },
  proof: [PROOF_A, PROOF_B],
  sendRoot: SEND_ROOT,
  sendCount: parse(Uint64Schema, "0x10"),
}

const TxSchema = object({
  to: AddressSchema,
  value: UintSchema,
  input: BytesSchema,
  _ethernauta: object({
    function: object({
      signature: string(),
      names: v_array(string()),
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
          "l2 reader should not be invoked from execute_withdraw",
        )
      },
    },
  }
}

describe("execute_withdraw", () => {
  it("signs Outbox.executeTransaction on L1 with the proof bundle and broadcasts via eth_sendRawTransaction", async () => {
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
    const hash = await execute_withdraw({
      proof: PROOF_BUNDLE,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)
    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(OUTBOX)
    expect(signed.tx.value).toBe(parse(UintSchema, "0x0"))
    const index = parse(
      Uint256Schema,
      PROOF_BUNDLE.message.position,
    )
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "executeTransaction",
        args: [
          array(bytes32_codec()),
          uint256_codec(),
          address_codec(),
          address_codec(),
          uint256_codec(),
          uint256_codec(),
          uint256_codec(),
          uint256_codec(),
          bytes_codec(),
        ] as const,
        values: [
          PROOF_BUNDLE.proof,
          index,
          PROOF_BUNDLE.message.l2Sender,
          PROOF_BUNDLE.message.to,
          PROOF_BUNDLE.message.l2Block,
          PROOF_BUNDLE.message.l1Block,
          PROOF_BUNDLE.message.l2Timestamp,
          PROOF_BUNDLE.message.value,
          PROOF_BUNDLE.message.data,
        ],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(signed.tx.input.startsWith(SELECTOR)).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature:
        "executeTransaction(bytes32[],uint256,address,address,uint256,uint256,uint256,uint256,bytes)",
      names: [
        "proof",
        "index",
        "l2Sender",
        "to",
        "l2Block",
        "l1Block",
        "l2Timestamp",
        "value",
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
      execute_withdraw({ proof: PROOF_BUNDLE })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
