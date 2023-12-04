import type { Bytes } from '@ethernauta/core'
import { filterSchema, uintSchema } from '@ethernauta/core'
import type { Writer } from '@ethernauta/transport'
import { callSchema } from '@ethernauta/transport'
import type { Input } from 'valibot'
import { parse, tuple } from 'valibot'

const parametersSchema = tuple([filterSchema])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns an RLP encoded transaction signed by the specified account
 * @param transaction The transaction to be signed
 * @returns The encoded transaction
 */
export async function newFilter(writer: Writer, _parameters: Parameters): Promise<Bytes> {
  const method = 'eth_newFilter'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  if ('error' in response)
    throw new Error(response.error.message)

  const result = parse(uintSchema, response.result)

  return result
}
