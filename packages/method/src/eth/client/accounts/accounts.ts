import type { Addresses } from '@ethernauta/core'
import { addressesSchema } from '@ethernauta/core'
import type { Writer } from '@ethernauta/transport'
import { callSchema } from '@ethernauta/transport'
import { parse } from 'valibot'

/**
 * Returns a list of addresses owned by client
 * @returns The coinbase address
 */
export async function accounts(writer: Writer): Promise<Addresses> {
  const method = 'eth_accounts'
  const call = parse(callSchema, [method])
  const response = await writer(call)
  const result = parse(addressesSchema, response.result)

  return result
}
