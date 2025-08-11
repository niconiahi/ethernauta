import type { InferOutput } from "valibot"
import { intersect, object } from "valibot"
import {
  addressSchema,
  Hash32Schema,
  uintSchema,
} from "../base"
import { TransactionSignedSchema } from "./signed"

/**
 * Transaction information object.
 */

const contextualInfoSchema = object({
  blockHash: Hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  hash: Hash32Schema,
  transactionIndex: uintSchema,
})

export const TransactionInfoSchema = intersect([
  contextualInfoSchema,
  TransactionSignedSchema,
])
export type TransactionInfo = InferOutput<
  typeof TransactionSignedSchema
>
