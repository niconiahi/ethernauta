import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Writer } from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

import { uintSchema } from "../../../core/base"
import type { Bytes } from "../../../core/base"
import { genericTransactionSchema } from "../../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  object({ transaction: genericTransactionSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns RLP encoded transaction
 */
export function eth_signTransaction(_parameters: Parameters): Writable<Bytes> {
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
