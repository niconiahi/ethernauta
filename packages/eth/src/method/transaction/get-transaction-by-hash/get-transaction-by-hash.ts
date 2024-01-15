import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { hash32Schema, notFoundSchema } from "../../../core/base"
import type { NotFound } from "../../../core/base"
import { transactionInfoSchema } from "../../../core/transaction"
import type { TransactionInfo } from "../../../core/transaction"

const parametersSchema = union([
  tuple([hash32Schema]),
  object({ transactionHash: hash32Schema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The transaction information or null if not found
 */
export function eth_getTransactionByHash(_parameters: Parameters): Readable<TransactionInfo | NotFound> {
  return async (transports: Http[]): Promise<TransactionInfo | NotFound> => {
    const method = "eth_getTransactionByHash"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([transactionInfoSchema, notFoundSchema]), response.result)
    return result
  }
}
