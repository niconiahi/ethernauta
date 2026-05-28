import { Hash32Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  literal,
  number,
  object,
  string,
  union,
} from "valibot"

/**
 * Lifecycle state of a transaction the dapp has submitted
 * and is tracking client-side via receipt polling.
 *
 * Owned by this package because lifecycle is what the package
 * IS — separate concern from the Ethereum-spec transaction
 * objects in @ethernauta/eth (TransactionInfo,
 * Transaction1559Signed, etc.), which describe wire-level
 * transaction shape, not lifecycle.
 */

export const PendingTransactionSchema = object({
  hash: Hash32Schema,
  status: literal("pending"),
})
export const MinedTransactionSchema = object({
  hash: Hash32Schema,
  status: literal("mined"),
  blockNumber: number(),
  blockHash: Hash32Schema,
  gasUsed: string(),
})
export const RevertedTransactionSchema = object({
  hash: Hash32Schema,
  status: literal("reverted"),
  blockNumber: number(),
  blockHash: Hash32Schema,
  gasUsed: string(),
})
export const TransactionSchema = union([
  PendingTransactionSchema,
  MinedTransactionSchema,
  RevertedTransactionSchema,
])

export type PendingTransaction = InferOutput<
  typeof PendingTransactionSchema
>
export type MinedTransaction = InferOutput<
  typeof MinedTransactionSchema
>
export type RevertedTransaction = InferOutput<
  typeof RevertedTransactionSchema
>
export type Transaction = InferOutput<
  typeof TransactionSchema
>
