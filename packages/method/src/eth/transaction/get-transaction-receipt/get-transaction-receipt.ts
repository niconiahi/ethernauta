import { Hash32, NotFound, ReceiptInfo, notFoundSchema, receiptInfoSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse, union } from 'valibot'

/**
 * Returns the information about a transaction requested by transaction hash
 * @param transactionHash The hash of the transaction that's being requested
 * @returns The transaction receipt or null if not found
 */
export async function getTransactionReceipt(writer: Writer, parameters: [Hash32]): Promise<ReceiptInfo | NotFound> {
  const method = 'eth_getTransactionReceipt'
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([receiptInfoSchema, notFoundSchema]), response.result)

  return result
}
