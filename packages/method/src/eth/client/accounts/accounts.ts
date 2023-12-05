import type { Addresses } from "@ethernauta/core"
import { addressesSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"

/**
 * Returns a list of addresses owned by client
 * @returns The coinbase address
 */
export function acounts(): Readable<Addresses> {
  return async (reader: Reader): Promise<Addresses> => {
    const method = "eth_accounts"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(addressesSchema, response.result)
    return result
  }
}
