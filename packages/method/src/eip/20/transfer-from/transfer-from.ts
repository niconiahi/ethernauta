import type { Input } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

import { addressSchema, uint256Schema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

const parametersSchema = union([
  tuple([addressSchema, addressSchema, uint256Schema]),
  object({
    from: addressSchema,
    to: addressSchema,
    value: uint256Schema,
  }),
])
type Parameters = Input<typeof parametersSchema>
export function transferFrom(_parameters: Parameters): Readable<boolean> {
  return async (reader: Reader): Promise<boolean> => {
    const method = "transferFrom"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(boolean(), response.result)
    return result
  }
}
