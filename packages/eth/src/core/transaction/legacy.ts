import type { InferOutput } from "valibot"
import { nullable, object, optional } from "valibot"

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "../base"

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L283
const transactionLegacyUnsignedSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  gasPrice: uintSchema,
  chainId: optional(uintSchema),
})
export type TransactionLegacyUnsigned = InferOutput<
  typeof transactionLegacyUnsignedSchema
>

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L432
export const transactionLegacySignedSchema = object({
  ...transactionLegacyUnsignedSchema.entries,
  v: uintSchema,
  r: uintSchema,
  s: uintSchema,
})
export type TransactionLegacySigned = InferOutput<
  typeof transactionLegacySignedSchema
>
