import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { Uint256 } from "../../../../core/base"
import { addressSchema, uint256Schema } from "../../../../core/base"

const parametersSchema = union([
  tuple([addressSchema]),
  object({
    owner: addressSchema,
  }),
])
type Parameters = Input<typeof parametersSchema>
export function balanceOf(_parameters: Parameters): Readable<Uint256> {
  return async (transports: Http[]): Promise<Uint256> => {
    const method = "balanceOf"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uint256Schema, response.result)
    return result
  }
}
