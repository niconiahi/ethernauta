import type { Http, Writable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { parse, union, tuple, object } from "valibot"
import {
  addressSchema,
  uint256Schema,
  Hash32Schema,
} from "@ethernauta/eth"
import type { Hash32 } from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({
    to: addressSchema,
    tokenId: uint256Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function approve(
  _parameters: Parameters,
): Writable<Hash32> {
  return async (transports: Http[]): Promise<Hash32> => {
    const method = "approve"
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
