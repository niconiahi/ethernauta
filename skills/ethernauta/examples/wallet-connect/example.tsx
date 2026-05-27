// Connect a wallet and cache the user's address.
// Mirrors animatronik's dapp.tsx route header.

import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import {
  create_signer,
  encode_chain_id,
} from "@ethernauta/transport"
import { useState } from "react"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

// Signer factory at module scope. No transports needed —
// the signer talks to the wallet via window.postMessage.
const signer = create_signer([{ chainId: CHAIN_ID }])

export default function Connect() {
  const [account, set_account] = useState<string | null>(
    null,
  )
  const [error, set_error] = useState<string | null>(null)

  async function handle_connect() {
    set_error(null)
    try {
      const accounts = await eth_requestAccounts()(
        signer({ chain_id: CHAIN_ID }),
      )
      set_account(accounts[0] ?? null)
    } catch (err) {
      // 4001 = user rejected / extension closed
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
      <button onClick={handle_connect}>Connect</button>
      {error ? <p>{error}</p> : null}
    </>
  )
}
