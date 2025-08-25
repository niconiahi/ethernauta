import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  boolean,
} from "valibot"

import {
  addressSchema,
  uint256Schema,
} from "@ethernauta/eth"
import type {} from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    to: addressSchema,
    value: uint256Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function transfer(
  _parameters: Parameters,
): Readable<boolean> {
  return async (transports: Http[]): Promise<boolean> => {
    const method = "transfer"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([boolean()]),
      response.result,
    )
    return result
  }
}
