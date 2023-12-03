import { Uint, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse } from 'valibot'

/**
 * Returns the number of most recent block
 * @returns The block number
 */
export async function blockNumber(writer: Writer): Promise<Uint> {
  const method = 'eth_blockNumber'
  const call = parse(callSchema, [method])
  const response = await writer(call)
  const result = parse(uintSchema, response.result)

  return result
}
