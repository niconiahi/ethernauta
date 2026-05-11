// https://eips.ethereum.org/EIPS/eip-6963

import type { Provider } from "../1193"

export interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: Provider
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: "eip6963:announceProvider"
  detail: EIP6963ProviderDetail
}

export interface EIP6963RequestProviderEvent extends Event {
  type: "eip6963:requestProvider"
}

export const ANNOUNCE_EVENT =
  "eip6963:announceProvider" as const
export const REQUEST_EVENT =
  "eip6963:requestProvider" as const

export function announce(
  detail: EIP6963ProviderDetail,
): void {
  const frozen = Object.freeze({
    info: Object.freeze(detail.info),
    provider: detail.provider,
  })

  function dispatch() {
    window.dispatchEvent(
      new CustomEvent(ANNOUNCE_EVENT, { detail: frozen }),
    )
  }

  dispatch()
  window.addEventListener(REQUEST_EVENT, dispatch)
}
