import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { FilterResults } from "../../core/filter"
import {
  FilterResultsSchema,
  FilterSchema,
} from "../../core/filter"

const ParametersSchema = union([
  tuple([FilterSchema]),
  object({ filter: FilterSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns All logs matching filter with given id
 */
export function eth_getLogs(
  _parameters: Parameters,
): Readable<FilterResults> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<FilterResults> => {
    const method = "eth_getLogs"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      FilterResultsSchema,
      response.result,
    )
    return result
  }
}
