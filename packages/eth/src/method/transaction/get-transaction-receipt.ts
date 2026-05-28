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
import type { ReceiptInfo } from "../../core/receipt"
import { ReceiptInfoSchema } from "../../core/receipt"

const ParametersSchema = union([
  tuple([Hash32Schema]),
  object({ transactionHash: Hash32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
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
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([ReceiptInfoSchema, NotFoundSchema]),
      response.result,
    )
    return result
  }
}
