// https://eips.ethereum.org/EIPS/eip-4844
import { parse } from "valibot"

import {
  type Blob,
  BlobSchema,
  type KzgCommitment,
  KzgCommitmentSchema,
} from "../schemas"
import { get_kzg } from "./setup"

export async function blob_to_kzg_commitment(
  _blob: Blob,
): Promise<KzgCommitment> {
  const blob = parse(BlobSchema, _blob)
  const kzg = await get_kzg()
  return parse(
    KzgCommitmentSchema,
    kzg.blobToKzgCommitment(blob),
  )
}
