// https://eips.ethereum.org/EIPS/eip-4844
import { bytes48Schema, hash32Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, custom, object } from "valibot"

import { BYTES_PER_BLOB } from "./constants"

// 131072-byte hex string. Encoded big-endian as 4096 consecutive
// 32-byte field elements; each element MUST be < BLS_MODULUS for the
// blob to be valid input to the KZG functions.
const BLOB_HEX_LEN = 2 + BYTES_PER_BLOB * 2
function isBlob(input: unknown): boolean {
  return (
    typeof input === "string" &&
    input.length === BLOB_HEX_LEN &&
    /^0x[0-9a-f]+$/.test(input)
  )
}
export const blobSchema = custom<`0x${string}`>(isBlob)
export type Blob = InferOutput<typeof blobSchema>

// KZG commitment and proof are both compressed G1 points (48 bytes).
export const kzgCommitmentSchema = bytes48Schema
export type KzgCommitment = InferOutput<
  typeof kzgCommitmentSchema
>

export const kzgProofSchema = bytes48Schema
export type KzgProof = InferOutput<typeof kzgProofSchema>

// Network-form blob sidecar: blobs + their commitments + their proofs.
// Same shape that gets gossiped alongside a type-3 transaction in the
// mempool.
export const blobSidecarSchema = object({
  blobs: array(blobSchema),
  commitments: array(kzgCommitmentSchema),
  proofs: array(kzgProofSchema),
})
export type BlobSidecar = InferOutput<
  typeof blobSidecarSchema
>

// Versioned hash of a commitment: sha256(commitment)[1:] prefixed with
// the version byte 0x01. The transaction body carries these (NOT the raw
// commitments) under `blobVersionedHashes`.
export const blobVersionedHashSchema = hash32Schema
export type BlobVersionedHash = InferOutput<
  typeof blobVersionedHashSchema
>
