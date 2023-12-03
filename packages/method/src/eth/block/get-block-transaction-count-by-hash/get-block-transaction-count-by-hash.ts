import { NotFound, Uint, blockNumberOrTag, notFoundSchema, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple, union } from 'valibot'

const parametersSchema = tuple([blockNumberOrTag])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the number of transactions in a block from a block matching the given block hash
 * @param blockHash The block hash in which to search
 * @returns The transaction count or null if not found
 */
export async function getBlockTransactionCountByHash(writer: Writer, _parameters: Parameters): Promise<Uint | NotFound> {
  const method = 'eth_getBlockTransactionCountByHash'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([uintSchema, notFoundSchema]), response.result)

  return result
}
