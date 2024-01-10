import { parse } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressSchema } from "../../../core/base"
import type { Address } from "../../../core/base"

export function eth_coinbase(): Readable<Address> {
  return async (reader: Reader): Promise<Address> => {
    const method = "eth_coinbase"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(addressSchema, response.result)
    return result
  }
}
