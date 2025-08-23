import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  
} from "valibot"

import {
  AddressSchema
} from "@ethernauta/eth"
import type {
  Address
} from "@ethernauta/eth"

const parametersSchema = union([
  tuple([AddressSchema]),
  object({
    owner: AddressSchema
  })
])
type Parameters = InferOutput<typeof parametersSchema>
export function balanceOf(
  _parameters: Parameters,
): Readable<Address> {
  return async (
    transports: Http[],
  ): Promise<Address> => {
    const method = "balanceOf"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([AddressSchema]),
      response.result,
    )
    return result
  }
}