import { BlockNumberOrTag, NotFound, TransactionInfo, Uint, notFoundSchema, transactionInfoSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse, union } from 'valibot'

/**
 * Returns information about a transaction by block number and transaction index position
 * @param blockNumberOrTag The block number or block tag containing the transaction
 * @param transactionIndex The index of the transaction within the block
 * @returns The transaction information or null if not found
 */
export async function getTransactionByBlockNumberAndIndex(writer: Writer, parameters: [BlockNumberOrTag, Uint]): Promise<TransactionInfo | NotFound> {
  const method = 'eth_getTransactionByBlockNumberAndIndex'
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([transactionInfoSchema, notFoundSchema]), response.result)

  return result
}
