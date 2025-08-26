import type { Uint256 } from "@ethernauta/eth"
import { uint256Schema } from "@ethernauta/eth"
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse, union } from "valibot"

export function totalSupply(): Readable<Uint256> {
  return async (transports: Http[]): Promise<Uint256> => {
    const method = "totalSupply"
    const call = parse(callSchema, [method, []])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([uint256Schema]),
      response.result,
    )
    return result
  }
}
