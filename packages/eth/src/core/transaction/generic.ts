import { array, nullable, object, optional } from "valibot"

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  Hash32Schema,
  uintSchema,
} from "../base"
import { accessListSchema } from "../transaction"

/**
 * Generic transaction object applicable to all types.
 * Per execution-apis, every field is optional — callers
 * provide only what they want to pin, the endpoint
 * (wallet / managed-key node) fills the rest.
 */
export const genericTransactionSchema = object({
  type: optional(byteSchema),
  nonce: optional(uintSchema),
  to: optional(nullable(addressSchema)),
  from: optional(addressSchema),
  gas: optional(uintSchema),
  value: optional(uintSchema),
  input: optional(bytesSchema),
  gasPrice: optional(uintSchema),
  maxPriorityFeePerGas: optional(uintSchema),
  maxFeePerGas: optional(uintSchema),
  maxFeePerBlobGas: optional(uintSchema),
  accessList: optional(accessListSchema),
  blobVersionedHashes: optional(array(Hash32Schema)),
  blobs: optional(array(bytesSchema)),
  chainId: optional(uintSchema),
})
