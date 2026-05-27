// https://eips.ethereum.org/EIPS/eip-4844
import {
  type Bytes32,
  bytes32Schema,
} from "@ethernauta/core"
import { parse } from "valibot"

import {
  type Blob,
  blobSchema,
  type KzgProof,
  kzgProofSchema,
} from "../schemas"
import { get_kzg } from "./setup"

export async function compute_kzg_proof(
  _blob: Blob,
  _z: Bytes32,
): Promise<[KzgProof, Bytes32]> {
  const blob = parse(blobSchema, _blob)
  const z = parse(bytes32Schema, _z)
  const kzg = await get_kzg()
  const [proof_hex, y_hex] = kzg.computeProof(blob, z)
  return [
    parse(kzgProofSchema, proof_hex),
    parse(bytes32Schema, y_hex),
  ]
}
