import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { FilterResults } from "@ethernauta/core"
import { filterResultsSchema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

const parametersSchema = union([
  tuple([uintSchema]),
  object({ filterIdentifier: uintSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns Logs matching filter with given id
 */
export function getFilterLogs(_parameters: Parameters): Readable<FilterResults> {
  return async (reader: Reader): Promise<FilterResults> => {
    const method = "eth_getFilterLogs"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(filterResultsSchema, response.result)
    return result
  }
}
