import { Hash32, NotFound, TransactionInfo, Uint, notFoundSchema, transactionInfoSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse, union } from 'valibot'

/**
 * Signs and submits a transaction to the Ethereum network.
 * @param transaction The transaction object to be sent.
 * @returns The transaction hash as a promise.
 */
export async function getTransactionByHash(writer: Writer, parameters: [Hash32, Uint]): Promise<TransactionInfo | NotFound> {
  const method = 'eth_getTransactionByHash'
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([transactionInfoSchema, notFoundSchema]), response.result)

  return result
}
