// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-gettestnetpaymaster
// Address of the chain's testnet paymaster on this L2, or null on
// mainnet (no testnet paymaster).

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { nullable, parse } from "valibot"

export function zks_getTestnetPaymaster(): Readable<Address | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Address | null> => {
    const method = "zks_getTestnetPaymaster"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(nullable(AddressSchema), response.result)
  }
}
