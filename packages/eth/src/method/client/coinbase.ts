import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function eth_coinbase(): Readable<Address> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Address> => {
    const method = "eth_coinbase"
    const call = parse(CallSchema, [method])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(AddressSchema, response.result)
    return result
  }
}
