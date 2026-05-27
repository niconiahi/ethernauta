// End-to-end: connect, sign, send, track. Single component.
// Distilled from examples/playground/app/routes/home.tsx.

import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import {
  eth_sendRawTransaction,
  eth_signTransaction,
} from "@ethernauta/eth"
import {
  create_signer,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { number_to_hex } from "@ethernauta/utils"
import { useState } from "react"

// Single-hash tracking hook from the transaction-tracking example.
// See skills/ethernauta/examples/transaction-tracking/example.tsx.
import {
  TxBadge,
  useTransaction,
} from "../transaction-tracking/example"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const CHAINS = [
  {
    chainId: CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
]

const signer = create_signer(CHAINS)
const writer = create_writer(CHAINS)

export default function Demo() {
  const [account, set_account] = useState<string | null>(
    null,
  )
  const { tx, track } = useTransaction()
  const [error, set_error] = useState<string | null>(null)

  async function handle_connect() {
    const accounts = await eth_requestAccounts()(
      signer({ chain_id: CHAIN_ID }),
    )
    if (accounts[0]) set_account(accounts[0])
  }

  async function handle_transfer() {
    set_error(null)
    try {
      const signed = await eth_signTransaction([
        {
          to: "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
          value: number_to_hex(1),
        },
      ])(signer({ chain_id: CHAIN_ID }))

      const hash = await eth_sendRawTransaction([signed])(
        writer({ chain_id: CHAIN_ID }),
      )

      // Start the pending → mined / reverted poll.
      track(hash)
    } catch (err) {
      set_error(
        err instanceof Error
          ? err.message
          : "Unknown error",
      )
    }
  }

  return (
    <div>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={handle_connect}>Connect</button>
      )}
      <button onClick={handle_transfer} disabled={!account}>
        Send 1 wei
      </button>
      <TxBadge tx={tx} />
      {error ? <p>{error}</p> : null}
    </div>
  )
}
