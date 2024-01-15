import { parse } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { uintSchema } from "../../../core/base"
import type { Uint } from "../../../core/base"

/**
 * @returns The created block filter's identifier
 */
export function eth_newBlockFilter(): Readable<Uint> {
  return async (transports: Http[]): Promise<Uint> => {
    const method = "eth_newFilter"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
