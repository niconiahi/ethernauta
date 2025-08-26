import type { Uint256 } from "@ethernauta/eth"
import {
  addressSchema,
  uint256Schema,
} from "@ethernauta/eth"
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([addressSchema]),
  object({
    owner: addressSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function balanceOf(
  _parameters: Parameters,
): Readable<Uint256> {
  return async (transports: Http[]): Promise<Uint256> => {
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
