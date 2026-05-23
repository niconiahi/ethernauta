import type { Hash32 } from "@ethernauta/core"

import type { Transaction } from "./transaction"

/**
 * Backend that persists the lifecycle records the tracker
 * verbs read and write. Async-shaped so a sync Map can be
 * wrapped trivially and an async backend (chrome.storage.session,
 * IndexedDB, etc.) drops in without changing the verbs.
 */
export type Store = {
  get(hash: Hash32): Promise<Transaction | undefined>
  set(hash: Hash32, transaction: Transaction): Promise<void>
}

declare global {
  interface Window {
    transactions?: Map<Hash32, Transaction>
  }
}

/**
 * Default store: wraps `window.transactions` (a Map on the
 * window object) in the async Store interface. Lazily
 * creates the Map on first access. Browser-only — pass a
 * custom Store in non-browser contexts (service worker,
 * SSR, tests).
 */
export const window_store: Store = {
  async get(hash) {
    if (!window.transactions) {
      window.transactions = new Map()
    }
    return window.transactions.get(hash)
  },
  async set(hash, transaction) {
    if (!window.transactions) {
      window.transactions = new Map()
    }
    window.transactions.set(hash, transaction)
  },
}
