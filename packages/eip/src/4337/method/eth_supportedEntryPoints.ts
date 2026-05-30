// https://eips.ethereum.org/EIPS/eip-4337

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
} from "@ethernauta/transport"
import { array, parse } from "valibot"

export function eth_supportedEntryPoints(): Readable<
  Address[]
> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Address[]> => {
    const method = "eth_supportedEntryPoints"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(array(AddressSchema), response.result)
  }
}
