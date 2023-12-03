import { NotFound, TransactionInfo, hash32Schema, notFoundSchema, transactionInfoSchema, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, parse, tuple, union } from 'valibot'

const parametersSchema = tuple([hash32Schema, uintSchema])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns information about a transaction by block hash and transaction index position
 * @param blockHash The block hash in which to search
 * @param transactionIndex The index of the transaction within the block
 * @returns The transaction information or null if not found
 */
export async function getTransactionByHashAndIndex(writer: Writer, _parameters: Parameters): Promise<TransactionInfo | NotFound> {
  const method = 'eth_getTransactionByHashAndIndex'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  const result = parse(union([transactionInfoSchema, notFoundSchema]), response.result)

  return result
}