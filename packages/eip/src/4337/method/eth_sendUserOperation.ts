// https://eips.ethereum.org/EIPS/eip-4337
// Bundler RPC: submit a UserOperation to the mempool.

import type { Address, Hash32 } from "@ethernauta/core"
import { hash32Schema } from "@ethernauta/core"
import {
  type ResolvedWriter,
  type Writable,
  callSchema,
} from "@ethernauta/transport"
import { parse } from "valibot"

import {
  type UserOperation,
  userOperationSchema,
} from "../types"

export function eth_sendUserOperation({
  op,
  entryPoint,
}: {
  op: UserOperation
  entryPoint: Address
}): Writable<Hash32> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<Hash32> => {
    const method = "eth_sendUserOperation"
    const validated = parse(userOperationSchema, op)
    const call = parse(callSchema, [
      method,
      [validated, entryPoint],
    ])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(hash32Schema, response.result)
  }
}
