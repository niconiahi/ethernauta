// Wire register_transaction + watch_transaction to component state.
// The watcher polls and re-invokes the callback on every status change.

import {
  register_transaction,
  type Transaction,
  watch_transaction,
} from "@ethernauta/transaction"
import { useState } from "react"

export function useTransaction() {
  const [tx, set_tx] = useState<Transaction | null>(null)

  function track(hash: `0x${string}`) {
    // Seed an in-memory record so the UI has something
    // to render before the first poll completes.
    const initial = register_transaction(hash)
    set_tx(initial)

    // Fires on every transition: pending -> mined / reverted.
    watch_transaction(hash, (updated) => set_tx(updated))
  }

  return { tx, track }
}

export function TxBadge({ tx }: { tx: Transaction | null }) {
  if (!tx) return null
  switch (tx.status) {
    case "pending":
      return <p>Pending — {tx.hash}</p>
    case "mined":
      return <p>Mined — {tx.hash}</p>
    case "reverted":
      return <p>Reverted — {tx.hash}</p>
    default:
      return <p>Unknown — {tx.hash}</p>
  }
}
