import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressSchema, uintSchema } from "../../../base"
import type { Uint } from "../../../base"
import { blockNumberOrTagOrHashSchema } from "../../../block"

const parametersSchema = union([
  tuple([addressSchema]),
  tuple([addressSchema, blockNumberOrTagOrHashSchema]),
  object({ address: addressSchema, blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema }),
  object({ address: addressSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns Code at a given address
 */
export function getCode(_parameters: Parameters): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_getCode"
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
