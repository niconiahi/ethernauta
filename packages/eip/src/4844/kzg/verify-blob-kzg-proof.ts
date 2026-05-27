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

export async function verify_blob_kzg_proof(
  _blob: Blob,
  _commitment: KzgCommitment,
  _proof: KzgProof,
): Promise<boolean> {
  const blob = parse(blobSchema, _blob)
  const commitment = parse(kzgCommitmentSchema, _commitment)
  const proof = parse(kzgProofSchema, _proof)
  const kzg = await get_kzg()
  return kzg.verifyBlobProof(blob, commitment, proof)
}
