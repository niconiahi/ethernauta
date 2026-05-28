// https://eips.ethereum.org/EIPS/eip-4844
import { parse } from "valibot"

import {
  type Blob,
  BlobSchema,
  type KzgCommitment,
  KzgCommitmentSchema,
  type KzgProof,
  KzgProofSchema,
} from "../schemas"
import { get_kzg } from "./setup"

export async function compute_blob_kzg_proof(
  _blob: Blob,
  _commitment: KzgCommitment,
): Promise<KzgProof> {
  const blob = parse(BlobSchema, _blob)
  const commitment = parse(KzgCommitmentSchema, _commitment)
  const kzg = await get_kzg()
  return parse(
    KzgProofSchema,
    kzg.computeBlobProof(blob, commitment),
  )
}
