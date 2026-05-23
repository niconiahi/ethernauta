import {
  addressSchema,
  hash32Schema,
  uintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { intersect, object } from "valibot"
import { TransactionSignedSchema } from "./signed"

/**
 * Transaction information object.
 */

const contextualInfoSchema = object({
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  hash: hash32Schema,
  transactionIndex: uintSchema,
})

export const TransactionInfoSchema = intersect([
  contextualInfoSchema,
  TransactionSignedSchema,
])
export type TransactionInfo = InferOutput<
  typeof TransactionInfoSchema
>
