import type { Hash32 } from "@ethernauta/eth"
import type {
  PendingTransaction,
  Transaction,
} from "./transaction"

export function registerTransaction(
  hash: PendingTransaction["hash"],
) {
  // TODO: inject a "store" that will implement a "set" method
  // to store the transaction -- any key store should do it
  if (!window.transactions) {
    window.transactions = new Map<Hash32, Transaction>()
  }
  const transaction: PendingTransaction = {
    hash,
    status: "pending",
  }
  window.transactions.set(hash, transaction)
  return transaction
}
