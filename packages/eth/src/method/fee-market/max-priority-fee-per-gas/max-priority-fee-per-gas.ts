import { parse } from "valibot"

import type { Uint } from "@ethernauta/eth"
import { uintSchema } from "@ethernauta/eth"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

/**
 * Returns the current maxPriorityFeePerGas per gas in wei
 * @returns The current maxPriorityFeePerGas per gas in wei
 */
export function maxPriorityFeePerGas(): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_maxPriorityFeePerGas"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
