import type { Input } from "valibot"
import { literal, object, parse, tuple, undefined_, union } from "valibot"

import type { Uint } from "@ethernauta/eth"
import { uintSchema } from "@ethernauta/eth"
import { uint64Schema } from "@ethernauta/sol"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

const commitmentSchema = union([
  literal("confirmed"),
  literal("finalized"),
  literal("processed"),
])

const parametersSchema = union([
  tuple([commitmentSchema, uint64Schema]),
  tuple([commitmentSchema]),
  object({ commitment: commitmentSchema, minContextSlot: uint64Schema }),
  object({ commitment: commitmentSchema }),
  undefined_(),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The account's balance
 */
export function getBalance(_parameters: Parameters): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_getBalance"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
