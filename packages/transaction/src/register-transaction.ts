import type { Hash32 } from "@ethernauta/core"

import type { Trackable } from "./tracker"
import type { PendingTransaction } from "./transaction"

/**
 * Seed a pending lifecycle record for `hash` in the store.
 * Returns the seeded record so callers can prime UI state
 * in a single step right after `eth_sendRawTransaction` (or
 * `eth_sendTransaction`) resolves.
 */
export function register_transaction(
  hash: Hash32,
): Trackable<PendingTransaction> {
  return async ([
    _transports,
    context,
  ]): Promise<PendingTransaction> => {
    const transaction: PendingTransaction = {
      hash,
      status: "pending",
    }
    await context.store.set(hash, transaction)
    return transaction
  }
}
