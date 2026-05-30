import type { Hash32 } from "@ethernauta/core"
import {
  eth_getTransactionReceipt,
  is_post_byzantium,
  RECEIPT_STATUS,
} from "@ethernauta/eth"
import { hex_to_number } from "@ethernauta/utils"

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
  return ([dispatcher, context]): (() => void) => {
    const interval_id = setInterval(async () => {
      const receipt = await eth_getTransactionReceipt([
        hash,
      ])([dispatcher, context])
      if (!receipt) return
      if (!is_post_byzantium(receipt)) return
      if (receipt.status === RECEIPT_STATUS.SUCCESS) {
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
      } else {
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
