import { hash32Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  literal,
  number,
  object,
  string,
  union,
} from "valibot"

export const PendingTransactionSchema = object({
  hash: hash32Schema,
  status: literal("pending"),
})
export const MinedTransactionSchema = object({
  hash: hash32Schema,
  status: literal("mined"),
  blockNumber: number(),
  blockHash: hash32Schema,
  gasUsed: string(),
})
// export const ConfirmedTransactionSchema = object({
//   hash: hash32Schema,
//   status: literal("confirmed"),
//   blockNumber: number(),
//   blockHash: hash32Schema,
//   gasUsed: string(),
//   confirmations: number(),
// })
export const RevertedTransactionSchema = object({
  hash: hash32Schema,
  status: literal("reverted"),
  blockNumber: number(),
  blockHash: hash32Schema,
  gasUsed: string(),
})
export const TransactionSchema = union([
  PendingTransactionSchema,
  MinedTransactionSchema,
  // ConfirmedTransactionSchema,
  RevertedTransactionSchema,
])

export type PendingTransaction = InferOutput<
  typeof PendingTransactionSchema
>
export type MinedTransaction = InferOutput<
  typeof MinedTransactionSchema
>
// export type ConfirmedTransaction = InferOutput<
//   typeof ConfirmedTransactionSchema
// >
export type RevertedTransaction = InferOutput<
  typeof RevertedTransactionSchema
>
export type Transaction = InferOutput<
  typeof TransactionSchema
>
