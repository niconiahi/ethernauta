import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressSchema, uint256Schema, uintSchema } from "../../../core/base"
import type { Uint } from "../../../core/base"
import { blockNumberOrTagOrHashSchema } from "../../../core/block"

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
export function eth_getStorageAt(_parameters: Parameters): Readable<Uint> {
  return async (transports: Http[]): Promise<Uint> => {
    const method = "eth_getStorageAt"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
