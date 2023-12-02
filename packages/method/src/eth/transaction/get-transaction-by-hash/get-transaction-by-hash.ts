import { Hash32, NotFound, TransactionInfo, notFoundSchema, transactionInfoSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse, union } from 'valibot'

/**
 * Returns the information about a transaction requested by transaction hash
 * @param transactionHash The transaction hash to be sent
 * @returns The transaction information or null if not found
 */
export async function getTransactionByHash(writer: Writer, parameters: [Hash32]): Promise<TransactionInfo | NotFound> {
  const method = 'eth_getTransactionByHash'
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([transactionInfoSchema, notFoundSchema]), response.result)

  return result
}
