// https://eips.ethereum.org/EIPS/eip-1967
//
// Internal helper. EIP-1967 stores the implementation, admin,
// and beacon addresses in fixed bytes32 slots — the address
// sits in the lower 20 bytes, the upper 12 bytes are zero. We
// read the slot via `eth_getStorageAt`, normalize the returned
// hex (which the node may minify by stripping leading zeros)
// to a 32-byte word, and pull the last 20 bytes out. A
// fully-zero slot is reported as `not_found` so callers can
// distinguish "this contract is not a 1967 proxy / has nothing
// at this slot" from a real (non-zero) address.

import {
  type Address,
  AddressSchema,
  type Bytes32,
  type NotFound,
} from "@ethernauta/core"
import {
  CallSchema,
  type Http,
} from "@ethernauta/transport"
import { parse } from "valibot"

export async function read_address_slot(
  transports: Http[],
  address: Address,
  slot: Bytes32,
): Promise<Address | NotFound> {
  const call = parse(CallSchema, [
    "eth_getStorageAt",
    [address, slot, "latest"],
  ])
  const response = await Promise.any(
    transports.map((transport) => transport(call)),
  )
  if ("error" in response) {
    throw new Error(response.error.message)
  }
  if (typeof response.result !== "string") {
    throw new Error(
      "eth_getStorageAt returned non-string result",
    )
  }
  const word = pad_to_word(response.result)
  if (word === `0x${"0".repeat(64)}`) return null
  return parse(AddressSchema, `0x${word.slice(26)}`)
}

function pad_to_word(hex: string): string {
  const body = hex.startsWith("0x") ? hex.slice(2) : hex
  if (body.length >= 64) return `0x${body.slice(-64)}`
  return `0x${body.padStart(64, "0")}`
}
