import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { hash32Schema, notFoundSchema } from "../../../core/base"
import type { NotFound } from "../../../core/base"
import { receiptInfoSchema } from "../../../core/receipt"
import type { ReceiptInfo } from "../../../core/receipt"

const parametersSchema = union([
  tuple([hash32Schema]),
  object({ transactionHash: hash32Schema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The transaction receipt or null if not found
 */
export function eth_getTransactionReceipt(_parameters: Parameters): Readable<ReceiptInfo | NotFound> {
  return async (transports: Http[]): Promise<ReceiptInfo | NotFound> => {
    const method = "eth_getTransactionReceipt"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([receiptInfoSchema, notFoundSchema]), response.result)
    return result
  }
}
