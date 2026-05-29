// https://eips.ethereum.org/EIPS/eip-1167

import {
  type Address,
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"

import {
  RUNTIME_PREFIX,
  RUNTIME_SUFFIX,
} from "./bytecode"

export function is_clone(
  _address: Address,
): Readable<boolean> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<boolean> => {
    const address = parse(AddressSchema, _address)
    const code = await get_code(transports, address)
    return matches_runtime(code)
  }
}

export function matches_runtime(code: string): boolean {
  if (code.length !== 2 + 45 * 2) return false
  const lower = code.toLowerCase()
  if (!lower.startsWith(RUNTIME_PREFIX)) return false
  return lower.endsWith(RUNTIME_SUFFIX)
}

async function get_code(
  transports: ResolvedReader[0],
  address: Address,
): Promise<string> {
  const call = parse(CallSchema, [
    "eth_getCode",
    [address, "latest"],
  ])
  const response = await Promise.any(
    transports.map((transport) => transport(call)),
  )
  if ("error" in response) {
    throw new Error(response.error.message)
  }
  return parse(BytesSchema, response.result)
}
