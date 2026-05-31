// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getmaincontract
// Address of the chain's L1 ZKsync main contract (the Diamond
// proxy hosting Executor / Mailbox / Getters / Admin facets).

import type { Address } from "@ethernauta/core"
import { AddressSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function zks_getMainContract(): Readable<Address> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Address> => {
    const method = "zks_getMainContract"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(AddressSchema, response.result)
  }
}
