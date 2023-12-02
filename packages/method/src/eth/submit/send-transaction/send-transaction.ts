import { GenericTransaction, Hash32, hash32Schema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse } from 'valibot'

/**
 * Signs and submits a transaction to the Ethereum network.
 * @param transaction The transaction object to be sent.
 * @returns The transaction hash as a promise.
 */
export async function sendTransaction(writer: Writer, parameters: [GenericTransaction]): Promise<Hash32> {
  const method = 'eth_sendTransaction'
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(hash32Schema, response.result)

  return result
}
