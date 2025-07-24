import type { InferOutput } from "valibot"
import { nullable, object, string } from "valibot"

import { addressSchema, bytesSchema, uintSchema } from "../../base"

const transactionLegacyUnsignedSchema = object({
  type: string(),
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  gasPrice: uintSchema,
  chainId: uintSchema,
})
export type TransactionLegacyUnsigned = InferOutput<typeof transactionLegacyUnsignedSchema>

const transactionLegacySignedSchema = object({
  type: string(),
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  gasPrice: uintSchema,
  chainId: uintSchema,
  yParity: uintSchema,
  r: uintSchema,
  s: uintSchema,
})
export type TransactionLegacySigned = InferOutput<typeof transactionLegacySignedSchema>
