import type { Input } from "valibot"
import { literal, number, object, optional, parse, string, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressSchema } from "../../core/base"

const commitmentSchema = union([
  literal("confirmed"),
  literal("finalized"),
  literal("processed"),
])
const configurationSchema = object({
  commitment: optional(commitmentSchema),
  minContextSlot: optional(number()),
})
const parametersSchema = union([
  tuple([addressSchema, configurationSchema]),
  tuple([addressSchema]),
  object({ address: addressSchema, configuration: optional(configurationSchema) }),
])
const contextSchema = object({ apiVersion: string(), slot: number() })
const resultSchema = object({
  context: contextSchema,
  value: number(),
})
type Result = Input<typeof resultSchema>
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The account's balance
 */
export function getBalance(_parameters: Parameters): Readable<Result> {
  return async (transports: Http[]): Promise<Result> => {
    const method = "getBalance"
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
