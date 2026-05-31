// https://github.com/OffchainLabs/nitro/blob/master/arbnode/api.go#L52
// `arb_getL1Confirmations(blockNumber)` — how many L1 confirmations
// the batch containing this L2 block has accumulated. Registered as
// `Public: true` on the consensus-side `arb` namespace in
// `arbnode/node.go`, exposed by operators that whitelist `arb` in
// their RPC namespace allowlist.

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
 * @returns The number of L1 confirmations for the batch containing
 * the given L2 block. `0` means the batch hasn't been posted to L1
 * yet (or hasn't been seen as posted by the answering node).
 */
export function arb_getL1Confirmations(
  _parameters: Parameters,
): Readable<Uint64> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint64> => {
    const method = "arb_getL1Confirmations"
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
