import { parse, string } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

export function name(): Readable<string> {
  return async (transports: Http[]): Promise<string> => {
    const method = "name"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(string(), response.result)
    return result
  }
}
