import type { Http, Writable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  parse,
  tuple,
  object,
  union,
  boolean,
} from "valibot"
import {
  addressSchema,
  Hash32Schema,
} from "@ethernauta/eth"
import type { Hash32 } from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema, boolean()]),
  object({
    operator: addressSchema,
    approved: boolean(),
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function setApprovalForAll(
  _parameters: Parameters,
): Writable<Hash32> {
  return async (transports: Http[]): Promise<Hash32> => {
    const method = "setApprovalForAll"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([Hash32Schema]),
      response.result,
    )
    return result
  }
}
