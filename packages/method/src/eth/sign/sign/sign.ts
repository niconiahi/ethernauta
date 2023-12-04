import type { Bytes65 } from '@ethernauta/core'
import { addressSchema, bytesSchema, uintSchema } from '@ethernauta/core'
import type { Writer } from '@ethernauta/transport'
import { callSchema } from '@ethernauta/transport'
import type { Input } from 'valibot'
import { parse, tuple } from 'valibot'

const parametersSchema = tuple([addressSchema, bytesSchema])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns an EIP-191 signature over the provided data
 * @param address The signing address
 * @param message The message to be signed
 * @returns The signature
 */
export async function sign(writer: Writer, _parameters: Parameters): Promise<Bytes65> {
  const method = 'eth_sign'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  if ('error' in response)
    throw new Error(response.error.message)

  const result = parse(uintSchema, response.result)

  return result
}
