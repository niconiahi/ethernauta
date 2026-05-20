import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { NotFound } from "@ethernauta/core"
import {
  hash32Schema,
  notFoundSchema,
} from "@ethernauta/core"
import type { ReceiptInfo } from "../../core/receipt"
import { receiptInfoSchema } from "../../core/receipt"

const parametersSchema = union([
  tuple([hash32Schema]),
  object({ transactionHash: hash32Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns The transaction receipt or null if not found
 */
export function eth_getTransactionReceipt(
  _parameters: Parameters,
): Readable<ReceiptInfo | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<ReceiptInfo | NotFound> => {
    const method = "eth_getTransactionReceipt"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([receiptInfoSchema, notFoundSchema]),
      response.result,
    )
    return result
  }
}
