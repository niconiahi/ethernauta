// https://eips.ethereum.org/EIPS/eip-1271 (EOA fallback)
// https://eips.ethereum.org/EIPS/eip-2098 (compact 64-byte form)
//
// `recover_address` does the pure ecrecover step shared by
// EIP-191, EIP-712, and the EOA branch of EIP-1271
// verification. It accepts either the canonical 65-byte
// signature (r || s || v) or the EIP-2098 compact 64-byte
// form (r || yParityAndS). The recovered address is
// emitted lowercase and 0x-prefixed.

import type { Address, Bytes, Hash32 } from "@ethernauta/core"
import { addressSchema, bytesSchema, hash32Schema } from "@ethernauta/core"
import { bytes_to_hex, hex_to_bytes } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { Signature } from "@noble/secp256k1"
import { parse } from "valibot"

function parse_signature(_signature: Bytes): {
  compact: Uint8Array
  recovery: number
} {
  const signature = parse(bytesSchema, _signature)
  const bytes = hex_to_bytes(signature)
  if (bytes.length === 65) {
    const v = bytes[64] as number
    let recovery: number
    if (v === 0 || v === 1) recovery = v
    else if (v === 27 || v === 28) recovery = v - 27
    else
      throw new Error(
        `invalid signature v byte: ${v} (expected 0, 1, 27, or 28)`,
      )
    return { compact: bytes.slice(0, 64), recovery }
  }
  if (bytes.length === 64) {
    const compact = new Uint8Array(64)
    compact.set(bytes)
    const top = compact[32] as number
    const recovery = (top & 0x80) >> 7
    compact[32] = top & 0x7f
    return { compact, recovery }
  }
  throw new Error(
    `invalid signature length: ${bytes.length} (expected 64 or 65)`,
  )
}

export function recover_address(
  _hash: Hash32,
  _signature: Bytes,
): Address {
  const hash = parse(hash32Schema, _hash)
  const { compact, recovery } = parse_signature(_signature)
  const sig =
    Signature.fromCompact(compact).addRecoveryBit(recovery)
  const point = sig.recoverPublicKey(hex_to_bytes(hash))
  const uncompressed = point.toBytes(false)
  const hashed = keccak_256(uncompressed.slice(1))
  const tail = hashed.slice(12)
  return parse(addressSchema, bytes_to_hex(tail))
}
