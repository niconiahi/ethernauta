import { parse } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { addressesSchema } from "../../../core/base"
import type { Addresses } from "../../../core/base"

export function eth_acounts(): Readable<Addresses> {
  return async (transports: Http[]): Promise<Addresses> => {
    const method = "eth_accounts"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(addressesSchema, response.result)
    return result
  }
}
