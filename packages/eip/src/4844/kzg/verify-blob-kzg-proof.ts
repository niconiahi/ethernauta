// https://eips.ethereum.org/EIPS/eip-4844
import { parse } from "valibot"

import {
  type Blob,
  BlobSchema,
  type KzgCommitment,
  type KzgProof,
  KzgCommitmentSchema,
  KzgProofSchema,
} from "../schemas"
import { get_kzg } from "./setup"

export async function verify_blob_kzg_proof(
  _blob: Blob,
  _commitment: KzgCommitment,
  _proof: KzgProof,
): Promise<boolean> {
  const blob = parse(BlobSchema, _blob)
  const commitment = parse(KzgCommitmentSchema, _commitment)
  const proof = parse(KzgProofSchema, _proof)
  const kzg = await get_kzg()
  return kzg.verifyBlobProof(blob, commitment, proof)
}
