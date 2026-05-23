// https://eips.ethereum.org/EIPS/eip-6963

import { useEffect, useState } from "react"
import type { Provider } from "../../1193"
import { restore_picked_provider, type Storage } from ".."

export const PICKED_PROVIDER_RDNS_KEY =
  "ethernauta:eip-6963:picked-rdns" as const

function web_storage(backing: globalThis.Storage): Storage {
  return {
    get(key) {
      return backing.getItem(key)
    },
    set(key, value) {
      backing.setItem(key, value)
    },
    remove(key) {
      backing.removeItem(key)
    },
  }
}

export function use_provider_detail(): Provider | null {
  const [provider, set_provider] =
    useState<Provider | null>(null)
  useEffect(() => {
    let cancelled = false
    void restore_picked_provider({
      storage: web_storage(window.localStorage),
      key: PICKED_PROVIDER_RDNS_KEY,
    }).then((result) => {
      if (cancelled) return
      set_provider(result)
    })
    return () => {
      cancelled = true
    }
  }, [])
  return provider
}
