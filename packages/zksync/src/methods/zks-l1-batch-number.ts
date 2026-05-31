// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-l1batchnumber
// Latest sealed L1 batch number, as a U64. The wire name keeps
// `L1BatchNumber` PascalCase per the upstream trait annotation.

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

export function zks_L1BatchNumber(): Readable<Uint64> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint64> => {
    const method = "zks_L1BatchNumber"
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
