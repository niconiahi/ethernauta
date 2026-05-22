// Fiat-Shamir challenge used by compute_blob_kzg_proof and
// verify_blob_kzg_proof. From the consensus-specs:
//
//   def compute_challenge(blob: Blob, commitment: KZGCommitment) -> BLSFieldElement:
//       degree_poly = int.to_bytes(FIELD_ELEMENTS_PER_BLOB, 16, "big")
//       data = FIAT_SHAMIR_PROTOCOL_DOMAIN + degree_poly + blob + commitment
//       return hash_to_bls_field(data)
//
//   def hash_to_bls_field(data) -> BLSFieldElement:
//       return int.from_bytes(sha256(data), "big") % BLS_MODULUS
import { hex_to_bytes } from "@ethernauta/utils"
import { sha256 } from "@noble/hashes/sha2"

import {
  BYTES_PER_BLOB,
  BYTES_PER_COMMITMENT,
  FIAT_SHAMIR_PROTOCOL_DOMAIN,
  FIELD_ELEMENTS_PER_BLOB,
  BLS_MODULUS,
} from "../constants"
import type { Blob, KzgCommitment } from "../schemas"

const DOMAIN_BYTES = new TextEncoder().encode(
  FIAT_SHAMIR_PROTOCOL_DOMAIN,
)

export function compute_challenge(
  _blob: Blob,
  _commitment: KzgCommitment,
): bigint {
  const blob_bytes = hex_to_bytes(_blob)
  const commitment_bytes = hex_to_bytes(_commitment)
  // 16-byte big-endian encoding of the polynomial degree.
  const degree_bytes = new Uint8Array(16)
  let degree = BigInt(FIELD_ELEMENTS_PER_BLOB)
  for (let i = 15; i >= 0; i -= 1) {
    degree_bytes[i] = Number(degree & 0xffn)
    degree >>= 8n
  }
  const data = new Uint8Array(
    DOMAIN_BYTES.length +
      16 +
      BYTES_PER_BLOB +
      BYTES_PER_COMMITMENT,
  )
  let cursor = 0
  data.set(DOMAIN_BYTES, cursor)
  cursor += DOMAIN_BYTES.length
  data.set(degree_bytes, cursor)
  cursor += 16
  data.set(blob_bytes, cursor)
  cursor += BYTES_PER_BLOB
  data.set(commitment_bytes, cursor)
  return hash_to_bls_field(data)
}

export function hash_to_bls_field(
  _data: Uint8Array,
): bigint {
  const digest = sha256(_data)
  let value = 0n
  for (let i = 0; i < digest.length; i += 1) {
    value = (value << 8n) | BigInt(digest[i] as number)
  }
  return value % BLS_MODULUS
}
