import type { Hash32 } from "@ethernauta/eth"
import type { Transaction } from "@ethernauta/transaction"

declare global {
  interface Window {
    transactions: Map<Hash32, Transaction>
  }
}
