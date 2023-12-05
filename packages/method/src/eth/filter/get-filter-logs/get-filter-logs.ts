import type { FilterResults } from "@ethernauta/core"
import { filterResultsSchema, uintSchema } from "@ethernauta/core"
import type { Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { parse, tuple } from "valibot"

const parametersSchema = tuple([uintSchema])
type Parameters = Input<typeof parametersSchema>
/**
 * Polling method for a filter, which returns an array of logs which occurred since last pollCreates a filter in the node, to notify when a new block arrives
 * @param filterIdentifier The filter identifier
 * @returns The filter results
 */
export async function getFilterLogs(writer: Writer, _parameters: Parameters): Promise<FilterResults> {
  const method = "eth_getFilterLogs"
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  if ("error" in response) {
    throw new Error(response.error.message)
  }

  const result = parse(filterResultsSchema, response.result)

  return result
}
