import type { Input } from "valibot"
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
export type TransactionInfo = Input<typeof transactionInfoSchema>
