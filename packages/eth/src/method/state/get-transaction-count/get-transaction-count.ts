import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressSchema, uintSchema } from "../../../core/base"
import type { Uint } from "../../../core/base"
import { blockNumberOrTagOrHashSchema } from "../../../core/block"

const parametersSchema = union([
  tuple([addressSchema, blockNumberOrTagOrHashSchema]),
  tuple([addressSchema]),
  object({ address: addressSchema, blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema }),
  object({ address: addressSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The number of transactions sent from an address
 */
export function eth_getTransactionCount(_parameters: Parameters): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_getTransactionCount"
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
