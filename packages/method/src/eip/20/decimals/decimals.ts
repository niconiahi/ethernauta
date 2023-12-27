import { parse } from "valibot"

import { type Uint8, uint8Schema } from "@ethernauta/eth"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

export function decimals(): Readable<Uint8> {
  return async (reader: Reader): Promise<Uint8> => {
    const method = "decimals"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uint8Schema, response.result)
    return result
  }
}
