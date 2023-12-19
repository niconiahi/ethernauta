import { parse, string } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

export function name(): Readable<string> {
  return async (reader: Reader): Promise<string> => {
    const method = "name"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(string(), response.result)
    return result
  }
}
