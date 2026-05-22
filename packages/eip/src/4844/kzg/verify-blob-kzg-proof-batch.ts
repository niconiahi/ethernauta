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
  kzgCommitmentSchema,
  type KzgProof,
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

  // Parse + validate inputs and derive (z_i, y_i) per case.
  const blobs = _blobs.map((b) => parse(blobSchema, b))
  const commitments = _commitments.map((c) =>
    parse(kzgCommitmentSchema, c),
  )
  const proofs = _proofs.map((p) => parse(kzgProofSchema, p))
  const commitment_points = commitments.map((c) =>
    parse_commitment_or_proof(c),
  )
  const proof_points = proofs.map((p) =>
    parse_commitment_or_proof(p),
  )
  const zs: bigint[] = []
  const ys: bigint[] = []
  for (let i = 0; i < n; i += 1) {
    const blob = blobs[i] as Blob
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
    const z = compute_challenge(
      blob,
      commitments[i] as KzgCommitment,
    )
    const y = evaluate_polynomial_in_evaluation_form(
      polynomial,
      z,
    )
    zs.push(z)
    ys.push(y)
  }

  const r_powers = compute_r_powers(
    commitments,
    zs,
    ys,
    proofs,
  )

  // proof_lincomb = Σ r^i · proof_i
  const proof_lincomb = g1_lincomb(proof_points, r_powers)
  // proof_z_lincomb = Σ (r^i · z_i) · proof_i
  const rz: bigint[] = []
  for (let i = 0; i < n; i += 1) {
    rz.push(
      Fr.mul(r_powers[i] as bigint, zs[i] as bigint),
    )
  }
  const proof_z_lincomb = g1_lincomb(proof_points, rz)
  // c_minus_y[i] = C_i − [y_i]·G1
  const c_minus_y = commitment_points.map((c, i) => {
    const y = ys[i] as bigint
    return y === 0n
      ? c
      : c.subtract(G1_BASE.multiply(y))
  })
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
  if (p.equals(G1_ZERO) || q.equals(G2_ZERO)) return Fp12.ONE
  return bls12_381.pairing(p, q)
}

function compute_r_powers(
  _commitments: readonly KzgCommitment[],
  _zs: readonly bigint[],
  _ys: readonly bigint[],
  _proofs: readonly KzgProof[],
): bigint[] {
  const n = _commitments.length
  // Initial data: RANDOM_CHALLENGE_KZG_BATCH_DOMAIN || degree (8 BE) || n (8 BE)
  const initial = new Uint8Array(DOMAIN_BYTES.length + 8 + 8)
  initial.set(DOMAIN_BYTES, 0)
  write_uint64_be(initial, DOMAIN_BYTES.length, BigInt(FIELD_ELEMENTS_PER_BLOB))
  write_uint64_be(initial, DOMAIN_BYTES.length + 8, BigInt(n))
  // Per case: commitment(48) || z(32) || y(32) || proof(48) = 160 bytes
  const per_case = 48 + 32 + 32 + 48
  const data = new Uint8Array(initial.length + n * per_case)
  data.set(initial, 0)
  let cursor = initial.length
  for (let i = 0; i < n; i += 1) {
    data.set(
      hex_to_bytes(_commitments[i] as KzgCommitment),
      cursor,
    )
    cursor += 48
    data.set(fr_to_bytes_be(_zs[i] as bigint), cursor)
    cursor += 32
    data.set(fr_to_bytes_be(_ys[i] as bigint), cursor)
    cursor += 32
    data.set(
      hex_to_bytes(_proofs[i] as KzgProof),
      cursor,
    )
    cursor += 48
  }
  const r = hash_to_bls_field(data)
  // [r^0, r^1, ..., r^(n-1)]
  const powers = new Array<bigint>(n)
  let cur = 1n
  for (let i = 0; i < n; i += 1) {
    powers[i] = cur
    cur = Fr.mul(cur, r)
  }
  return powers
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

