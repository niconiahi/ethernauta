import { Bytes, blockNumberOrTagOrHash, bytesSchema, genericTransactionSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple, union } from 'valibot'

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  tuple([genericTransactionSchema, blockNumberOrTagOrHash])
])
type Parameters = Input<typeof parametersSchema>
/**
 * Executes a new message call immediately without creating a transaction on the block chain
 * @param transaction The transaction object to be sent
 * @param blockNumberOrTag The block number or tag where to execute the call
 * @returns The returned data
 */
export async function call(writer: Writer, _parameters: Parameters): Promise<Bytes> {
  const method = 'eth_call'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(bytesSchema, response.result)

  return result
}
