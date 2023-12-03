import { Bytes, genericTransactionSchema, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple } from 'valibot'

const parametersSchema = tuple([genericTransactionSchema])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns an RLP encoded transaction signed by the specified account.
 * @param transaction The transaction to be signed
 * @returns The encoded transaction
 */
export async function signTransaction(writer: Writer, _parameters: Parameters): Promise<Bytes> {
  const method = 'eth_signTransaction'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(uintSchema, response.result)

  return result
}