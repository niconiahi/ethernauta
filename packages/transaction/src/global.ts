import type { Hash32 } from "@ethernauta/eth"
import type { Transaction } from "./transaction"

declare global {
  interface Window {
    transactions: Map<Hash32, Transaction>
  }
}
