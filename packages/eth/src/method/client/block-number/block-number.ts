import { parse } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { uintSchema } from "../../../base"
import type { Uint } from "../../../base"

export function blockNumber(): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_blockNumber"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
