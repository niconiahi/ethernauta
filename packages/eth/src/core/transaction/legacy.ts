import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { nullable, object, optional } from "valibot"

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L283
const TransactionLegacyUnsignedSchema = object({
  type: ByteSchema,
  nonce: UintSchema,
  to: nullable(AddressSchema),
  gas: UintSchema,
  value: UintSchema,
  input: BytesSchema,
  gasPrice: UintSchema,
  chainId: optional(UintSchema),
})
export type TransactionLegacyUnsigned = InferOutput<
  typeof TransactionLegacyUnsignedSchema
>

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L432
export const TransactionLegacySignedSchema = object({
  ...TransactionLegacyUnsignedSchema.entries,
  v: UintSchema,
  r: UintSchema,
  s: UintSchema,
})
export type TransactionLegacySigned = InferOutput<
  typeof TransactionLegacySignedSchema
>
