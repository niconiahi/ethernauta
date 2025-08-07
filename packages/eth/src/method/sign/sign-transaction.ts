import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Writable, Http } from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

import { bytesSchema } from "../../core/base"
import type { Bytes } from "../../core/base"
import { genericTransactionSchema } from "../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  object({ transaction: genericTransactionSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns RLP encoded transaction
 */
export function eth_signTransaction(
  _parameters: Parameters,
): Writable<Bytes> {
  return async (transports: Http[]): Promise<Bytes> => {
    const method = "eth_signTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(bytesSchema, response.result)
    return result
  }
}
