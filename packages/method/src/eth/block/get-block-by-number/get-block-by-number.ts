import { Block, NotFound, blockNumberOrTag, blockSchema, notFoundSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple, union } from 'valibot'

const parametersSchema = tuple([blockNumberOrTag])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns information about a transaction by block hash and transaction index position
 * @param blockHash The block hash in which to search
 * @param hydratedTransactions Return transaction as objects or not
 * @returns The transaction information or null if not found
 */
export async function getBlockByNumber(writer: Writer, _parameters: Parameters): Promise<Block | NotFound> {
  const method = 'eth_getBlockByNumber'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([blockSchema, notFoundSchema]), response.result)

  return result
}