import { parse, string } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

export function symbol(): Readable<string> {
  return async (reader: Reader): Promise<string> => {
    const method = "symbol"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(string(), response.result)
    return result
  }
}
