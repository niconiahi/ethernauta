import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

const StorageProofSchema = object({
  key: Bytes32Schema,
  value: Uint256Schema,
  proof: array(BytesSchema),
})
export type StorageProof = InferOutput<
  typeof StorageProofSchema
>

export const AccountProofSchema = object({
  address: AddressSchema,
  accountProof: array(BytesSchema),
  balance: Uint256Schema,
  codeHash: Hash32Schema,
  nonce: Uint64Schema,
  storageHash: Hash32Schema,
  storageProof: array(StorageProofSchema),
})
export type AccountProof = InferOutput<
  typeof AccountProofSchema
>
