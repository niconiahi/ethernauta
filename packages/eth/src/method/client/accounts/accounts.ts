import { parse } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressesSchema } from "../../../core/base"
import type { Addresses } from "../../../core/base"

export function eth_acounts(): Readable<Addresses> {
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
