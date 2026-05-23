import type { Hash32 } from "@ethernauta/core"
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import { hex_to_number, invariant } from "@ethernauta/utils"

import type { Watchable } from "./tracker"
import type {
  MinedTransaction,
  RevertedTransaction,
  Transaction,
} from "./transaction"

const POLL_INTERVAL_MS = 2000

/**
 * Start polling `eth_getTransactionReceipt` for `hash`. On
 * each status transition (`pending` → `mined` / `reverted`)
 * the transition is persisted to the store and `callback` is
 * fired with the new lifecycle record. The loop self-terminates
 * once a receipt arrives.
 *
 * The second invocation returns an `unsubscribe` function —
 * call it from a `useEffect` cleanup to tear down the polling
 * loop early when a component unmounts, so a still-pending
 * transaction doesn't fire `callback` on a dead consumer.
 */
export function watch_transaction(
  hash: Hash32,
  callback: (transaction: Transaction) => void,
): Watchable {
  return ([transports, context]): (() => void) => {
    const interval_id = setInterval(async () => {
      const receipt = await eth_getTransactionReceipt([
        hash,
      ])([transports, context])
      if (!receipt) return
      invariant(
        receipt.status,
        "status should exist as the transaction was created after Byzantium update",
      )
      const status = hex_to_number(receipt.status)
      if (status === 1) {
        const transaction: MinedTransaction = {
          blockHash: receipt.blockHash,
          blockNumber: hex_to_number(receipt.blockNumber),
          gasUsed: receipt.gasUsed,
          hash,
          status: "mined",
        }
        await context.store.set(hash, transaction)
        callback(transaction)
        clearInterval(interval_id)
      } else if (status === 0) {
        const transaction: RevertedTransaction = {
          blockHash: receipt.blockHash,
          blockNumber: hex_to_number(receipt.blockNumber),
          gasUsed: receipt.gasUsed,
          hash,
          status: "reverted",
        }
        await context.store.set(hash, transaction)
        callback(transaction)
        clearInterval(interval_id)
      }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval_id)
  }
}
