import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Uint256 } from "@ethernauta/core"
import { addressSchema, uint256Schema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    owner: addressSchema,
    value: uint256Schema,
  }),
])
type Parameters = Input<typeof parametersSchema>
export function allowance(_parameters: Parameters): Readable<Uint256> {
  return async (reader: Reader): Promise<Uint256> => {
    const method = "allowance"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uint256Schema, response.result)
    return result
  }
}
