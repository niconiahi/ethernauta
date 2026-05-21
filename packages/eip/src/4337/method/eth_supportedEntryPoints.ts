// https://eips.ethereum.org/EIPS/eip-4337

import type { Address } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"
import {
  type Readable,
  type ResolvedReader,
  callSchema,
} from "@ethernauta/transport"
import { array, parse } from "valibot"

export function eth_supportedEntryPoints(): Readable<
  Address[]
> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Address[]> => {
    const method = "eth_supportedEntryPoints"
    const call = parse(callSchema, [method])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      array(addressSchema),
      response.result,
    )
  }
}
