import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { hash32Schema, notFoundSchema, uintSchema } from "../../../core/base"
import type { NotFound } from "../../../core/base"
import { transactionInfoSchema } from "../../../core/transaction"
import type { TransactionInfo } from "../../../core/transaction"

const parametersSchema = union([
  tuple([hash32Schema, uintSchema]),
  object({
    blockHash: hash32Schema,
    transactionIndex: uintSchema,
  }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns Transaction information or null if not found
 */
export function getTransactionByBlockHashAndIndex(_parameters: Parameters): Readable<TransactionInfo | NotFound> {
  return async (reader: Reader): Promise<TransactionInfo | NotFound> => {
    const method = "eth_getTransactionByBlockHashAndIndex"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([transactionInfoSchema, notFoundSchema]), response.result)
    return result
  }
}
