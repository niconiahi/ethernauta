import { Hash32 } from "@ethernauta/core"
import { Transaction } from "@ethernauta/transaction"

declare global {
  interface Window {
    transactions: Map<Hash32, Transaction>
  }
}
