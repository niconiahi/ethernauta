import { Hash32 } from "@ethernauta/eth"
import { Transaction } from "@ethernauta/transaction"

declare global {
  interface Window {
    transactions: Map<Hash32, Transaction>
  }
}
