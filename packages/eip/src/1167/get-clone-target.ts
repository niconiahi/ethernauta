// https://eips.ethereum.org/EIPS/eip-1167

import {
  type Address,
  AddressSchema,
  BytesSchema,
  type NotFound,
} from "@ethernauta/core"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"

import { RUNTIME_TARGET_OFFSET_HEX } from "./bytecode"
import { matches_runtime } from "./is-clone"

export function get_clone_target(
  _address: Address,
): Readable<Address | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Address | NotFound> => {
    const address = parse(AddressSchema, _address)
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
    const code = parse(BytesSchema, response.result)
    if (!matches_runtime(code)) return null
    const target_hex = code.slice(
      RUNTIME_TARGET_OFFSET_HEX,
      RUNTIME_TARGET_OFFSET_HEX + 40,
    )
    return parse(AddressSchema, `0x${target_hex}`)
  }
}
