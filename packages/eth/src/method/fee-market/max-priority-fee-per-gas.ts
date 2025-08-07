import { parse } from "valibot"

import type { Http, Readable } from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

import { uintSchema } from "../../core/base"
import type { Uint } from "../../core/base"

/**
 * Returns the current maxPriorityFeePerGas per gas in wei
 * @returns The current maxPriorityFeePerGas per gas in wei
 */
export function eth_maxPriorityFeePerGas(): Readable<Uint> {
  return async (transports: Http[]): Promise<Uint> => {
    const method = "eth_maxPriorityFeePerGas"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
