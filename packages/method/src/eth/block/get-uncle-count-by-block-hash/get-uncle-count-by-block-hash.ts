import type { NotFound, Uint } from "@ethernauta/core"
import { hash32Schema, notFoundSchema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { parse, tuple, union } from "valibot"

const parametersSchema = tuple([hash32Schema])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the number of transactions in a block from a block matching the given block hash
 * @param blockHash The block hash in which to search
 * @returns The transaction count or null if not found
 */
export function getUncleCountByBlockHash(_parameters: Parameters): Readable<Uint | NotFound> {
  return async (reader: Reader): Promise<Uint | NotFound> => {
    const method = "eth_getUncleCountByBlockHash"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([uintSchema, notFoundSchema]), response.result)
    return result
  }
}
