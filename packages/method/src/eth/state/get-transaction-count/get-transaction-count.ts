import { Uint, blockNumberOrTag, hash32Schema, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple, union } from 'valibot'

const parametersSchema = union([
  tuple([hash32Schema]),
  tuple([hash32Schema, blockNumberOrTag])
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the number of transactions sent from an address.
 * @param address The address being requested
 * @param blockNumberOrTagOrHash The block number or tag or hash being requested
 * @returns The account's balance
 */
export async function getTransactionCount(writer: Writer, _parameters: Parameters): Promise<Uint> {
  const method = 'eth_getTransactionCount'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(uintSchema, response.result)

  return result
}