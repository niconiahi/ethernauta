import { parse, string } from "valibot"

import type { Http, Readable } from "@cryptoman/transport"
import { callSchema } from "@cryptoman/transport"

export function symbol(): Readable<string> {
  return async (transports: Http[]): Promise<string> => {
    const method = "symbol"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(string(), response.result)
    return result
  }
}
