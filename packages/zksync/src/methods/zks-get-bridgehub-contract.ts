// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getbridgehubcontract
// Address of the L1 Bridgehub diamond proxy for this chain.

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { nullable, parse } from "valibot"

export function zks_getBridgehubContract(): Readable<Address | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Address | null> => {
    const method = "zks_getBridgehubContract"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(nullable(AddressSchema), response.result)
  }
}
