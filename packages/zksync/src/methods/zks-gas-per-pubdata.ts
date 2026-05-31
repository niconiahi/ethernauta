// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-gasperpubdata
// Current `gas_per_pubdata_limit` for the chain — the conversion
// rate between L1 calldata bytes and L2 gas used by the fee model.

import type { Uint256 } from "@ethernauta/core"
import { Uint256Schema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function zks_gasPerPubdata(): Readable<Uint256> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint256> => {
    const method = "zks_gasPerPubdata"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(Uint256Schema, response.result)
  }
}
