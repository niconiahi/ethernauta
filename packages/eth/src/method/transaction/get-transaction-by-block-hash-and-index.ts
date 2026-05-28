import type { NotFound } from "@ethernauta/core"
import {
  Hash32Schema,
  NotFoundSchema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { TransactionInfo } from "../../core/transaction"
import { TransactionInfoSchema } from "../../core/transaction"

const ParametersSchema = union([
  tuple([Hash32Schema, UintSchema]),
  object({
    blockHash: Hash32Schema,
    transactionIndex: UintSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
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
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([TransactionInfoSchema, NotFoundSchema]),
      response.result,
    )
    return result
  }
}
