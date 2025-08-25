import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { parse, union, tuple, object } from "valibot"
import {
  uint256Schema,
  addressSchema,
} from "@ethernauta/eth"
import type { Address } from "@ethernauta/eth"

const parametersSchema = union([
  tuple([uint256Schema]),
  object({
    tokenId: uint256Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function getApproved(
  _parameters: Parameters,
): Readable<Address> {
  return async (transports: Http[]): Promise<Address> => {
    const method = "getApproved"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([addressSchema]),
      response.result,
    )
    return result
  }
}
