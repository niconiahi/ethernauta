import {
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  Uint16Schema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Call,
  Reader,
  ResolvedBridge,
  Response,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { bigint_to_hex } from "@ethernauta/utils"
import { parse, tuple } from "valibot"
import { describe, expect, it } from "vitest"

import { fetch_message_proof } from "./message-proof"

const ERA_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "300",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const L2_TX_HASH = parse(
  Hash32Schema,
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
)
const PROOF_NODE_0 = parse(
  Hash32Schema,
  "0x1111111111111111111111111111111111111111111111111111111111111111",
)
const PROOF_NODE_1 = parse(
  Hash32Schema,
  "0x2222222222222222222222222222222222222222222222222222222222222222",
)
const PROOF_ROOT = parse(
  Hash32Schema,
  "0x3333333333333333333333333333333333333333333333333333333333333333",
)
const MESSAGE = parse(BytesSchema, "0xfeedface")
const LOG_INDEX = 4
const TX_NUMBER_IN_BATCH = parse(
  Uint16Schema,
  bigint_to_hex(BigInt(3)),
)

const LogProofParamsSchema = tuple([Hash32Schema])

function build_resolved(input: {
  l2: Reader
}): ResolvedBridge {
  return {
    l1: {
      chain_id: SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l1 reader should not be invoked from fetch_message_proof",
        )
      },
    },
    l2: { chain_id: ERA_SEPOLIA, reader: input.l2 },
  }
}

describe("fetch_message_proof", () => {
  it("composes zks_getL2ToL1LogProof and returns a MessageProof bundle with chainIdNumeric + dapp-supplied fields", async () => {
    const reader: Reader = async (
      call: Call,
    ): Promise<Response> => {
      const [method] = call
      if (method !== "zks_getL2ToL1LogProof") {
        throw new Error(
          `unexpected method ${String(method)}`,
        )
      }
      return {
        jsonrpc: "2.0",
        id: "1",
        result: {
          proof: [PROOF_NODE_0, PROOF_NODE_1],
          id: parse(Uint64Schema, bigint_to_hex(BigInt(7))),
          root: PROOF_ROOT,
          batchNumber: parse(
            Uint64Schema,
            bigint_to_hex(BigInt(42)),
          ),
        },
      }
    }
    const resolved = build_resolved({ l2: reader })
    const proof = await fetch_message_proof({
      l2_tx_hash: L2_TX_HASH,
      l2_to_l1_log_index: LOG_INDEX,
      l2_tx_number_in_batch: TX_NUMBER_IN_BATCH,
      message: MESSAGE,
    })(resolved)

    expect(proof.chainIdNumeric).toBe(
      parse(Uint256Schema, bigint_to_hex(BigInt(300))),
    )
    expect(proof.l2BatchNumber).toBe(
      parse(Uint256Schema, bigint_to_hex(BigInt(42))),
    )
    expect(proof.l2MessageIndex).toBe(
      parse(Uint256Schema, bigint_to_hex(BigInt(7))),
    )
    expect(proof.l2TxNumberInBatch).toBe(TX_NUMBER_IN_BATCH)
    expect(proof.message).toBe(MESSAGE)
    expect(proof.merkleProof).toEqual([
      parse(Bytes32Schema, PROOF_NODE_0),
      parse(Bytes32Schema, PROOF_NODE_1),
    ])
  })

  it("throws when zks_getL2ToL1LogProof returns null (batch not yet committed)", async () => {
    const reader: Reader = async (
      call: Call,
    ): Promise<Response> => {
      const [method, params] = call
      if (method !== "zks_getL2ToL1LogProof") {
        throw new Error(
          `unexpected method ${String(method)}`,
        )
      }
      // Bound-check the param shape so the test fails loudly
      // if the verb's param-encoding contract regresses.
      const [tx_hash] = parse(LogProofParamsSchema, params)
      expect(tx_hash).toBe(L2_TX_HASH)
      return { jsonrpc: "2.0", id: "1", result: null }
    }
    const resolved = build_resolved({ l2: reader })
    await expect(
      fetch_message_proof({
        l2_tx_hash: L2_TX_HASH,
        l2_to_l1_log_index: LOG_INDEX,
        l2_tx_number_in_batch: TX_NUMBER_IN_BATCH,
        message: MESSAGE,
      })(resolved),
    ).rejects.toThrow(/no proof available/)
  })
})
