import { parse } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { uintSchema } from "../../../core/base"
import type { Uint } from "../../../core/base"

/**
 * @returns The created block filter's identifier
 */
export function eth_newPendingTransactionFilter(): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_newPendingTransactionFilter"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
