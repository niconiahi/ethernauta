// G1 multi-scalar-multiplication via @noble's Pippenger.
//
//   g1_lincomb(points, scalars) = Σ_i scalars[i] · points[i]
//
// Used by blob_to_kzg_commitment and the prove path. Pippenger groups
// scalars into bit-windows and accumulates per-bucket, giving ~10–20×
// speed-up over a naive 4096-iteration scalar-mul loop.

import { pippenger } from "@noble/curves/abstract/curve"
import {
  bls12_381,
  bls12_381_Fr,
} from "@noble/curves/bls12-381"

type G1Point = ReturnType<
  typeof bls12_381.G1.Point.fromBytes
>

export function g1_lincomb(
  _points: G1Point[],
  _scalars: bigint[],
): G1Point {
  if (_points.length !== _scalars.length) {
    throw new Error(
      `g1_lincomb: points/scalars length mismatch (${_points.length} vs ${_scalars.length})`,
    )
  }
  if (_points.length === 0) {
    return bls12_381.G1.Point.ZERO
  }
  return pippenger(
    bls12_381.G1.Point,
    bls12_381_Fr,
    _points,
    _scalars,
  )
}
