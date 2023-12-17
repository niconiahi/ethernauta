import type { Input } from "valibot"
import { nullable, object, string } from "valibot"

import { addressSchema, bytesSchema, uintSchema } from "../../base"
import { accessListSchema } from "../../transaction"

export const transaction1559UnsignedSchema = object({
  type: string(),
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  gasPrice: uintSchema,
  accessList: accessListSchema,
  chainId: uintSchema,
})
export type Transaction1559Unsigned = Input<typeof transaction1559UnsignedSchema>

export const transaction1559SignedSchema = object({
  type: string(),
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  gasPrice: uintSchema,
  accessList: accessListSchema,
  chainId: uintSchema,
  yParity: uintSchema,
  r: uintSchema,
  s: uintSchema,
})
export type Transaction1559Signed = Input<typeof transaction1559SignedSchema>
