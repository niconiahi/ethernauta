import { parse } from "valibot"

import type { Addresses } from "@ethernauta/eth"
import { addressesSchema } from "@ethernauta/eth"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

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
