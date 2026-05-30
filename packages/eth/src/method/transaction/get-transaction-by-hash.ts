import type { NotFound } from "@ethernauta/core"
import {
  Hash32Schema,
  NotFoundSchema,
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
  tuple([Hash32Schema]),
  object({ transactionHash: Hash32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The transaction information or null if not found
 */
export function eth_getTransactionByHash(
  _parameters: Parameters,
): Readable<TransactionInfo | NotFound> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<
    TransactionInfo | NotFound
  > => {
    const method = "eth_getTransactionByHash"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
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
