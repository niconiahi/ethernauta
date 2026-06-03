import {
  address as address_codec,
  array as array_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  encode_function_call,
  function_selector,
  tuple as tuple_codec,
  uint16 as uint16_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  Uint16Schema,
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

import { execute_withdraw } from "./execute-withdraw"
import { MessageProofSchema } from "./message-proof"

const ERA_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "300",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
// Era Sepolia L1Nullifier — from packages/zksync/src/deploys/eip155-300.ts
const L1_NULLIFIER = parse(
  AddressSchema,
  "0x3E8b2fe58675126ed30d0d12dea2A9bda72D18Ae",
)
const L2_SENDER = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000010003", // L2AssetRouter
)
const MESSAGE_BYTES = parse(BytesSchema, "0xfeedface")
const PROOF_LEAF_0 = parse(
  Bytes32Schema,
  "0x1111111111111111111111111111111111111111111111111111111111111111",
)
const PROOF_LEAF_1 = parse(
  Bytes32Schema,
  "0x2222222222222222222222222222222222222222222222222222222222222222",
)
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)

const PROOF_STRUCT_TUPLE = tuple_codec({
  chainId: uint256_codec(),
  l2BatchNumber: uint256_codec(),
  l2MessageIndex: uint256_codec(),
  l2Sender: address_codec(),
  l2TxNumberInBatch: uint16_codec(),
  message: bytes_codec(),
  merkleProof: array_codec(bytes32_codec()),
})
const FINALIZE_SIGNATURE_TEXT =
  "finalizeDeposit((uint256,uint256,uint256,address,uint16,bytes,bytes32[]))"
const FINALIZE_SELECTOR = function_selector(
  "finalizeDeposit",
  [PROOF_STRUCT_TUPLE],
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
      chain_id: ERA_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l2 reader should not be invoked from execute_withdraw",
        )
      },
    },
  }
}

const PROOF = parse(MessageProofSchema, {
  chainIdNumeric: parse(
    Uint256Schema,
    bigint_to_hex(BigInt(300)),
  ),
  l2BatchNumber: parse(
    Uint256Schema,
    bigint_to_hex(BigInt(42)),
  ),
  l2MessageIndex: parse(
    Uint256Schema,
    bigint_to_hex(BigInt(7)),
  ),
  l2TxNumberInBatch: parse(
    Uint16Schema,
    bigint_to_hex(BigInt(3)),
  ),
  message: MESSAGE_BYTES,
  merkleProof: [PROOF_LEAF_0, PROOF_LEAF_1],
})

describe("execute_withdraw", () => {
  it("signs L1Nullifier.finalizeDeposit with the proof struct + l2_sender + msg.value = 0, and broadcasts via eth_sendRawTransaction", async () => {
    const signer_calls: { method: string; tx: Tx }[] = []
    const signer: Signer = async (method, _params) => {
      const [tx] = parse(SignParamsSchema, _params)
      signer_calls.push({ method, tx })
      return SIGNED_TRANSACTION
    }
    const raw_send_calls: { bytes: Bytes }[] = []
    const reader: Reader = async (
      call: Call,
    ): Promise<Response> => {
      const [method, params] = call
      if (method === "eth_sendRawTransaction") {
        const [bytes] = parse(RawSendParamsSchema, params)
        raw_send_calls.push({ bytes })
        return {
          jsonrpc: "2.0",
          id: "1",
          result: RETURNED_HASH,
        }
      }
      throw new Error(`unexpected method ${method}`)
    }
    const resolved = build_resolved({ signer, reader })
    const hash = await execute_withdraw({
      proof: PROOF,
      l2_sender: L2_SENDER,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)

    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(L1_NULLIFIER)
    expect(signed.tx.value).toBe(parse(UintSchema, "0x0"))

    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "finalizeDeposit",
        args: [PROOF_STRUCT_TUPLE] as const,
        values: [
          {
            chainId: PROOF.chainIdNumeric,
            l2BatchNumber: PROOF.l2BatchNumber,
            l2MessageIndex: PROOF.l2MessageIndex,
            l2Sender: L2_SENDER,
            l2TxNumberInBatch: PROOF.l2TxNumberInBatch,
            message: PROOF.message,
            merkleProof: PROOF.merkleProof,
          },
        ],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(
      signed.tx.input.startsWith(FINALIZE_SELECTOR),
    ).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature: FINALIZE_SIGNATURE_TEXT,
      names: ["_finalizeWithdrawalParams"],
    })

    expect(raw_send_calls.length).toBe(1)
    const sent = raw_send_calls[0]
    if (!sent) throw new Error("expected one raw send call")
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
      execute_withdraw({
        proof: PROOF,
        l2_sender: L2_SENDER,
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
