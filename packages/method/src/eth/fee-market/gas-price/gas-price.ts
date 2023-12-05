import type { Uint } from "@ethernauta/core"
import { uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"

/**
 * Returns the current price per gas in wei
 * @returns The gas in wei
 */
export function gasPrice(): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_gasPrice"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
