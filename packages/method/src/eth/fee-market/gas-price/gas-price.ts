import { Uint, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse } from 'valibot'

/**
 * Returns the current price per gas in wei
 * @returns The gas in wei
 */
export async function gasPrice(writer: Writer): Promise<Uint> {
  const method = 'eth_gasPrice'
  const call = parse(callSchema, [method])
  const response = await writer(call)
  const result = parse(uintSchema, response.result)

  return result
}