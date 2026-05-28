// https://eips.ethereum.org/EIPS/eip-4844 §"Cryptographic Helpers"
//
//   def kzg_to_versioned_hash(commitment: KZGCommitment) -> VersionedHash:
//     return VERSIONED_HASH_VERSION_KZG + sha256(commitment)[1:]
import { Hash32Schema } from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { sha256 } from "@noble/hashes/sha2"
import { parse } from "valibot"

import { VERSIONED_HASH_VERSION_KZG } from "./constants"
import {
  type BlobVersionedHash,
  type KzgCommitment,
  KzgCommitmentSchema,
} from "./schemas"

export function commitment_to_versioned_hash(
  _commitment: KzgCommitment,
): BlobVersionedHash {
  const commitment = parse(KzgCommitmentSchema, _commitment)
  const digest = sha256(hex_to_bytes(commitment))
  digest[0] = VERSIONED_HASH_VERSION_KZG
  return parse(Hash32Schema, bytes_to_hex(digest))
}
