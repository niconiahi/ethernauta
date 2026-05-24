// https://eips.ethereum.org/EIPS/eip-4844
//
// Batch verify N blob/commitment/proof triples in a single 2-pairing
// check. Uses Schwartz-Zippel with a Fiat-Shamir-derived challenge `r`:
//
//   r_powers = [1, r, r^2, ..., r^(n-1)]
//   proof_lincomb        = Σ r^i · proof_i
//   proof_z_lincomb      = Σ (r^i · z_i) · proof_i
//   c_minus_y[i]         = C_i − [y_i]·G1
//   rhs                  = Σ r^i · c_minus_y[i] + proof_z_lincomb
//   accept iff  e(proof_lincomb, −s·G2)  ·  e(rhs, G2)  ==  1
import { hex_to_bytes } from "@ethernauta/utils"
import { bls12_381 } from "@noble/curves/bls12-381"
import { parse } from "valibot"

import {
  BYTES_PER_FIELD_ELEMENT,
  FIELD_ELEMENTS_PER_BLOB,
  RANDOM_CHALLENGE_KZG_BATCH_DOMAIN,
} from "../constants"
import {
  type Blob,
  blobSchema,
  type KzgCommitment,
  type KzgProof,
  kzgCommitmentSchema,
  kzgProofSchema,
} from "../schemas"
import {
  compute_challenge,
  hash_to_bls_field,
} from "./challenge"
import { g1_lincomb } from "./commit"
import {
  Fr,
  fr_from_bytes_be,
  fr_to_bytes_be,
} from "./field"
import { evaluate_polynomial_in_evaluation_form } from "./polynomial"
import {
  type Kzg,
  parse_commitment_or_proof,
} from "./setup"

const G1_BASE = bls12_381.G1.Point.BASE
const G2_BASE = bls12_381.G2.Point.BASE
const G1_ZERO = bls12_381.G1.Point.ZERO
const G2_ZERO = bls12_381.G2.Point.ZERO
const Fp12 = bls12_381.fields.Fp12

const DOMAIN_BYTES = new TextEncoder().encode(
  RANDOM_CHALLENGE_KZG_BATCH_DOMAIN,
)

export function verify_blob_kzg_proof_batch(
  _kzg: Kzg,
  _blobs: readonly Blob[],
  _commitments: readonly KzgCommitment[],
  _proofs: readonly KzgProof[],
): boolean {
  if (
    _blobs.length !== _commitments.length ||
    _blobs.length !== _proofs.length
  ) {
    throw new Error(
      "verify_blob_kzg_proof_batch: blobs/commitments/proofs length mismatch",
    )
  }
  const n = _blobs.length
  if (n === 0) return true

  // Bundle inputs + derived (z, y, point forms) per case, so the
  // parallel arrays collapse into one typed iteration. Parse via
  // narrow schemas at the boundary — under noUncheckedIndexedAccess
  // `_commitments[i]` is `T | undefined`; passing it through `parse`
  // turns "missing slot" into a runtime throw (which the length check
  // above already proved cannot happen).
  const cases = _blobs.map((b, i) => {
    const blob = parse(blobSchema, b)
    const commitment = parse(kzgCommitmentSchema, _commitments[i])
    const proof = parse(kzgProofSchema, _proofs[i])
    const blob_bytes = hex_to_bytes(blob)
    const polynomial = new Array<bigint>(
      FIELD_ELEMENTS_PER_BLOB,
    )
    for (let j = 0; j < FIELD_ELEMENTS_PER_BLOB; j += 1) {
      polynomial[j] = fr_from_bytes_be(
        blob_bytes.subarray(
          j * BYTES_PER_FIELD_ELEMENT,
          (j + 1) * BYTES_PER_FIELD_ELEMENT,
        ),
      )
    }
    const z = compute_challenge(blob, commitment)
    const y = evaluate_polynomial_in_evaluation_form(
      polynomial,
      z,
    )
    return {
      commitment,
      commitment_point: parse_commitment_or_proof(commitment),
      proof,
      proof_point: parse_commitment_or_proof(proof),
      z,
      y,
    }
  })

  // Pair each case with its r^i power in one pass, so r and the case
  // share a single tuple element (no parallel-array indexing).
  const paired = compute_r_powers_paired(cases)
  const r_powers = paired.map(({ r }) => r)
  const proof_points = paired.map(({ c }) => c.proof_point)

  // proof_lincomb = Σ r^i · proof_i
  const proof_lincomb = g1_lincomb(proof_points, r_powers)
  // proof_z_lincomb = Σ (r^i · z_i) · proof_i
  const rz = paired.map(({ c, r }) => Fr.mul(r, c.z))
  const proof_z_lincomb = g1_lincomb(proof_points, rz)
  // c_minus_y[i] = C_i − [y_i]·G1
  const c_minus_y = paired.map(({ c }) =>
    c.y === 0n
      ? c.commitment_point
      : c.commitment_point.subtract(G1_BASE.multiply(c.y)),
  )
  const c_minus_y_lincomb = g1_lincomb(c_minus_y, r_powers)
  const rhs = c_minus_y_lincomb.add(proof_z_lincomb)

  // pairing equation: e(proof_lincomb, −s·G2) · e(rhs, G2) == 1
  const sG2 = _kzg.g2_monomial[1]
  if (!sG2) {
    throw new Error(
      "verify_blob_kzg_proof_batch: trusted setup is missing g2_monomial[1]",
    )
  }
  const neg_sG2 = sG2.negate()
  const lhs = pairing_or_one(proof_lincomb, neg_sG2)
  const rhs_p = pairing_or_one(rhs, G2_BASE)
  return Fp12.eql(Fp12.mul(lhs, rhs_p), Fp12.ONE)
}

