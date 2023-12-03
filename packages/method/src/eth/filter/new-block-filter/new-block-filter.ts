import { Uint, uintSchema } from "@ethernauta/core";
import type { Writer } from "@ethernauta/transport";
import { callSchema } from "@ethernauta/transport";
import { parse } from 'valibot'

/**
 * Creates a filter in the node, to notify when a new block arrives
 * @returns The filter identifier
 */
export async function newBlockFilter(writer: Writer): Promise<Uint> {
  const method = 'eth_newFilter'
  const call = parse(callSchema, [method])
  const response = await writer(call)
  const result = parse(uintSchema, response.result)

  return result
}
