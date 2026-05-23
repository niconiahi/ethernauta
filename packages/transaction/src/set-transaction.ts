import type { Trackable } from "./tracker"
import type { Transaction } from "./transaction"

/**
 * Persist any lifecycle record (pending / mined / reverted)
 * to the store. Used internally by `watch_transaction` to
 * write transitions; callers may also use it directly when
 * they have a `Transaction` value from outside the watcher.
 */
export function set_transaction(
  transaction: Transaction,
): Trackable<void> {
  return async ([_transports, context]): Promise<void> => {
    await context.store.set(transaction.hash, transaction)
  }
}
