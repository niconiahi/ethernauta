import type { Uint } from '@ethernauta/core'
import { uintSchema } from '@ethernauta/core'
import type { Writer } from '@ethernauta/transport'
import { callSchema } from '@ethernauta/transport'
import { parse } from 'valibot'

/**
 * Returns the chain ID of the current network
 * @returns The id of the chain
 */
export async function chainId(writer: Writer): Promise<Uint> {
  const method = 'eth_chainId'
  const call = parse(callSchema, [method])
  const response = await writer(call)
  if ('error' in response) {
    throw new Error(response.error.message)
  }

  const result = parse(uintSchema, response.result)

  return result
}
