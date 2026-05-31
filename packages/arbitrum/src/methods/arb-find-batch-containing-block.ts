// https://github.com/OffchainLabs/nitro/blob/master/arbnode/api.go#L62
// `arb_findBatchContainingBlock(blockNumber)` — the L1 batch index
// that includes this L2 block. Useful for cross-referencing L2
// blocks against `SequencerInbox` batch metadata on L1. Registered
// as `Public: true` alongside `arb_getL1Confirmations`.

import type { Uint, Uint64 } from "@ethernauta/core"
import { Uint64Schema, UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  CallSchema,
  RpcNumberSchema,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([UintSchema]),
  object({ blockNumber: UintSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

/**
 * @returns The L1 batch index containing the given L2 block. Throws
 * if the block hasn't been included in any batch yet (typically
 * because it's pending sequencer batch-posting).
 */
export function arb_findBatchContainingBlock(
  _parameters: Parameters,
): Readable<Uint64> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint64> => {
    const method = "arb_findBatchContainingBlock"
    const parameters = parse(ParametersSchema, _parameters)
    const positional: [Uint] = Array.isArray(parameters)
      ? parameters
      : [parameters.blockNumber]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      Uint64Schema,
      parse(RpcNumberSchema, response.result),
    )
  }
}
