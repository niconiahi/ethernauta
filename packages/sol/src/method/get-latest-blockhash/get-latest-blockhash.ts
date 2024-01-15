import type { Input } from "valibot"
import { number, object, optional, parse, string, tuple, undefined_, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { base58Schema, commitmentSchema } from "../../core"

const configurationSchema = object({
  commitment: optional(commitmentSchema),
  minContextSlot: optional(number()),
})
const parametersSchema = union([
  tuple([configurationSchema]),
  object({ configuration: configurationSchema }),
  undefined_(),
])
const contextSchema = object({ apiVersion: string(), slot: number() })
const valueSchema = object({
  blockhash: base58Schema,
  lastValidBlockHeight: number(),
})
const resultSchema = object({
  context: contextSchema,
  value: valueSchema,
})
type Result = Input<typeof resultSchema>
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The account's balance
 */
export function getLatestBlockhash(_parameters?: Parameters): Readable<Result> {
  return async (transports: Http[]): Promise<Result> => {
    const method = "getLatestBlockhash"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(resultSchema, response.result)
  }
}
