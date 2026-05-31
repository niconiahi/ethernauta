// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getl2tol1logproof
// Merkle proof of an L2→L1 log emitted by `L1Messenger.sendToL1`.
// The proof anchors a single log so an L1 verifier can prove its
// inclusion in a sealed batch's logs Merkle tree.

import {
  Hash32Schema,
  Uint64Schema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  array,
  nullable,
  number,
  object,
  optional,
  parse,
  tuple,
  union,
} from "valibot"

import { InteropModeSchema } from "../core"

const ParametersSchema = union([
  tuple([
    Hash32Schema,
    nullable(number()),
    nullable(InteropModeSchema),
  ]),
  tuple([Hash32Schema, nullable(number())]),
  tuple([Hash32Schema]),
  object({
    txHash: Hash32Schema,
    index: optional(nullable(number())),
    interopMode: optional(nullable(InteropModeSchema)),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export const L2ToL1LogProofSchema = object({
  proof: array(Hash32Schema),
  id: Uint64Schema,
  root: Hash32Schema,
  batchNumber: Uint64Schema,
})
export type L2ToL1LogProof = InferOutput<
  typeof L2ToL1LogProofSchema
>

export function zks_getL2ToL1LogProof(
  _parameters: Parameters,
): Readable<L2ToL1LogProof | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<L2ToL1LogProof | null> => {
    const method = "zks_getL2ToL1LogProof"
    const parameters = parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : [
          parameters.txHash,
          parameters.index ?? null,
          parameters.interopMode ?? null,
        ]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      nullable(L2ToL1LogProofSchema),
      response.result,
    )
  }
}
