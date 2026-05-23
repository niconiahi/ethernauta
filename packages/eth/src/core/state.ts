import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  hash32Schema,
  uint64Schema,
  uint256Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

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
  codeHash: hash32Schema,
  nonce: uint64Schema,
  storageHash: hash32Schema,
  storageProof: array(storageProofSchema),
})
export type AccountProof = InferOutput<
  typeof accountProofSchema
>
