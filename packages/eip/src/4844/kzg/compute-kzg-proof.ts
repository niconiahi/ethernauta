// https://eips.ethereum.org/EIPS/eip-4844
//
// def compute_kzg_proof(blob: Blob, z_bytes: Bytes32) -> Tuple[KZGProof, Bytes32]:
//     polynomial = blob_to_polynomial(blob)
//     z = bytes_to_bls_field(z_bytes)
//     y, proof = compute_kzg_proof_impl(polynomial, z)
//     return proof, bls_field_to_bytes(y)
//
// compute_kzg_proof_impl:
//   - y = p(z) via the barycentric formula
//   - q(x) = (p(x) - y) / (x - z), in evaluation form on the domain
//   - proof = commit(q) = g1_lincomb(g1_lagrange_brp, q_evals)
//
// Returns [proof_hex, y_hex]. `y_hex` is a 32-byte big-endian encoding
// of the field element y = p(z).
import {
  type Bytes32,
  bytes32Schema,
} from "@ethernauta/core"
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
  type KzgProof,
  kzgProofSchema,
} from "../schemas"
import { g1_lincomb } from "./commit"
import { fr_from_bytes_be, fr_to_bytes_be } from "./field"
import {
  compute_quotient_polynomial,
  evaluate_polynomial_in_evaluation_form,
} from "./polynomial"
import type { Kzg } from "./setup"

export function compute_kzg_proof(
  _kzg: Kzg,
  _blob: Blob,
  _z: Bytes32,
): [KzgProof, Bytes32] {
  const blob = parse(blobSchema, _blob)
  const z_bytes = parse(bytes32Schema, _z)
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
  const z = fr_from_bytes_be(hex_to_bytes(z_bytes))
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
  const proof = parse(
    kzgProofSchema,
    bytes_to_hex(proof_point.toBytes()),
  )
  const y_bytes = parse(
    bytes32Schema,
    bytes_to_hex(fr_to_bytes_be(y)),
  )
  return [proof, y_bytes]
}
