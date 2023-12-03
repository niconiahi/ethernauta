import { Block, NotFound, blockSchema, hash32Schema, notFoundSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple, union } from 'valibot'

const parametersSchema = tuple([hash32Schema])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns information about a transaction by block hash and transaction index position
 * @param blockHash The block hash in which to search
 * @param hydratedTransactions Return transaction as objects or not
 * @returns The transaction information or null if not found
 */
export async function getBlockByHash(writer: Writer, _parameters: Parameters): Promise<Block | NotFound> {
  const method = 'eth_getBlockByHash'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([blockSchema, notFoundSchema]), response.result)

  return result
}
