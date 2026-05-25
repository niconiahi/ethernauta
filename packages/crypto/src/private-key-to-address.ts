// Yellow Paper, Appendix F: an Ethereum address is the
// rightmost 20 bytes of `keccak256` of the uncompressed
// public key (skipping the 0x04 leading tag byte).

import {
  type Address,
  addressSchema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { getPublicKey } from "@noble/secp256k1"
import { parse } from "valibot"

export function private_key_to_address(
  private_key: Uint8Array,
): Address {
  const public_key = getPublicKey(private_key, false)
  const hash = keccak_256(public_key.slice(1))
  return parse(addressSchema, bytes_to_hex(hash.slice(-20)))
}
