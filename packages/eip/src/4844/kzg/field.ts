// https://eips.ethereum.org/EIPS/eip-4844
//
// Thin layer over @noble's bls12_381_Fr — gives the rest of the KZG
// math snake_case helpers that match the consensus-specs pseudocode
// (`compute_quotient_eval_within_domain`, `barycentric_evaluate`, …).
//
// All field elements are bigints in [0, BLS_MODULUS). 32-byte
// serialisation is big-endian, per EIP-4844.
import { bls12_381_Fr } from "@noble/curves/bls12-381"

import { BLS_MODULUS, BYTES_PER_FIELD_ELEMENT } from "../constants"

export const Fr = bls12_381_Fr
export const FR_MODULUS = BLS_MODULUS

export function fr_from_bytes_be(_bytes: Uint8Array): bigint {
  if (_bytes.length !== BYTES_PER_FIELD_ELEMENT) {
    throw new Error(
      `fr_from_bytes_be: expected ${BYTES_PER_FIELD_ELEMENT} bytes, got ${_bytes.length}`,
    )
  }
  let value = 0n
  for (let i = 0; i < _bytes.length; i += 1) {
    value = (value << 8n) | BigInt(_bytes[i] as number)
  }
  if (value >= FR_MODULUS) {
    throw new Error(
      "fr_from_bytes_be: value >= BLS_MODULUS (invalid field element)",
    )
  }
  return value
}

export function fr_to_bytes_be(_value: bigint): Uint8Array {
  if (_value < 0n || _value >= FR_MODULUS) {
    throw new Error(
      "fr_to_bytes_be: value out of field range",
    )
  }
  const out = new Uint8Array(BYTES_PER_FIELD_ELEMENT)
  let v = _value
  for (let i = BYTES_PER_FIELD_ELEMENT - 1; i >= 0; i -= 1) {
    out[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return out
}
