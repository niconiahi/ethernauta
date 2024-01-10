import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { bytesSchema, hash32Schema } from "../../../core/base"
import type { Hash32 } from "../../../core/base"

const parametersSchema = union([
  tuple([bytesSchema]),
  object({ transaction: bytesSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The transaction hash
 */
export function eth_sendRawTransaction(_parameters: Parameters): Writable<Hash32> {
  return async (writer: Writer): Promise<Hash32> => {
    const method = "eth_sendRawTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await writer(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(hash32Schema, response.result)
    return result
  }
}
