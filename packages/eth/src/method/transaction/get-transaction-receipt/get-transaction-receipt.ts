import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { hash32Schema, notFoundSchema } from "../../../base"
import type { NotFound } from "../../../base"
import { receiptInfoSchema } from "../../../receipt"
import type { ReceiptInfo } from "../../../receipt"

const parametersSchema = union([
  tuple([hash32Schema]),
  object({ transactionHash: hash32Schema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The transaction receipt or null if not found
 */
export function getTransactionReceipt(_parameters: Parameters): Readable<ReceiptInfo | NotFound> {
  return async (reader: Reader): Promise<ReceiptInfo | NotFound> => {
    const method = "eth_getTransactionReceipt"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([receiptInfoSchema, notFoundSchema]), response.result)
    return result
  }
}
