import type { InferOutput } from "valibot"
import { array, object } from "valibot"

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  Hash32Schema,
  uintSchema,
} from "../base"
import { accessListSchema } from "./access-list"

export const transaction4844UnsignedSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: addressSchema,
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  maxFeePerBlobGas: uintSchema,
  accessList: accessListSchema,
  blobVersionedHashes: array(Hash32Schema),
  chainId: uintSchema,
})
export type Transaction4844Unsigned = InferOutput<
  typeof transaction4844UnsignedSchema
>

export const transaction4844SignedSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: addressSchema,
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  maxFeePerBlobGas: uintSchema,
  accessList: accessListSchema,
  blobVersionedHashes: array(Hash32Schema),
  chainId: uintSchema,
  yParity: uintSchema,
  r: uintSchema,
  s: uintSchema,
})
export type Transaction4844Signed = InferOutput<
  typeof transaction4844SignedSchema
>
