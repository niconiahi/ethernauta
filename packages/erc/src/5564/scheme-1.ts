// https://eips.ethereum.org/EIPS/eip-5564
//
// Scheme 1 — SECP256k1, key derivation via ECDH +
// keccak256, view tag = first byte of the hashed shared
// secret. The default and only mandatory scheme.

import {
  type Address,
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import {
  CURVE,
  getPublicKey,
  getSharedSecret,
  Point,
  utils,
} from "@noble/secp256k1"
import { type InferOutput, number, object, parse } from "valibot"

export const SCHEME_1_ID = 1 as const

function bytes_to_bigint(bytes: Uint8Array): bigint {
  let result = 0n
  for (const byte of bytes) {
    result = (result << 8n) | BigInt(byte)
  }
  return result
}

function bigint_to_32_bytes(value: bigint): Uint8Array {
  const out = new Uint8Array(32)
  let v = value
  for (let i = 31; i >= 0; i--) {
    out[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return out
}

function point_to_address(point: Point): Address {
  const uncompressed = point.toBytes(false)
  const hash = keccak_256(uncompressed.slice(1))
  return parse(addressSchema, bytes_to_hex(hash.slice(-20)))
}

export const stealthMetaAddressSchema = object({
  spending_public_key: bytesSchema,
  viewing_public_key: bytesSchema,
})
export type StealthMetaAddress = InferOutput<
  typeof stealthMetaAddressSchema
>

// Parse a concatenated stealth meta-address: 33 bytes
// spending pubkey + 33 bytes viewing pubkey, hex-encoded.
// (66 bytes = 132 hex chars; with the 0x prefix that's 134
// chars total.)
export function parse_stealth_meta_address(
  _hex: `0x${string}`,
): StealthMetaAddress {
  const stripped = _hex.toLowerCase().replace(/^0x/, "")
  if (stripped.length !== 132) {
    throw new Error(
      `stealth meta-address: expected 66 bytes, got ${stripped.length / 2}`,
    )
  }
  return {
    spending_public_key:
      `0x${stripped.slice(0, 66)}` as `0x${string}`,
    viewing_public_key:
      `0x${stripped.slice(66, 132)}` as `0x${string}`,
  }
}

export function format_stealth_meta_address(
  meta: StealthMetaAddress,
): `0x${string}` {
  return `0x${meta.spending_public_key.slice(2)}${meta.viewing_public_key.slice(2)}` as `0x${string}`
}

export function derive_meta_address(input: {
  spending_private_key: Uint8Array
  viewing_private_key: Uint8Array
}): StealthMetaAddress {
  return {
    spending_public_key: bytes_to_hex(
      getPublicKey(input.spending_private_key, true),
    ) as `0x${string}`,
    viewing_public_key: bytes_to_hex(
      getPublicKey(input.viewing_private_key, true),
    ) as `0x${string}`,
  }
}

export const generatedStealthAddressSchema = object({
  stealth_address: addressSchema,
  ephemeral_public_key: bytesSchema,
  view_tag: number(),
})
export type GeneratedStealthAddress = InferOutput<
  typeof generatedStealthAddressSchema
>

// Sender side: derive a one-shot recipient address from a
// stealth meta-address. Returns the address to send funds
// to, the ephemeral pubkey to announce, and the view tag
// the recipient uses to pre-filter announcements.
export function generate_stealth_address({
  meta,
  ephemeral_private_key,
}: {
  meta: StealthMetaAddress
  ephemeral_private_key?: Uint8Array
}): GeneratedStealthAddress {
  const eph =
    ephemeral_private_key ?? utils.randomPrivateKey()
  const ephemeral_public_key = getPublicKey(eph, true)
  const shared_secret = getSharedSecret(
    eph,
    hex_to_bytes(meta.viewing_public_key),
    true,
  )
  const s_h = keccak_256(shared_secret)
  const view_tag = s_h[0] ?? 0
  const s_h_scalar = bytes_to_bigint(s_h) % CURVE.n
  const spending_point = Point.fromBytes(
    hex_to_bytes(meta.spending_public_key),
  )
  const stealth_point = spending_point.add(
    Point.BASE.multiply(s_h_scalar),
  )
  return {
    stealth_address: point_to_address(stealth_point),
    ephemeral_public_key: bytes_to_hex(
      ephemeral_public_key,
    ) as `0x${string}`,
    view_tag,
  }
}

// Recipient side, cheap path: compute the view tag for
// (viewing_private_key, ephemeral_public_key) and compare
// against the announced view tag. Filters ~255/256 of
// irrelevant announcements before the costlier address
// derivation.
export function compute_view_tag({
  viewing_private_key,
  ephemeral_public_key,
}: {
  viewing_private_key: Uint8Array
  ephemeral_public_key: `0x${string}`
}): number {
  const shared = getSharedSecret(
    viewing_private_key,
    hex_to_bytes(ephemeral_public_key),
    true,
  )
  const s_h = keccak_256(shared)
  return s_h[0] ?? 0
}

// Recipient side: rebuild the stealth address from the
// announcement using the viewing private key + spending
// public key. The recipient only needs `s` (spending priv)
// to actually move funds — checking ownership uses only
// `v` (viewing priv) + `S` (spending pub).
export function check_stealth_address({
  viewing_private_key,
  spending_public_key,
  ephemeral_public_key,
}: {
  viewing_private_key: Uint8Array
  spending_public_key: `0x${string}`
  ephemeral_public_key: `0x${string}`
}): Address {
  const shared = getSharedSecret(
    viewing_private_key,
    hex_to_bytes(ephemeral_public_key),
    true,
  )
  const s_h = keccak_256(shared)
  const s_h_scalar = bytes_to_bigint(s_h) % CURVE.n
  const spending_point = Point.fromBytes(
    hex_to_bytes(spending_public_key),
  )
  const stealth_point = spending_point.add(
    Point.BASE.multiply(s_h_scalar),
  )
  return point_to_address(stealth_point)
}

// Recipient side: derive the stealth private key needed to
// spend funds at the stealth address. Combines the
// spending priv with the hashed shared secret.
export function compute_stealth_private_key({
  spending_private_key,
  viewing_private_key,
  ephemeral_public_key,
}: {
  spending_private_key: Uint8Array
  viewing_private_key: Uint8Array
  ephemeral_public_key: `0x${string}`
}): Uint8Array {
  const shared = getSharedSecret(
    viewing_private_key,
    hex_to_bytes(ephemeral_public_key),
    true,
  )
  const s_h = keccak_256(shared)
  const s_h_scalar = bytes_to_bigint(s_h) % CURVE.n
  const s_scalar = bytes_to_bigint(spending_private_key)
  const stealth_scalar = (s_scalar + s_h_scalar) % CURVE.n
  return bigint_to_32_bytes(stealth_scalar)
}
