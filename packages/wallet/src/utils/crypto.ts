// Wallet-internal helpers that are NOT general crypto
// primitives. The actual primitives (BIP-39 mnemonic → seed,
// BIP-32 master key, BIP-44 derivation, public-key → address)
// live in `@ethernauta/crypto` and are imported by the
// wallet from there.

import type { HDKey } from "@ethernauta/crypto"
import { instance, parse } from "valibot"

export function get_private_key(key: HDKey): Uint8Array {
  return parse(instance(Uint8Array), key.privateKey)
}

export function big_to_hex(number: bigint): `0x${string}` {
  return `0x${number.toString(16)}` satisfies `0x${string}`
}
export function hex_to_big(hex: `0x${string}`): bigint {
  return BigInt(hex)
}
