import { bytes4Schema } from "@ethernauta/eth"
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const parametersSchema = union([
  tuple([bytes4Schema]),
  object({
    interfaceId: bytes4Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function supportsInterface(
  _parameters: Parameters,
): Readable<boolean> {
  return async (transports: Http[]): Promise<boolean> => {
    const method = "supportsInterface"
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
