import type { Address, Uint256 } from "@ethernauta/eth"
import {
  addressSchema,
  uint256Schema,
} from "@ethernauta/eth"
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

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
): Readable<Address | Uint256> {
  return async (
    transports: Http[],
  ): Promise<Address | Uint256> => {
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
      union([addressSchema, uint256Schema]),
      response.result,
    )
    return result
  }
}
