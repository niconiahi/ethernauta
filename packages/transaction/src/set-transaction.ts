import type { Hash32 } from "@ethernauta/eth"
import type { Transaction } from "./transaction"

export function set_transaction(transaction: Transaction) {
  // TODO: inject a "store" that will implement a "set" method
  // to store the transaction -- any key store should do it
  if (!window.transactions) {
    window.transactions = new Map<Hash32, Transaction>()
  }
  window.transactions.set(transaction.hash, transaction)
}
