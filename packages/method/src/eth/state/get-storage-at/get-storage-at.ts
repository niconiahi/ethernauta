import { Uint, blockNumberOrTagOrHash, hash32Schema, uint256Schema, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple, union } from 'valibot'

const parametersSchema = union([
  tuple([hash32Schema, uint256Schema]),
  tuple([hash32Schema, uint256Schema, blockNumberOrTagOrHash])
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the value from a storage position at a given address
 * @param address The address being requested
 * @param storageSlot The storage slot being requested
 * @param blockNumberOrTagOrHash The block number or tag or hash being requested
 * @returns The account's balance
 */
export async function getStorageAt(writer: Writer, _parameters: Parameters): Promise<Uint> {
  const method = 'eth_getStorageAt'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(uintSchema, response.result)

  return result
}
