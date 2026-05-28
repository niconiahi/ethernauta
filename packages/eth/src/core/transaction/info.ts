import {
  AddressSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { intersect, object } from "valibot"
import { TransactionSignedSchema } from "./signed"

/**
 * Transaction information object.
 */

const ContextualInfoSchema = object({
  blockHash: Hash32Schema,
  blockNumber: UintSchema,
  from: AddressSchema,
  hash: Hash32Schema,
  transactionIndex: UintSchema,
})

export const TransactionInfoSchema = intersect([
  ContextualInfoSchema,
  TransactionSignedSchema,
])
export type TransactionInfo = InferOutput<
  typeof TransactionInfoSchema
>
