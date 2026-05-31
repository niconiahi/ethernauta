// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getl1gasprice
// L1 gas price the chain's fee model is currently using, as a U64
// of wei per gas.

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

export function zks_getL1GasPrice(): Readable<Uint64> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint64> => {
    const method = "zks_getL1GasPrice"
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
