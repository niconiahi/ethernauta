import type { NotFound, Uint } from "@ethernauta/core"
import { hash32Schema, notFoundSchema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([hash32Schema]),
  object({ blockHash: hash32Schema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the number of transactions in a block from a block matching the given block hash
 * @typedef {Hash32} blockHash The block hash in which to search
 * @typedef {[blockHash]} Parameters
 * @param {Parameters} _parameters
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
