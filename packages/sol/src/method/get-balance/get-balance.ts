import type { Input } from "valibot"
import { literal, object, optional, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressSchema, uint64Schema } from "../../base"

const commitmentSchema = union([
  literal("confirmed"),
  literal("finalized"),
  literal("processed"),
])
const configurationSchema = object({
  commitment: optional(commitmentSchema),
  minContextSlot: optional(uint64Schema),
})
const parametersSchema = union([
  tuple([addressSchema, configurationSchema]),
  tuple([addressSchema]),
  object({ address: addressSchema, configuration: configurationSchema }),
  object({ address: addressSchema }),
])
const contextSchema = object({ slot: uint64Schema })
const resultSchema = object({
  context: contextSchema,
  value: uint64Schema,
})
type Result = Input<typeof resultSchema>
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The account's balance
 */
export function getBalance(_parameters: Parameters): Readable<Result> {
  return async (reader: Reader): Promise<Result> => {
    const method = "eth_getBalance"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(resultSchema, response.result)
    return result
  }
}
