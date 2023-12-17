import type { Input } from "valibot"
import { array, object } from "valibot"

import { addressSchema, bytes32Schema, bytesSchema, hash32Schema, uint256Schema, uint64Schema } from "../base"

const storageProofSchema = object({
  key: bytes32Schema,
  value: uint256Schema,
  proof: array(bytesSchema),
})
export type StorageProof = Input<typeof storageProofSchema>

export const accountProofSchema = object({
  address: addressSchema,
  accountProof: array(bytesSchema),
  balance: uint256Schema,
  codeHash: hash32Schema,
  nonce: uint64Schema,
  storageHash: hash32Schema,
  storageProof: array(storageProofSchema),
})
export type AccountProof = Input<typeof accountProofSchema>
