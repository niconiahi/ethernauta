import { Hash32, bytesSchema, hash32Schema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple } from 'valibot'

const parametersSchema = tuple([bytesSchema])
type Parameters = Input<typeof parametersSchema>
/**
 * Signs and submits a transaction to the Ethereum network
 * @param transaction The transaction to be sent
 * @returns The transaction hash
 */
export async function sendRawTransaction(writer: Writer, _parameters: Parameters): Promise<Hash32> {
  const method = 'eth_sendRawTransaction'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(hash32Schema, response.result)

  return result
}
