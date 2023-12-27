import { array, nullable, object } from "valibot"

import { addressSchema, byteSchema, bytesSchema, hash32Schema, uintSchema } from "../../base"
import { accessListSchema } from "../../transaction"

/**
 * Generic transaction object applicable to all types.
 */
export const genericTransactionSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: nullable(addressSchema),
  from: addressSchema,
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  gasPrice: uintSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  maxFeePerBlobGas: uintSchema,
  accessList: accessListSchema,
  blobVersionedHashes: array(hash32Schema),
  blobs: array(bytesSchema),
  chainId: uintSchema,
})
