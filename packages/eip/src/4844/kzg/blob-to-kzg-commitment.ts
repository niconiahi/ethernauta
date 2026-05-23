// https://eips.ethereum.org/EIPS/eip-4844
//
// def blob_to_kzg_commitment(blob: Blob) -> KZGCommitment:
//     return KZGCommitment(g1_lincomb(bit_reversal_permutation(KZG_SETUP_G1_LAGRANGE),
//                                     blob_to_polynomial(blob)))
//
// The trusted setup we accept (c-kzg-4844's `trusted_setup.txt`) carries
// G1 in Lagrange basis with the bit-reversal permutation already applied.
// So the implementation collapses to a single MSM:
//   commitment = g1_lincomb(g1_lagrange_brp, blob_field_elements_brp)
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
  kzgCommitmentSchema,
} from "../schemas"
import { g1_lincomb } from "./commit"
import { fr_from_bytes_be } from "./field"
import type { Kzg } from "./setup"

export function blob_to_kzg_commitment(
  _kzg: Kzg,
  _blob: Blob,
): KzgCommitment {
  const blob = parse(blobSchema, _blob)
  const bytes = hex_to_bytes(blob)
  const evaluations = new Array<bigint>(
    FIELD_ELEMENTS_PER_BLOB,
  )
  for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i += 1) {
    evaluations[i] = fr_from_bytes_be(
      bytes.subarray(
        i * BYTES_PER_FIELD_ELEMENT,
        (i + 1) * BYTES_PER_FIELD_ELEMENT,
      ),
    )
  }
  const point = g1_lincomb(_kzg.g1_lagrange, evaluations)
  return parse(
    kzgCommitmentSchema,
    bytes_to_hex(point.toBytes()),
  )
}
