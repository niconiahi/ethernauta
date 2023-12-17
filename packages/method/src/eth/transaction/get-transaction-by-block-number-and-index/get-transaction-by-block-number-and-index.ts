import type { NotFound, TransactionInfo } from "@ethernauta/core"
import { blockNumberOrTagSchema, notFoundSchema, transactionInfoSchema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([blockNumberOrTagSchema, uintSchema]),
  object({
    blockNumberOrTag: blockNumberOrTagSchema,
    transactionIndex: uintSchema,
  }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns information about a transaction by block number and transaction index position
 * @param blockNumberOrTag The block number or block tag in which to search
 * @param transactionIndex The index of the transaction within the block
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
