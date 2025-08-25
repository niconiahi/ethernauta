import type { InferOutput } from "valibot"
import { array, object } from "valibot"

import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  Hash32Schema,
  uint64Schema,
  uint256Schema,
} from "./base"

const storageProofSchema = object({
  key: bytes32Schema,
  value: uint256Schema,
  proof: array(bytesSchema),
})
export type StorageProof = InferOutput<
  typeof storageProofSchema
>

export const accountProofSchema = object({
  address: addressSchema,
  accountProof: array(bytesSchema),
  balance: uint256Schema,
  codeHash: Hash32Schema,
  nonce: uint64Schema,
  storageHash: Hash32Schema,
  storageProof: array(storageProofSchema),
})
export type AccountProof = InferOutput<
  typeof accountProofSchema
>