function pairing_or_one(
  p: ReturnType<typeof bls12_381.G1.Point.fromBytes>,
  q: ReturnType<typeof bls12_381.G2.Point.fromBytes>,
) {
  if (p.equals(G1_ZERO) || q.equals(G2_ZERO))
    return Fp12.ONE
  return bls12_381.pairing(p, q)
}

function compute_r_powers_paired<
  C extends {
    commitment: KzgCommitment
    proof: KzgProof
    z: bigint
    y: bigint
  },
>(_cases: readonly C[]): Array<{ c: C; r: bigint }> {
  const n = _cases.length
  // Initial data: RANDOM_CHALLENGE_KZG_BATCH_DOMAIN || degree (8 BE) || n (8 BE)
  const initial = new Uint8Array(
    DOMAIN_BYTES.length + 8 + 8,
  )
  initial.set(DOMAIN_BYTES, 0)
  write_uint64_be(
    initial,
    DOMAIN_BYTES.length,
    BigInt(FIELD_ELEMENTS_PER_BLOB),
  )
  write_uint64_be(
    initial,
    DOMAIN_BYTES.length + 8,
    BigInt(n),
  )
  // Per case: commitment(48) || z(32) || y(32) || proof(48) = 160 bytes
  const per_case = 48 + 32 + 32 + 48
  const data = new Uint8Array(initial.length + n * per_case)
  data.set(initial, 0)
  let cursor = initial.length
  for (const c of _cases) {
    data.set(hex_to_bytes(c.commitment), cursor)
    cursor += 48
    data.set(fr_to_bytes_be(c.z), cursor)
    cursor += 32
    data.set(fr_to_bytes_be(c.y), cursor)
    cursor += 32
    data.set(hex_to_bytes(c.proof), cursor)
    cursor += 48
  }
  const r = hash_to_bls_field(data)
  // Build [r^0, r^1, ..., r^(n-1)] paired with each case in one pass.
  let cur = 1n
  return _cases.map((c) => {
    const pair = { c, r: cur }
    cur = Fr.mul(cur, r)
    return pair
  })
}

function write_uint64_be(
  _out: Uint8Array,
  _offset: number,
  _value: bigint,
): void {
  let v = _value
  for (let i = 7; i >= 0; i -= 1) {
    _out[_offset + i] = Number(v & 0xffn)
    v >>= 8n
  }
}
