// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getbasetokenl1address
// L1 address of this chain's base token (the token used to pay
// gas on L2). `0x0…01` on ETH-denominated chains.

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function zks_getBaseTokenL1Address(): Readable<Address> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Address> => {
    const method = "zks_getBaseTokenL1Address"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(AddressSchema, response.result)
  }
}
