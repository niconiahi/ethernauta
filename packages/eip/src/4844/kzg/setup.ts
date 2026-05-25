// https://eips.ethereum.org/EIPS/eip-4844
//
// Trusted setup loader — accepts the standard c-kzg-4844 JSON format:
//
//   {
//     "g1_monomial": ["0x<48-byte hex>", ... 4096 entries],
//     "g2_monomial": ["0x<96-byte hex>", ... 65 entries (we use the first 2)]
//   }
//
// The user brings their own setup (e.g. the canonical mainnet one from
// `ethereum/c-kzg-4844`). This keeps @ethernauta lean — same pattern
// viem uses for `setupKzg`.
import { bytesSchema } from "@ethernauta/core"
import { hex_to_bytes } from "@ethernauta/utils"
import { bls12_381 } from "@noble/curves/bls12-381"
import {
  array,
  custom,
  type InferOutput,
  object,
  parse,
} from "valibot"

import {
  BYTES_PER_COMMITMENT,
  FIELD_ELEMENTS_PER_BLOB,
} from "../constants"
import { bit_reversal_permutation } from "./roots-of-unity"

// Trusted setup as accepted by `init_kzg`. The fields match what the
// c-kzg-4844 `trusted_setup.txt` file actually carries:
//   - g1_lagrange: 4096 G1 points in *Lagrange basis* with the
//     consensus-specs bit-reversal permutation already applied.
//     This is what `blob_to_kzg_commitment` MSMs against.
//   - g2_monomial: G2 points in monomial basis. We only need
//     g2_monomial[0] (= G2.BASE) and g2_monomial[1] (= s · G2.BASE)
//     for verification.
export const trustedSetupSchema = object({
  g1_lagrange: array(bytesSchema),
  g2_monomial: array(bytesSchema),
})
export type TrustedSetup = InferOutput<
  typeof trustedSetupSchema
>

type G1Point = ReturnType<
  typeof bls12_381.G1.Point.fromBytes
>
type G2Point = ReturnType<
  typeof bls12_381.G2.Point.fromBytes
>

// Carrier of pre-parsed curve points. The schema's `custom`
// guards use object-typeof checks because G1Point / G2Point
// come from @noble/curves and have no public discriminator.
export const kzgSchema = object({
  g1_lagrange: array(
    custom<G1Point>(
      (value) => value != null && typeof value === "object",
    ),
  ),
  g2_monomial: array(
    custom<G2Point>(
      (value) => value != null && typeof value === "object",
    ),
  ),
})
export type Kzg = InferOutput<typeof kzgSchema>

export function init_kzg(_setup: TrustedSetup): Kzg {
  const setup = parse(trustedSetupSchema, _setup)
  if (
    setup.g1_lagrange.length !== FIELD_ELEMENTS_PER_BLOB
  ) {
    throw new Error(
      `init_kzg: expected ${FIELD_ELEMENTS_PER_BLOB} G1 Lagrange points, got ${setup.g1_lagrange.length}`,
    )
  }
  if (setup.g2_monomial.length < 2) {
    throw new Error(
      "init_kzg: trusted setup must include at least 2 G2 monomial points",
    )
  }
  // The c-kzg-4844 trusted_setup.txt has G1 in *natural*-order Lagrange
  // basis; the spec calls the BRP-permuted form via
  // `bit_reversal_permutation(KZG_SETUP_G1_LAGRANGE)`. We do that here
  // once at init so every commit/prove can MSM directly.
  const g1_lagrange_natural = setup.g1_lagrange.map((hex) =>
    parse_g1(hex),
  )
  const g1_lagrange = bit_reversal_permutation(
    g1_lagrange_natural,
  )
  const g2_monomial = setup.g2_monomial.map((hex) =>
    parse_g2(hex),
  )
  return { g1_lagrange, g2_monomial }
}

function parse_g1(_hex: `0x${string}`): G1Point {
  const bytes = hex_to_bytes(_hex)
  if (bytes.length !== BYTES_PER_COMMITMENT) {
    throw new Error(
      `parse_g1: expected ${BYTES_PER_COMMITMENT} bytes, got ${bytes.length}`,
    )
  }
  return bls12_381.G1.Point.fromBytes(bytes)
}

function parse_g2(_hex: `0x${string}`): G2Point {
  const bytes = hex_to_bytes(_hex)
  if (bytes.length !== 96) {
    throw new Error(
      `parse_g2: expected 96 bytes, got ${bytes.length}`,
    )
  }
  return bls12_381.G2.Point.fromBytes(bytes)
}

// Tiny helper used by the commit / verify code to parse a 48-byte
// commitment or proof off the wire.
export function parse_commitment_or_proof(
  _hex: `0x${string}`,
): G1Point {
  return parse_g1(_hex)
}

// Inverse: turn a G1 point back into a 48-byte compressed hex string.
export function g1_to_bytes(_point: G1Point): Uint8Array {
  return _point.toBytes()
}
