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
  type UserOperationReceipt,
  UserOperationReceiptSchema,
} from "../types"

export function eth_getUserOperationReceipt(
  _hash: Hash32,
): Readable<UserOperationReceipt | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<
    UserOperationReceipt | NotFound
  > => {
    const method = "eth_getUserOperationReceipt"
    const call = parse(CallSchema, [method, [_hash]])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      union([UserOperationReceiptSchema, NotFoundSchema]),
      response.result,
    )
  }
}
