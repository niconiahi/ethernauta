import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { hash32Schema, notFoundSchema } from "../../../base"
import type { NotFound } from "../../../base"
import { transactionInfoSchema } from "../../../transaction"
import type { TransactionInfo } from "../../../transaction"

const parametersSchema = union([
  tuple([hash32Schema]),
  object({ transactionHash: hash32Schema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The transaction information or null if not found
 */
export function getTransactionByHash(_parameters: Parameters): Readable<TransactionInfo | NotFound> {
  return async (reader: Reader): Promise<TransactionInfo | NotFound> => {
    const method = "eth_getTransactionByHash"
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
