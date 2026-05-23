import { uintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { FilterResults } from "../../core/filter"
import { filterResultsSchema } from "../../core/filter"

const parametersSchema = union([
  tuple([uintSchema]),
  object({ filterIdentifier: uintSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns Logs which occurred since last poll
 */
export function eth_getFilterChanges(
  _parameters: Parameters,
): Readable<FilterResults> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<FilterResults> => {
    const method = "eth_getFilterChanges"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      filterResultsSchema,
      response.result,
    )
    return result
  }
}
