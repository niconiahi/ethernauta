import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { uintSchema } from "../../../core/base"
import { filterResultsSchema } from "../../../core/filter"
import type { FilterResults } from "../../../core/filter"

const parametersSchema = union([
  tuple([uintSchema]),
  object({ filterIdentifier: uintSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns Logs which occurred since last poll
 */
export function getFilterChanges(_parameters: Parameters): Readable<FilterResults> {
  return async (reader: Reader): Promise<FilterResults> => {
    const method = "eth_getFilterChanges"
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
