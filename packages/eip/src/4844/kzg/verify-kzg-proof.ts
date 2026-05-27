// https://eips.ethereum.org/EIPS/eip-4844
import {
  type Bytes32,
  bytes32Schema,
} from "@ethernauta/core"
import { parse } from "valibot"

import {
  type KzgCommitment,
  type KzgProof,
  kzgCommitmentSchema,
  kzgProofSchema,
} from "../schemas"
import { get_kzg } from "./setup"

export async function verify_kzg_proof(
  _commitment: KzgCommitment,
  _z: Bytes32,
  _y: Bytes32,
  _proof: KzgProof,
): Promise<boolean> {
  const commitment = parse(kzgCommitmentSchema, _commitment)
  const z = parse(bytes32Schema, _z)
  const y = parse(bytes32Schema, _y)
  const proof = parse(kzgProofSchema, _proof)
  const kzg = await get_kzg()
  return kzg.verifyProof(commitment, z, y, proof)
}
