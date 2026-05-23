import type { NotFound } from "@ethernauta/core"
import {
  hash32Schema,
  notFoundSchema,
  uintSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { TransactionInfo } from "../../core/transaction"
import { TransactionInfoSchema } from "../../core/transaction"

const parametersSchema = union([
  tuple([hash32Schema, uintSchema]),
  object({
    blockHash: hash32Schema,
    transactionIndex: uintSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns Transaction information or null if not found
 */
export function eth_getTransactionByBlockHashAndIndex(
  _parameters: Parameters,
): Readable<TransactionInfo | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<
    TransactionInfo | NotFound
  > => {
    const method = "eth_getTransactionByBlockHashAndIndex"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([TransactionInfoSchema, notFoundSchema]),
      response.result,
    )
    return result
  }
}
