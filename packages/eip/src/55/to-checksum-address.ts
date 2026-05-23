// https://eips.ethereum.org/EIPS/eip-55
import {
  type Address,
  addressSchema,
} from "@ethernauta/core"
import { keccak_256 } from "@noble/hashes/sha3"
import { parse } from "valibot"

export function to_checksum_address(
  _address: Address,
): Address {
  const address = parse(addressSchema, _address)
  const lower = address.slice(2).toLowerCase()
  const hash = keccak_256(new TextEncoder().encode(lower))
  let out = "0x"
  for (let i = 0; i < lower.length; i += 1) {
    const ch = lower[i] as string
    const nibble = hash[i >> 1] as number
    const nibble_value =
      (i & 1) === 0 ? nibble >> 4 : nibble & 0x0f
    out +=
      nibble_value >= 8 && ch >= "a" && ch <= "f"
        ? ch.toUpperCase()
        : ch
  }
  return parse(addressSchema, out)
}
