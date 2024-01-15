import type { Input } from "valibot"
import { boolean, literal, number, object, optional, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { Base58 } from "../../core"
import { base58Schema, base64Schema, commitmentSchema } from "../../core"

const encodingSchema = union([
  literal("base58"),
  literal("base64"),
])
const configurationSchema = object({
  encoding: optional(encodingSchema),
  skipPreflight: optional(boolean()),
  preflightCommitment: optional(commitmentSchema),
  maxRetries: optional(number()),
  minContextSlot: optional(number()),
})
const parametersSchema = union([
  tuple([base64Schema, configurationSchema]),
  tuple([base64Schema]),
  object({ transaction: base64Schema, configuration: optional(configurationSchema) }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The account's balance
 */
export function sendTransaction(_parameters: Parameters): Readable<Base58> {
  return async (transports: Http[]): Promise<Base58> => {
    const method = "sendTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(base58Schema, response.result)
  }
}
