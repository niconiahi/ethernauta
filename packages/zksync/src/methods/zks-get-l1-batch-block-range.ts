// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getl1batchblockrange
// Half-open `[firstL2Block, lastL2Block]` range of L2 blocks
// contained in an L1 batch. Returns null until the batch is sealed.

import type { Uint64 } from "@ethernauta/core"
import { Uint64Schema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  CallSchema,
  RpcNumberSchema,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  nullable,
  object,
  parse,
  pipe,
  transform,
  tuple,
  union,
} from "valibot"

const ParametersSchema = union([
  tuple([Uint64Schema]),
  object({ batch: Uint64Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

// Normalize each element through RpcNumberSchema before brand-checking
// the U64 — nodes emit batch numbers as decimal strings on some
// historical paths.
const RangeSchema = pipe(
  tuple([RpcNumberSchema, RpcNumberSchema]),
  transform(([lo, hi]): [Uint64, Uint64] => [
    parse(Uint64Schema, lo),
    parse(Uint64Schema, hi),
  ]),
)

export function zks_getL1BatchBlockRange(
  _parameters: Parameters,
): Readable<[Uint64, Uint64] | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<[Uint64, Uint64] | null> => {
    const method = "zks_getL1BatchBlockRange"
    const parameters = parse(ParametersSchema, _parameters)
    const positional: [Uint64] = Array.isArray(parameters)
      ? parameters
      : [parameters.batch]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(nullable(RangeSchema), response.result)
  }
}
