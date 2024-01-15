import { parse } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { Uint256 } from "../../../../core/base"
import { uint256Schema } from "../../../../core/base"

export function totalSupply(): Readable<Uint256> {
  return async (transports: Http[]): Promise<Uint256> => {
    const method = "totalSupply"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uint256Schema, response.result)
    return result
  }
}
