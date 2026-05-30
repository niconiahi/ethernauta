import type { Addresses } from "@ethernauta/core"
import { AddressesSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function eth_acounts(): Readable<Addresses> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Addresses> => {
    const method = "eth_accounts"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(AddressesSchema, response.result)
    return result
  }
}
