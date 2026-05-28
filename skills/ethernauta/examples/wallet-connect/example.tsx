// Connect a wallet and cache the user's address.
// Discovers a wallet via EIP-6963, then adapts it through
// `create_provider` to get a Signable resolver.

import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import type { Provider } from "@ethernauta/eip/1193"
import {
  ANNOUNCE_EVENT,
  type EIP6963AnnounceProviderEvent,
  type EIP6963ProviderDetail,
  REQUEST_EVENT,
} from "@ethernauta/eip/6963"
import {
  create_provider,
  encode_chain_id,
} from "@ethernauta/transport"
import { useEffect, useState } from "react"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

export default function Connect() {
  const [providers, set_providers] = useState<
    EIP6963ProviderDetail[]
  >([])
  const [account, set_account] = useState<string | null>(
    null,
  )
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    function on_announce(event: Event) {
      const detail = (event as EIP6963AnnounceProviderEvent)
        .detail
      set_providers((current) =>
        current.some(
          (c) => c.info.rdns === detail.info.rdns,
        )
          ? current
          : [...current, detail],
      )
    }
    window.addEventListener(ANNOUNCE_EVENT, on_announce)
    window.dispatchEvent(new Event(REQUEST_EVENT))
    return () =>
      window.removeEventListener(
        ANNOUNCE_EVENT,
        on_announce,
      )
  }, [])

  async function handle_connect(detail: EIP6963ProviderDetail) {
    set_error(null)
    try {
      const { signer } = create_provider(
        detail.provider as Provider,
      )
      const accounts = await eth_requestAccounts()(
        signer({ chain_id: CHAIN_ID }),
      )
      set_account(accounts[0] ?? null)
    } catch (err) {
      // 4001 = user rejected
      set_error(
        err instanceof Error
          ? err.message
          : "Connect failed",
      )
    }
  }

  if (account) return <div>Connected: {account}</div>
  return (
    <>
      {providers.length === 0 ? (
        <p>No EIP-6963 wallet detected.</p>
      ) : (
        providers.map((detail) => (
          <button
            key={detail.info.rdns}
            onClick={() => handle_connect(detail)}
          >
            Connect {detail.info.name}
          </button>
        ))
      )}
      {error ? <p>{error}</p> : null}
    </>
  )
}
