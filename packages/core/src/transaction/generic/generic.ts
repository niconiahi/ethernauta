import { Address, Byte, Bytes, Uint, Hash32, byteSchema, uintSchema, addressSchema, bytesSchema, hash32Schema } from "../../base";
import { AccessList, accessListSchema } from "../../transaction";
import { Input, array, nullable, object } from "valibot";

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
type GenericTransaction = Input<typeof genericTransactionSchema>
