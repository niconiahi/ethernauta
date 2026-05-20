import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"
import type { Address } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"

export function eth_coinbase(): Readable<Address> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Address> => {
    const method = "eth_coinbase"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(addressSchema, response.result)
    return result
  }
}
