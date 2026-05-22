// Single-hash UI tracking via inline eth_getTransactionReceipt
// polling. There is no @ethernauta/transaction package anymore —
// the wallet owns batch tracking (see EIP-5792 / wallet_getCallsStatus),
// and dapps that just want to render pending → mined for a single
// hash inline this ~10-line poll loop next to the broadcast call.

import { eip155_11155111 } from "@ethernauta/chain"
import type { Hash32 } from "@ethernauta/core"
import {
  eth_getTransactionReceipt,
  type SubmittedTransaction,
} from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { hex_to_number } from "@ethernauta/utils"
import { useState } from "react"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
])

const POLL_INTERVAL_MS = 2000

export function useTransaction() {
  const [tx, set_tx] = useState<SubmittedTransaction | null>(
    null,
  )

  function track(hash: Hash32) {
    set_tx({ hash, status: "pending" })
    const interval_id = setInterval(async () => {
      const receipt = await eth_getTransactionReceipt([hash])(
        reader({ chain_id: CHAIN_ID }),
      )
      if (!receipt) return
      if (!receipt.status) return
      const next: SubmittedTransaction =
        hex_to_number(receipt.status) === 1
          ? { hash, status: "mined" }
          : { hash, status: "reverted" }
      set_tx(next)
      clearInterval(interval_id)
    }, POLL_INTERVAL_MS)
  }

  return { tx, track }
}

export function TxBadge({
  tx,
}: {
  tx: SubmittedTransaction | null
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
