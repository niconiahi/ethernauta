// https://eips.ethereum.org/EIPS/eip-4337

import type { Hash32, NotFound } from "@ethernauta/core"
import { notFoundSchema } from "@ethernauta/core"
import {
  type Readable,
  type ResolvedReader,
  callSchema,
} from "@ethernauta/transport"
import { parse, union } from "valibot"

import {
  type UserOperationByHash,
  userOperationByHashSchema,
} from "../types"

export function eth_getUserOperationByHash(
  _hash: Hash32,
): Readable<UserOperationByHash | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<
    UserOperationByHash | NotFound
  > => {
    const method = "eth_getUserOperationByHash"
    const call = parse(callSchema, [method, [_hash]])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      union([userOperationByHashSchema, notFoundSchema]),
      response.result,
    )
  }
}
