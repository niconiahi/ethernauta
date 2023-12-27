import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { NotFound, TransactionInfo } from "@ethernauta/eth"
import { blockNumberOrTagSchema, notFoundSchema, transactionInfoSchema, uintSchema } from "@ethernauta/eth"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

const parametersSchema = union([
  tuple([blockNumberOrTagSchema, uintSchema]),
  object({
    blockNumberOrTag: blockNumberOrTagSchema,
    transactionIndex: uintSchema,
  }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The transaction information or null if not found
 */
export function getTransactionByBlockNumberAndIndex(_parameters: Parameters): Readable<TransactionInfo | NotFound> {
  return async (reader: Reader): Promise<TransactionInfo | NotFound> => {
    const method = "eth_getTransactionByBlockNumberAndIndex"
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
