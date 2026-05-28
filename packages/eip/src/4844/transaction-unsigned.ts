// https://eips.ethereum.org/EIPS/eip-4844

import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import { AccessListSchema } from "@ethernauta/eip/2930"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

export const Transaction4844UnsignedSchema = object({
  type: ByteSchema,
  nonce: UintSchema,
  to: AddressSchema,
  gas: UintSchema,
  value: UintSchema,
  input: BytesSchema,
  maxPriorityFeePerGas: UintSchema,
  maxFeePerGas: UintSchema,
  maxFeePerBlobGas: UintSchema,
  accessList: AccessListSchema,
  blobVersionedHashes: array(Hash32Schema),
  chainId: UintSchema,
})
export type Transaction4844Unsigned = InferOutput<
  typeof Transaction4844UnsignedSchema
>
