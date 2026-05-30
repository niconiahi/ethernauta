// https://eips.ethereum.org/EIPS/eip-4337
// Bundler RPC: submit a UserOperation to the mempool.

import type { Address, Hash32 } from "@ethernauta/core"
import { Hash32Schema } from "@ethernauta/core"
import {
  CallSchema,
  type ResolvedWriter,
  type Writable,
} from "@ethernauta/transport"
import { parse } from "valibot"

import {
  type UserOperation,
  UserOperationSchema,
} from "../types"

export function eth_sendUserOperation({
  op,
  entryPoint,
}: {
  op: UserOperation
  entryPoint: Address
}): Writable<Hash32> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedWriter): Promise<Hash32> => {
    const method = "eth_sendUserOperation"
    const validated = parse(UserOperationSchema, op)
    const call = parse(CallSchema, [
      method,
      [validated, entryPoint],
    ])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(Hash32Schema, response.result)
  }
}
