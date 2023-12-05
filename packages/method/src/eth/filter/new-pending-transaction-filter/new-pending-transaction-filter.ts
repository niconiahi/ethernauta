import type { Uint } from "@ethernauta/core"
import { uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"

/**
 * Creates a filter in the node, to notify when new pending transactions arrive
 * @returns The filter identifier
 */
export function newPendingTransactionFilter(): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_newFilter"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
