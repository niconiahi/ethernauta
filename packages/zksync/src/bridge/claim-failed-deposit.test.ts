import {
  address as address_codec,
  array as array_codec,
  bytes32 as bytes32_codec,
  encode_function_call,
  function_selector,
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

import { claim_failed_deposit } from "./claim-failed-deposit"
import { FailedDepositProofSchema } from "./failed-deposit-proof"

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
const DEPOSIT_SENDER = parse(
  AddressSchema,
  "0x8888888888888888888888888888888888888888",
)
const L1_TOKEN = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const L2_TX_HASH = parse(
  Bytes32Schema,
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
)
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

const CLAIM_SIGNATURE =
  "claimFailedDeposit(uint256,address,address,uint256,bytes32,uint256,uint256,uint16,bytes32[])"
const CLAIM_SELECTOR = function_selector(
  "claimFailedDeposit",
  [
    uint256_codec(),
    address_codec(),
    address_codec(),
    uint256_codec(),
    bytes32_codec(),
    uint256_codec(),
    uint256_codec(),
    uint16_codec(),
    array_codec(bytes32_codec()),
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
      chain_id: ERA_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l2 reader should not be invoked from claim_failed_deposit",
        )
      },
    },
  }
}

const PROOF = parse(FailedDepositProofSchema, {
  chainIdNumeric: parse(
    Uint256Schema,
    bigint_to_hex(BigInt(300)),
  ),
  depositSender: DEPOSIT_SENDER,
  l1Token: L1_TOKEN,
  amount: parse(Uint256Schema, "0xde0b6b3a7640000"),
  l2TxHash: L2_TX_HASH,
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
  merkleProof: [PROOF_LEAF_0, PROOF_LEAF_1],
})

describe("claim_failed_deposit", () => {
  it("signs L1Nullifier.claimFailedDeposit with the proof fields verbatim + msg.value = 0, and broadcasts via eth_sendRawTransaction", async () => {
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
    const hash = await claim_failed_deposit({
      proof: PROOF,
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
        name: "claimFailedDeposit",
        args: [
          uint256_codec(),
          address_codec(),
          address_codec(),
          uint256_codec(),
          bytes32_codec(),
          uint256_codec(),
          uint256_codec(),
          uint16_codec(),
          array_codec(bytes32_codec()),
        ] as const,
        values: [
          PROOF.chainIdNumeric,
          PROOF.depositSender,
          PROOF.l1Token,
          PROOF.amount,
          PROOF.l2TxHash,
          PROOF.l2BatchNumber,
          PROOF.l2MessageIndex,
          PROOF.l2TxNumberInBatch,
          PROOF.merkleProof,
        ],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(signed.tx.input.startsWith(CLAIM_SELECTOR)).toBe(
      true,
    )
    expect(signed.tx._ethernauta.function).toEqual({
      signature: CLAIM_SIGNATURE,
      names: [
        "_chainId",
        "_depositSender",
        "_l1Token",
        "_amount",
        "_l2TxHash",
        "_l2BatchNumber",
        "_l2MessageIndex",
        "_l2TxNumberInBatch",
        "_merkleProof",
      ],
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
      claim_failed_deposit({ proof: PROOF })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
