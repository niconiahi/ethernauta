import type {
  Address,
  Bytes,
  Uint256,
} from "@ethernauta/eth"
import {
  addressSchema,
  bytesSchema,
  uint256Schema,
} from "@ethernauta/eth"
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([
    addressSchema,
    addressSchema,
    uint256Schema,
    bytesSchema,
  ]),
  object({
    from: addressSchema,
    to: addressSchema,
    tokenId: uint256Schema,
    data: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function safeTransferFrom(
  _parameters: Parameters,
): Readable<Address | Uint256 | Bytes> {
  return async (
    transports: Http[],
  ): Promise<Address | Uint256 | Bytes> => {
    const method = "safeTransferFrom"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([addressSchema, uint256Schema, bytesSchema]),
      response.result,
    )
    return result
  }
}
