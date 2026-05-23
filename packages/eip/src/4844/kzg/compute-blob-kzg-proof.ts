// https://eips.ethereum.org/EIPS/eip-4844
//
// def compute_blob_kzg_proof(blob: Blob, commitment_bytes: Bytes48) -> KZGProof:
//     polynomial = blob_to_polynomial(blob)
//     evaluation_challenge = compute_challenge(blob, commitment_bytes)
//     proof, _y = compute_kzg_proof_impl(polynomial, evaluation_challenge)
//     return KZGProof(proof)
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"

import {
  BYTES_PER_FIELD_ELEMENT,
  FIELD_ELEMENTS_PER_BLOB,
} from "../constants"
import {
  type Blob,
  blobSchema,
  type KzgCommitment,
  type KzgProof,
  kzgCommitmentSchema,
  kzgProofSchema,
} from "../schemas"
import { compute_challenge } from "./challenge"
import { g1_lincomb } from "./commit"
import { fr_from_bytes_be } from "./field"
import {
  compute_quotient_polynomial,
  evaluate_polynomial_in_evaluation_form,
} from "./polynomial"
import {
  type Kzg,
  parse_commitment_or_proof,
} from "./setup"

export function compute_blob_kzg_proof(
  _kzg: Kzg,
  _blob: Blob,
  _commitment: KzgCommitment,
): KzgProof {
  const blob = parse(blobSchema, _blob)
  const commitment = parse(kzgCommitmentSchema, _commitment)
  // Force-parse the commitment so an invalid 48-byte payload throws
  // even though we do not use the point during proof construction.
  parse_commitment_or_proof(commitment)

  const blob_bytes = hex_to_bytes(blob)
  const polynomial = new Array<bigint>(
    FIELD_ELEMENTS_PER_BLOB,
  )
  for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i += 1) {
    polynomial[i] = fr_from_bytes_be(
      blob_bytes.subarray(
        i * BYTES_PER_FIELD_ELEMENT,
        (i + 1) * BYTES_PER_FIELD_ELEMENT,
      ),
    )
  }
  const z = compute_challenge(blob, commitment)
  const y = evaluate_polynomial_in_evaluation_form(
    polynomial,
    z,
  )
  const quotient = compute_quotient_polynomial(
    polynomial,
    z,
    y,
  )
  const proof_point = g1_lincomb(_kzg.g1_lagrange, quotient)
  return parse(
    kzgProofSchema,
    bytes_to_hex(proof_point.toBytes()),
  )
}
