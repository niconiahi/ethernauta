import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  parse,
  tuple,
  object,
  union,
  boolean,
} from "valibot"
import { addressSchema } from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema]),
  object({
    owner: addressSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function isApprovedForAll(
  _parameters: Parameters,
): Readable<Hash32> {
  return async (transports: Http[]): Promise<Hash32> => {
    const method = "isApprovedForAll"
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
