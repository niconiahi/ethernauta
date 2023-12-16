import type { Block, NotFound } from "@ethernauta/core"
import { blockNumberOrTagSchema, blockSchema, notFoundSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([blockNumberOrTagSchema, boolean()]),
  object({
    blockNumberOrTag: blockNumberOrTagSchema,
    hydratedTransactions: boolean(),
  }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns information about a transaction by block hash and transaction index position
 * @typedef {BlockNumberOrTag} blockNumberOrTag The block number or tag in which to search
 * @typedef {boolean} hydratedTransactions Return transaction as objects or not
 * @typedef {[blockNumberOrTag, hydratedTransactions]} Parameters
 * @param {Parameters} _parameters
 * @returns The transaction information or null if not found
 */
export function getBlockByNumber(_parameters: Parameters): Readable<Block | NotFound> {
  return async (reader: Reader): Promise<Block | NotFound> => {
    const method = "eth_getBlockByNumber"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([blockSchema, notFoundSchema]), response.result)
    return result
  }
}
