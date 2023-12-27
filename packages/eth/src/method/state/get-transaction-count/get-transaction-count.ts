import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Uint } from "@ethernauta/eth"
import { addressSchema, blockNumberOrTagOrHashSchema, uintSchema } from "@ethernauta/eth"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

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
export function getTransactionCount(_parameters: Parameters): Readable<Uint> {
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
