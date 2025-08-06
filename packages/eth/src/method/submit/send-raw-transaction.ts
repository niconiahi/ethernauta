import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Http } from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

import { bytesSchema, Hash32Schema } from "../../core/base"
import type { Hash32 } from "../../core/base"

const parametersSchema = union([
  tuple([bytesSchema]),
  object({ transaction: bytesSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns The transaction hash
 */
export function eth_sendRawTransaction(
  _parameters: Parameters,
): Writable<Hash32> {
  return async (transports: Http[]): Promise<Hash32> => {
    const method = "eth_sendRawTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    console.log("response", response)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(Hash32Schema, response.result)
    return result
  }
}
