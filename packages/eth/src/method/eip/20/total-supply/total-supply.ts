import { parse } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { Uint256 } from "../../../../base"
import { uint256Schema } from "../../../../base"

export function totalSupply(): Readable<Uint256> {
  return async (reader: Reader): Promise<Uint256> => {
    const method = "totalSupply"
    const call = parse(callSchema, [method])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uint256Schema, response.result)
    return result
  }
}
