import type { Input } from "valibot"
import { array, object } from "valibot"
import { type Uint, addressSchema, byteSchema, bytesSchema, hash32Schema, uintSchema } from "../../base"
import { accessListSchema } from "../../transaction"

/**
 * Unsigned EIP-4844 transaction.
 */
const transaction4844UnsignedSchema = object({
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
type Transaction4844Unsigned = Input<typeof transaction4844UnsignedSchema>

/**
 * Signed EIP-4844 transaction.
 */
export interface Transaction4844Signed extends Transaction4844Unsigned {
  yParity: Uint
  r: Uint
  s: Uint
}
