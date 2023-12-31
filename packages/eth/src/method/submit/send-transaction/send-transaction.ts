import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { hash32Schema } from "../../../base"
import type { Hash32 } from "../../../base"
import { genericTransactionSchema } from "../../../transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  object({ transaction: genericTransactionSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The transaction hash
 */
export function sendTransaction(_parameters: Parameters): Writable<Hash32> {
  return async (writer: Writer): Promise<Hash32> => {
    const method = "eth_sendTransaction"
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
