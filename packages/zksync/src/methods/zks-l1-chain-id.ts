// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-l1chainid
// Settlement L1 chain ID (e.g. `0x1` for Ethereum mainnet, `0xaa36a7`
// for Sepolia). The wire name keeps `L1ChainId` PascalCase per the
// upstream trait annotation.

import type { Uint64 } from "@ethernauta/core"
import { Uint64Schema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  CallSchema,
  RpcNumberSchema,
} from "@ethernauta/transport"
import { parse } from "valibot"

export function zks_L1ChainId(): Readable<Uint64> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint64> => {
    const method = "zks_L1ChainId"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      Uint64Schema,
      parse(RpcNumberSchema, response.result),
    )
  }
}
