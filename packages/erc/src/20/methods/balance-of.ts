import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { parse, union, tuple, object } from "valibot"
import {
  addressSchema,
  uint256Schema,
} from "@ethernauta/eth"
import type { Uint256 } from "@ethernauta/eth"

const parametersSchema = union([
  tuple([addressSchema]),
  object({
    account: addressSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function balanceOf(
  _parameters: Parameters,
): Readable<Hash32> {
  return async (transports: Http[]): Promise<Hash32> => {
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
      union([uint256Schema]),
      response.result,
    )
    return result
  }
}
