import type {
  EIP6963ProviderDetail,
  Store,
} from "@ethernauta/eip/6963"
import {
  create_provider,
  type ProviderResolver,
} from "@ethernauta/transport"
import { useMemo } from "react"

import { useProviderDetail } from "./use-provider-detail"

export type Provider = ProviderResolver & {
  provider_detail: EIP6963ProviderDetail
}

// Composes `useProviderDetail` with `create_provider`:
// returns the dapp-side resolver pair (`reader`, `signer`)
// already wired to the rehydrated EIP-1193 provider, plus
// the originating detail (so callers can read info.name /
// info.icon). Returns `null` until the 6963 announce dance
// resolves the persisted wallet.
export function useProvider({
  key,
  store,
}: {
  key: string
  store?: Store
}): Provider | null {
  const provider_detail = useProviderDetail({ key, store })
  return useMemo(() => {
    if (!provider_detail) return null
    const resolver = create_provider(
      provider_detail.provider,
    )
    return {
      provider_detail,
      reader: resolver.reader,
      signer: resolver.signer,
    }
  }, [provider_detail])
}
