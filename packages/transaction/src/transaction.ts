import { hash32Schema } from "@ethernauta/core"
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

export const pendingTransactionSchema = object({
  hash: hash32Schema,
  status: literal("pending"),
})
export const minedTransactionSchema = object({
  hash: hash32Schema,
  status: literal("mined"),
  blockNumber: number(),
  blockHash: hash32Schema,
  gasUsed: string(),
})
export const revertedTransactionSchema = object({
  hash: hash32Schema,
  status: literal("reverted"),
  blockNumber: number(),
  blockHash: hash32Schema,
  gasUsed: string(),
})
export const transactionSchema = union([
  pendingTransactionSchema,
  minedTransactionSchema,
  revertedTransactionSchema,
])

export type PendingTransaction = InferOutput<
  typeof pendingTransactionSchema
>
export type MinedTransaction = InferOutput<
  typeof minedTransactionSchema
>
export type RevertedTransaction = InferOutput<
  typeof revertedTransactionSchema
>
export type Transaction = InferOutput<
  typeof transactionSchema
>
