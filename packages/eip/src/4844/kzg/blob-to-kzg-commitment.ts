// https://eips.ethereum.org/EIPS/eip-4844
import { parse } from "valibot"

import {
  type Blob,
  blobSchema,
  type KzgCommitment,
  kzgCommitmentSchema,
} from "../schemas"
import { get_kzg } from "./setup"

export async function blob_to_kzg_commitment(
  _blob: Blob,
): Promise<KzgCommitment> {
  const blob = parse(blobSchema, _blob)
  const kzg = await get_kzg()
  return parse(
    kzgCommitmentSchema,
    kzg.blobToKzgCommitment(blob),
  )
}
