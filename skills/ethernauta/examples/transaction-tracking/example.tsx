// Single-hash UI tracking via @ethernauta/transaction.
// Compose register_transaction + watch_transaction against a
// tracker resolver. The tracker takes the same CHAINS array
// as create_reader / create_writer / create_signer + a `store`
// telling the package where to persist the lifecycle records.
// `window_store` is the default browser-side backend (writes
// into a Map hung off `window.transactions`); pass any
// Store-shaped object for custom backends (chrome.storage,
// IndexedDB, in-memory tests).

import { eip155_11155111 } from "@ethernauta/chain"
import type { Hash32 } from "@ethernauta/core"
import {
  create_tracker,
  register_transaction,
  type Transaction,
  watch_transaction,
  window_store,
} from "@ethernauta/transaction"
import { encode_chain_id, http } from "@ethernauta/transport"
import { useEffect, useRef, useState } from "react"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const tracker = create_tracker(
  [
    {
      chainId: CHAIN_ID,
      transports: [
        http("https://ethereum-sepolia-rpc.publicnode.com"),
      ],
    },
  ],
  { store: window_store },
)

export function useTransaction() {
  const [tx, set_tx] = useState<Transaction | null>(null)
  // Hold the unsubscribe so the cleanup path can tear down the
  // poll loop if the component unmounts before the receipt
  // arrives.
  const unsubscribe_ref = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      unsubscribe_ref.current?.()
    }
  }, [])

  async function track(hash: Hash32) {
    const pending = await register_transaction(hash)(
      tracker({ chain_id: CHAIN_ID }),
    )
    set_tx(pending)
    unsubscribe_ref.current = watch_transaction(
      hash,
      (transaction) => set_tx(transaction),
    )(tracker({ chain_id: CHAIN_ID }))
  }

  return { tx, track }
}

export function TxBadge({
  tx,
}: {
  tx: Transaction | null
}) {
  if (!tx) return null
  switch (tx.status) {
    case "pending":
      return <p>Pending — {tx.hash}</p>
    case "mined":
      return <p>Mined — {tx.hash}</p>
    case "reverted":
      return <p>Reverted — {tx.hash}</p>
  }
}
