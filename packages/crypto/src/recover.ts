// https://eips.ethereum.org/EIPS/eip-2098 (compact 64-byte form)
//
// Pure ECDSA recovery. Lives here as a generic crypto primitive —
// no single EIP owns it. EIP-1271's `verify_hash` is strictly the
// on-chain `isValidSignature` call; the EOA fallback that used to
// rely on this helper now lives in `verify_message_deployed` /
// `verify_typed_data_deployed`, which compose recover with the
// `isValidSignature` call.

import {
  type Address,
  addressSchema,
  type Bytes64,
  bytes64Schema,
  type Bytes65,
  bytes65Schema,
  type Hash32,
  hash32Schema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { Signature } from "@noble/secp256k1"
import { parse, union } from "valibot"

export const recoverSignatureSchema = union([
  bytes64Schema,
  bytes65Schema,
])

function parse_signature(_signature: Bytes64 | Bytes65): {
  compact: Uint8Array
  recovery: number
} {
  const signature = parse(recoverSignatureSchema, _signature)
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
  const compact = new Uint8Array(64)
  compact.set(bytes)
  const top = compact[32] as number
  const recovery = (top & 0x80) >> 7
  compact[32] = top & 0x7f
  return { compact, recovery }
}

export function recover_address(
  _hash: Hash32,
  _signature: Bytes64 | Bytes65,
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
