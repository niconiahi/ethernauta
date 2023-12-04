import { NotFound, ReceiptInfo, blockNumberOrTag, notFoundSchema, receiptInfoSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { Input, array, parse, tuple, union } from 'valibot'

const parametersSchema = tuple([blockNumberOrTag])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the number of transactions in a block matching the given block number
 * @param blockNumberOrTag The block number or tag where to search
 * @returns The transaction count or null if not found
 */
export async function getBlockReceipts(writer: Writer, _parameters: Parameters): Promise<ReceiptInfo[] | NotFound> {
  const method = 'eth_getBlockReceipts'
  const parameters = parse(parametersSchema, _parameters)
  const call = parse(callSchema, [method, parameters])
  const response = await writer(call)
  if ('error' in response) {
    throw new Error(response.error.message)
  }
  const result = parse(union([array(receiptInfoSchema), notFoundSchema]), response.result)

  return result
}
