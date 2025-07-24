import type { InferOutput } from "valibot"
import { object } from "valibot"

import { addressSchema, hash32Schema, uintSchema } from "../../base"

/**
 * Transaction information object.
 */

export const transactionInfoSchema = object({
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  hash: hash32Schema,
  transactionIndex: uintSchema,
})
export type TransactionInfo = InferOutput<typeof transactionInfoSchema>
