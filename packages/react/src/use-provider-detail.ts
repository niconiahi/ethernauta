import {
  type EIP6963ProviderDetail,
  get_provider_detail,
  type Store,
  web_storage,
} from "@ethernauta/eip/6963"
import { useEffect, useState } from "react"

// React adapter over `get_provider_detail`. Runs the
// EIP-6963 announce request once on mount, filters by the
// rdns persisted under `key`, and returns the matching
// detail (or null while in flight / when the wallet did
// not announce). Callers own the storage key.
export function useProviderDetail({
  key,
  store: _store,
}: {
  key: string
  store?: Store
}): EIP6963ProviderDetail | null {
  const [provider_detail, set_provider_detail] =
    useState<EIP6963ProviderDetail | null>(null)

  useEffect(() => {
    const store = _store ?? web_storage(window.localStorage)
    get_provider_detail({
      store,
      key,
    }).then((result) => {
      set_provider_detail(result)
    })
  }, [key, _store])

  return provider_detail
}
