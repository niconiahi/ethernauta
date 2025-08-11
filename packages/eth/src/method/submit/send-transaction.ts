import type { Http, Writable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Hash32 } from "../../core/base"
import { Hash32Schema } from "../../core/base"
import { genericTransactionSchema } from "../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  object({ transaction: genericTransactionSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns The transaction hash
 */
export function eth_sendTransaction(
  _parameters: Parameters,
): Writable<Hash32> {
  return async (transports: Http[]): Promise<Hash32> => {
    const method = "eth_sendTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(Hash32Schema, response.result)
    return result
  }
}
