// Calling a state-changing contract method.
// Taken from animatronik's dapp.add.tsx mint flow.

import { eip155_11155111 } from "@ethernauta/chain"
import { addressSchema } from "@ethernauta/eth"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import {
  create_signer,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { useState } from "react"
import { parse } from "valibot"

// Generated method — encodes calldata + attaches the function
// sidecar { signature: "mint(string)", names: ["data"] } so the
// wallet can render a human-readable confirmation.
import { mint } from "~/generated/animatronik/methods/mint"

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

export function MintButton({
  contract_address,
  data,
}: {
  contract_address: string
  data: string
}) {
  const { tx, track } = useTransaction()
  const [error, set_error] = useState<string | null>(null)

  async function handle_mint() {
    set_error(null)
    try {
      // Validate the contract address at the boundary.
      const to = parse(addressSchema, contract_address)

      // Signable: signer({ chain_id, to }) — `to` is the
      // contract address, supplied here, not baked into mint().
      const signed = await mint({ data })(
        signer({ chain_id: CHAIN_ID, to }),
      )

      // Broadcast identical to a native transfer.
      const hash = await eth_sendRawTransaction([signed])(
        writer({ chain_id: CHAIN_ID }),
      )

      // Start the pending → mined / reverted poll.
      track(hash)
    } catch (err) {
      set_error(
        err instanceof Error ? err.message : "Mint failed",
      )
    }
  }

  return (
    <>
      <button onClick={handle_mint}>Mint</button>
      <TxBadge tx={tx} />
      {error ? <p>{error}</p> : null}
    </>
  )
}
