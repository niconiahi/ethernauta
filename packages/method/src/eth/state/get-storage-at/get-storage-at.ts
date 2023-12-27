import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Uint } from "@ethernauta/eth"
import { addressSchema, blockNumberOrTagOrHashSchema, uint256Schema, uintSchema } from "@ethernauta/eth"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

const parametersSchema = union([
  tuple([addressSchema, uint256Schema, blockNumberOrTagOrHashSchema]),
  tuple([addressSchema, uint256Schema]),
  object({
    address: addressSchema,
    storageSlot: uint256Schema,
  }),
  object({
    address: addressSchema,
    storageSlot: uint256Schema,
    blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema,
  }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The value from a storage position at a given address
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
