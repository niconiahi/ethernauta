import { Uint, blockNumberOrTag, genericTransactionSchema, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple, union } from 'valibot'

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  tuple([genericTransactionSchema, blockNumberOrTag])
])
type Parameters = Input<typeof parametersSchema>
/**
 * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete
 * @param transaction The transaction object to be sent
 * @param blockNumberOrTag The block number or tag where to simulate
 * @returns The gas used
 */
export async function estimateGas(writer: Writer, _parameters: Parameters): Promise<Uint> {
  const method = 'eth_estimateGas'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  if ('error' in response) {
    throw new Error(response.error.message)
  }
  const result = parse(uintSchema, response.result)

  return result
}
