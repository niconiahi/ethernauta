import type { Uint } from "@ethernauta/core"
import { uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function chainId(): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_chainId"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
