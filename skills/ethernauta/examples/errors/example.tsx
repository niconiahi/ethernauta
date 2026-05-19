// Distinguish user rejections (4001) from RPC errors and
// validation errors. Render the first softly; surface the rest.

import { eip155_11155111 } from "@ethernauta/chain"
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import { eth_sendRawTransaction, eth_signTransaction } from "@ethernauta/eth"
import {
  create_signer,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { number_to_hex } from "@ethernauta/utils"
import { useState } from "react"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
const CHAINS = [
  {
    chainId: CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
]
const signer = create_signer(CHAINS)
const writer = create_writer(CHAINS)

// EIP-1193 user-rejection / extension-close shape.
type Eip1193Error = { code: number; message: string }

function is_user_rejection(err: unknown): err is Eip1193Error {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === 4001
  )
}

export function ErrorAwareTransfer() {
  const [status, set_status] = useState<string | null>(null)

  async function handle_click() {
    set_status(null)
    try {
      const [account] = await eth_requestAccounts()(
        signer({ chain_id: CHAIN_ID }),
      )
      if (!account) throw new Error("No account returned")

      const signed = await eth_signTransaction([
        {
          to: "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
          value: number_to_hex(1),
        },
      ])(signer({ chain_id: CHAIN_ID }))

      const hash = await eth_sendRawTransaction([signed])(
        writer({ chain_id: CHAIN_ID }),
      )
      set_status(`Sent: ${hash}`)
    } catch (err) {
      if (is_user_rejection(err)) {
        // Expected. Soft message, no log.
        set_status("Cancelled")
        return
      }
      // RPC / validation / network errors — surface and log.
      console.error(err)
      set_status(
        err instanceof Error ? err.message : "Unknown error",
      )
    }
  }

  return (
    <>
      <button onClick={handle_click}>Send</button>
      {status ? <p>{status}</p> : null}
    </>
  )
}
