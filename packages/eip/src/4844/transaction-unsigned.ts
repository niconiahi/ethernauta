// https://eips.ethereum.org/EIPS/eip-4844

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  hash32Schema,
  uintSchema,
} from "@ethernauta/core"
import { accessListSchema } from "@ethernauta/eip/2930"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

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
  blobVersionedHashes: array(hash32Schema),
  chainId: uintSchema,
})
export type Transaction4844Unsigned = InferOutput<
  typeof transaction4844UnsignedSchema
>
