import type { Uint } from '@ethernauta/core'
import { blockNumberOrTagOrHash, hash32Schema, uintSchema } from '@ethernauta/core'
import type { Writer } from '@ethernauta/transport'
import { callSchema } from '@ethernauta/transport'
import type { Input } from 'valibot'
import { parse, tuple, union } from 'valibot'

const parametersSchema = union([
  tuple([hash32Schema]),
  tuple([hash32Schema, blockNumberOrTagOrHash]),
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns code at a given address
 * @param address The address being requested
 * @param blockNumberOrTagOrHash The block number or tag or hash being requested
 * @returns The account's balance
 */
export async function getCode(writer: Writer, _parameters: Parameters): Promise<Uint> {
  const method = 'eth_getCode'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  if ('error' in response)
    throw new Error(response.error.message)

  const result = parse(uintSchema, response.result)

  return result
}
