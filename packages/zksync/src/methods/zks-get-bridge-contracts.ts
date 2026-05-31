// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getbridgecontracts
// Default L1/L2 bridge contracts the node knows about. All seven
// addresses are individually optional.

import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

import type { BridgeAddresses } from "../core"
import { BridgeAddressesSchema } from "../core"

export function zks_getBridgeContracts(): Readable<BridgeAddresses> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<BridgeAddresses> => {
    const method = "zks_getBridgeContracts"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(BridgeAddressesSchema, response.result)
  }
}
