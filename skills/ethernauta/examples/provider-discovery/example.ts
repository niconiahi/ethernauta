// EIP-6963 wallet discovery — listen for wallets that announce
// themselves, then dispatch the request event to trigger them.
// Most dapps that only target Ethernauta can skip this and use
// the signer directly — see examples/wallet-connect/.

import type { EIP6963ProviderDetail } from "@ethernauta/eip/6963"
import {
  ANNOUNCE_EVENT,
  REQUEST_EVENT,
} from "@ethernauta/eip/6963"

export function discover_wallets(
  on_wallet: (detail: EIP6963ProviderDetail) => void,
): () => void {
  function handle_announce(event: Event) {
    const detail = (
      event as CustomEvent<EIP6963ProviderDetail>
    ).detail
    on_wallet(detail)
  }

  window.addEventListener(ANNOUNCE_EVENT, handle_announce)
  // Trigger wallets that registered before our listener was set up.
  window.dispatchEvent(new Event(REQUEST_EVENT))

  // Caller cleans up — e.g. inside useEffect's return.
  return () =>
    window.removeEventListener(
      ANNOUNCE_EVENT,
      handle_announce,
    )
}

// Usage:
//
//   const wallets: EIP6963ProviderDetail[] = []
//   const dispose = discover_wallets((detail) => {
//     wallets.push(detail)
//     // detail.info: { uuid, name, icon, rdns }
//     // detail.provider: EIP-1193 Provider
//   })
//   // later:
//   const accounts = await wallets[0].provider.request({
//     method: "eth_requestAccounts",
//   })
