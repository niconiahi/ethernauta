// https://eips.ethereum.org/EIPS/eip-4844
import { parse } from "valibot"

import {
  type Blob,
  blobSchema,
  type KzgCommitment,
  type KzgProof,
  kzgCommitmentSchema,
  kzgProofSchema,
} from "../schemas"
import { get_kzg } from "./setup"

export async function verify_blob_kzg_proof_batch(
  _blobs: readonly Blob[],
  _commitments: readonly KzgCommitment[],
  _proofs: readonly KzgProof[],
): Promise<boolean> {
  if (
    _blobs.length !== _commitments.length ||
    _blobs.length !== _proofs.length
  ) {
    throw new Error(
      "verify_blob_kzg_proof_batch: blobs/commitments/proofs length mismatch",
    )
  }
  const blobs = _blobs.map((b) => parse(blobSchema, b))
  const commitments = _commitments.map((c) =>
    parse(kzgCommitmentSchema, c),
  )
  const proofs = _proofs.map((p) =>
    parse(kzgProofSchema, p),
  )
  const kzg = await get_kzg()
  return kzg.verifyBlobProofBatch(
    blobs,
    commitments,
    proofs,
  )
}
