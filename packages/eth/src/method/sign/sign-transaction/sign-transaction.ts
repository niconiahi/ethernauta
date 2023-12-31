import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { uintSchema } from "../../../base"
import type { Bytes } from "../../../base"
import { genericTransactionSchema } from "../../../transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  object({ transaction: genericTransactionSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns RLP encoded transaction
 */
export function signTransaction(_parameters: Parameters): Writable<Bytes> {
  return async (writer: Writer): Promise<Bytes> => {
    const method = "eth_signTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await writer(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
