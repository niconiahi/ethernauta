// https://eips.ethereum.org/EIPS/eip-4844
//
// def verify_kzg_proof_impl(commitment, z, y, proof) -> bool:
//     X_minus_z = bls.add(KZG_SETUP_G2_MONOMIAL[1], bls.multiply(bls.neg(G2.BASE), z))
//     P_minus_y = bls.add(commitment, bls.multiply(bls.neg(G1.BASE), y))
//     return bls.pairing_check([[P_minus_y, G2.BASE], [bls.neg(proof), X_minus_z]])
//
// Equivalent: e(C - [y]·G1, G2) == e(proof, s·G2 - [z]·G2). Both sides
// are Fp12; we compute them via `bls12_381.pairing(...)` and compare.
import { type Bytes32, bytes32Schema } from "@ethernauta/core"
import { hex_to_bytes } from "@ethernauta/utils"
import { bls12_381 } from "@noble/curves/bls12-381"
import { parse } from "valibot"

import {
  type KzgCommitment,
  kzgCommitmentSchema,
  type KzgProof,
  kzgProofSchema,
} from "../schemas"
import { fr_from_bytes_be } from "./field"
import {
  type Kzg,
  parse_commitment_or_proof,
} from "./setup"

const G1_BASE = bls12_381.G1.Point.BASE
const G2_BASE = bls12_381.G2.Point.BASE
const G1_ZERO = bls12_381.G1.Point.ZERO
const G2_ZERO = bls12_381.G2.Point.ZERO
const Fp12 = bls12_381.fields.Fp12

// @noble throws when either side of a pairing is the point at infinity.
// Mathematically e(0_G1, _) = e(_, 0_G2) = 1 in Fp12, so we short-circuit.
function pairing_or_one(
  p: ReturnType<typeof bls12_381.G1.Point.fromBytes>,
  q: ReturnType<typeof bls12_381.G2.Point.fromBytes>,
) {
  if (p.equals(G1_ZERO) || q.equals(G2_ZERO)) return Fp12.ONE
  return bls12_381.pairing(p, q)
}

export function verify_kzg_proof(
  _kzg: Kzg,
  _commitment: KzgCommitment,
  _z: Bytes32,
  _y: Bytes32,
  _proof: KzgProof,
): boolean {
  const commitment = parse(kzgCommitmentSchema, _commitment)
  const z_bytes = parse(bytes32Schema, _z)
  const y_bytes = parse(bytes32Schema, _y)
  const proof_hex = parse(kzgProofSchema, _proof)
  const c_point = parse_commitment_or_proof(commitment)
  const proof_point = parse_commitment_or_proof(proof_hex)
  const z = fr_from_bytes_be(hex_to_bytes(z_bytes))
  const y = fr_from_bytes_be(hex_to_bytes(y_bytes))
  const sG2 = _kzg.g2_monomial[1]
  if (!sG2) {
    throw new Error(
      "verify_kzg_proof: trusted setup is missing g2_monomial[1]",
    )
  }
  // P - [y]·G1
  const p_minus_y =
    y === 0n
      ? c_point
      : c_point.subtract(G1_BASE.multiply(y))
  // s·G2 - [z]·G2
  const x_minus_z =
    z === 0n ? sG2 : sG2.subtract(G2_BASE.multiply(z))
  const lhs = pairing_or_one(p_minus_y, G2_BASE)
  const rhs = pairing_or_one(proof_point, x_minus_z)
  return Fp12.eql(lhs, rhs)
}
