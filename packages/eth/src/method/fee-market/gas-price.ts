import type { Uint } from "@ethernauta/core"
import { uintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"

/**
 * Returns the current price per gas in wei
 * @returns The gas in wei
 */
export function eth_gasPrice(): Readable<Uint> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_gasPrice"
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
