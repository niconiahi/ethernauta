import type { NotFound, TransactionInfo } from "@ethernauta/core"
import { hash32Schema, notFoundSchema, transactionInfoSchema } from "@ethernauta/core"
import type { Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { parse, tuple, union } from "valibot"

const parametersSchema = tuple([hash32Schema])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the information about a transaction requested by transaction hash
 * @param transactionHash The hash of the transaction that's being requested
 * @returns The transaction information or null if not found
 */
export async function getTransactionByHash(writer: Writer, _parameters: Parameters): Promise<TransactionInfo | NotFound> {
  const method = "eth_getTransactionByHash"
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  if ("error" in response) {
    throw new Error(response.error.message)
  }

  const result = parse(union([transactionInfoSchema, notFoundSchema]), response.result)

  return result
}
