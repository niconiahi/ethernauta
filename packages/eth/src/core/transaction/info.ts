import type { InferOutput } from "valibot"
import { object } from "valibot"

import {
  addressSchema,
  Hash32Schema,
  uintSchema,
} from "../base"

/**
 * Transaction information object.
 */

export const transactionInfoSchema = object({
  blockHash: Hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  hash: Hash32Schema,
  transactionIndex: uintSchema,
})
export type TransactionInfo = InferOutput<
  typeof transactionInfoSchema
>
