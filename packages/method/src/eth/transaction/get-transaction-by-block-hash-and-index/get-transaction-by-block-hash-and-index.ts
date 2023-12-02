import { Hash32, NotFound, TransactionInfo, Uint, notFoundSchema, transactionInfoSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse, union } from 'valibot'

/**
 * Returns information about a transaction by block hash and transaction index position
 * @param blockHash The transaction hash to be sent
 * @param transactionIndex The index of the transaction within the block
 * @returns The transaction information or null if not found
 */
export async function getTransactionByHashAndIndex(writer: Writer, parameters: [Hash32, Uint]): Promise<TransactionInfo | NotFound> {
  const method = 'eth_getTransactionByHashAndIndex'
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([transactionInfoSchema, notFoundSchema]), response.result)

  return result
}
