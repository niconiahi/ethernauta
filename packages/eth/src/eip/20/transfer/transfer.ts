import type { Input } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

import { addressSchema, uint256Schema } from "@ethernauta/eth"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    to: addressSchema,
    value: uint256Schema,
  }),
])
type Parameters = Input<typeof parametersSchema>
export function transfer(_parameters: Parameters): Readable<boolean> {
  return async (reader: Reader): Promise<boolean> => {
    const method = "transfer"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(boolean(), response.result)
    return result
  }
}
