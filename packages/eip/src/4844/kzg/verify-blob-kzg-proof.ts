// https://eips.ethereum.org/EIPS/eip-4844
//
// def verify_blob_kzg_proof(blob, commitment_bytes, proof_bytes) -> bool:
//     polynomial = blob_to_polynomial(blob)
//     evaluation_challenge = compute_challenge(blob, commitment_bytes)
//     y = evaluate_polynomial_in_evaluation_form(polynomial, evaluation_challenge)
//     return verify_kzg_proof_impl(commitment, evaluation_challenge, y, proof)
import { bytes32Schema } from "@ethernauta/core"
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
import { fr_from_bytes_be, fr_to_bytes_be } from "./field"
import { evaluate_polynomial_in_evaluation_form } from "./polynomial"
import type { Kzg } from "./setup"
import { verify_kzg_proof } from "./verify-kzg-proof"

export function verify_blob_kzg_proof(
  _kzg: Kzg,
  _blob: Blob,
  _commitment: KzgCommitment,
  _proof: KzgProof,
): boolean {
  const blob = parse(blobSchema, _blob)
  const commitment = parse(kzgCommitmentSchema, _commitment)
  const proof = parse(kzgProofSchema, _proof)
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
  const z_bytes = parse(
    bytes32Schema,
    bytes_to_hex(fr_to_bytes_be(z)),
  )
  const y_bytes = parse(
    bytes32Schema,
    bytes_to_hex(fr_to_bytes_be(y)),
  )
  return verify_kzg_proof(
    _kzg,
    commitment,
    z_bytes,
    y_bytes,
    proof,
  )
}
