// https://eips.ethereum.org/EIPS/eip-4337

import type { Hash32, NotFound } from "@ethernauta/core"
import { NotFoundSchema } from "@ethernauta/core"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse, union } from "valibot"

import {
  type UserOperationByHash,
  UserOperationByHashSchema,
} from "../types"

export function eth_getUserOperationByHash(
  _hash: Hash32,
): Readable<UserOperationByHash | NotFound> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<
    UserOperationByHash | NotFound
  > => {
    const method = "eth_getUserOperationByHash"
    const call = parse(CallSchema, [method, [_hash]])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      union([UserOperationByHashSchema, NotFoundSchema]),
      response.result,
    )
  }
}
