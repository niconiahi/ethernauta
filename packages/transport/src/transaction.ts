import * as v from "valibot"
import invariant from "./tiny-invariant"

export const TransactionStatusSchema = v.union([
  v.literal("pending"),
  v.literal("mined"),
  v.literal("confirmed"),
  v.literal("reverted"),
  v.literal("dropped"),
  v.literal("rejected"),
])
export const TransactionSchema = v.object({
  status: TransactionStatusSchema,
})
export type Transaction = v.InferOutput<
  typeof TransactionSchema
>

declare global {
  interface Window {
    transactions: Map<`0x${string}`, Transaction>
  }
}

export function store_transaction(
  signed_transaction: `0x${string}`,
  transaction: Transaction,
) {
  // "transaction" is the initial state to be stored
  invariant(
    transaction.status === "pending",
    "only unsent transactions are allowed to store",
  )
  window.transactions.set(signed_transaction, transaction)
}

export function get_transaction(
  signed_transaction: `0x${string}`,
) {
  const transaction = window.transactions.get(
    signed_transaction,
  )
  // "transaction" is a snapshot of transaction
  // at the time of calling "get_transaction"
}

export function watch_transaction(
  signed_transaction: `0x${string}`,
) {
  // a new "transaction" is returned every time
  // the transaction mutates state
}
