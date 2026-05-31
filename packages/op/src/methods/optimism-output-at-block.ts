// https://docs.optimism.io/operators/node-operators/json-rpc#optimism_outputatblock

import { UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { OutputResponse } from "../core/output-response"
import { OutputResponseSchema } from "../core/output-response"

const ParametersSchema = union([
  tuple([UintSchema]),
  object({ blockNumber: UintSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The output root and L2 block reference at the
 * given L2 block number, plus the syncStatus of the
 * answering node.
 */
export function optimism_outputAtBlock(
  _parameters: Parameters,
): Readable<OutputResponse> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<OutputResponse> => {
    const method = "optimism_outputAtBlock"
    const parameters = parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : [parameters.blockNumber]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      OutputResponseSchema,
      response.result,
    )
    return result
  }
}
