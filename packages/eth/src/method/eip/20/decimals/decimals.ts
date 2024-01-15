import { parse } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { Uint8 } from "../../../../core/base"
import { uint8Schema } from "../../../../core/base"

export function decimals(): Readable<Uint8> {
  return async (transports: Http[]): Promise<Uint8> => {
    const method = "decimals"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uint8Schema, response.result)
    return result
  }
}
