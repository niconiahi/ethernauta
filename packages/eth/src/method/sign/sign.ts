import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Http } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import {
  addressSchema,
  bytesSchema,
  bytes65Schema,
} from "../../core/base"
import type { Bytes65 } from "../../core/base"

const parametersSchema = union([
  tuple([addressSchema, bytesSchema]),
  object({
    address: addressSchema,
    message: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns The EIP-191 signature over the provided data
 */
export function eth_sign(
  _parameters: Parameters,
): Writable<Bytes65> {
  return async (transports: Http[]): Promise<Bytes65> => {
    const method = "eth_sign"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(bytes65Schema, response.result)
    return result
  }
}
