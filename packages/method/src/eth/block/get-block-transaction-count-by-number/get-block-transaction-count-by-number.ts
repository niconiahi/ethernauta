import { NotFound, Uint, blockNumberOrTag, notFoundSchema, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, boolean, parse, tuple, union } from 'valibot'

const parametersSchema = tuple([blockNumberOrTag, boolean()])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the number of transactions in a block matching the given block number
 * @param blockNumberOrTag The block number or tag where to search
 * @returns The transaction count or null if not found
 */
export async function getBlockTransactionCountByNumber(writer: Writer, _parameters: Parameters): Promise<Uint | NotFound> {
  const method = 'eth_getBlockTransactionCountByNumber'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([uintSchema, notFoundSchema]), response.result)

  return result
}