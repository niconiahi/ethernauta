// https://docs.optimism.io/operators/node-operators/json-rpc#optimism_safeheadatl1block

import { UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { SafeHeadAtL1Block } from "../core/safe-head-at-l1-block"
import { SafeHeadAtL1BlockSchema } from "../core/safe-head-at-l1-block"

const ParametersSchema = union([
  tuple([UintSchema]),
  object({ l1BlockNumber: UintSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The L1 block at the given L1 block number plus the
 * highest L2 safe head that was reached during derivation
 * from L1 blocks at or below that height.
 */
export function optimism_safeHeadAtL1Block(
  _parameters: Parameters,
): Readable<SafeHeadAtL1Block> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<SafeHeadAtL1Block> => {
    const method = "optimism_safeHeadAtL1Block"
    const parameters = parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : [parameters.l1BlockNumber]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      SafeHeadAtL1BlockSchema,
      response.result,
    )
    return result
  }
}
