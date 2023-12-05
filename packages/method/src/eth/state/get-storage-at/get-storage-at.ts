import type { Uint } from "@ethernauta/core"
import { blockNumberOrTagOrHash, hash32Schema, uint256Schema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { parse, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([hash32Schema, uint256Schema]),
  tuple([hash32Schema, uint256Schema, blockNumberOrTagOrHash]),
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the value from a storage position at a given address
 * @param address The address being requested
 * @param storageSlot The storage slot being requested
 * @param blockNumberOrTagOrHash The block number or tag or hash being requested
 * @returns The account's balance
 */
export function getStorageAt(_parameters: Parameters): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_getStorageAt"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
