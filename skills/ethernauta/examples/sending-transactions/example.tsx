// Sign a native ETH transfer, then broadcast it.
// Pattern: provider.signer for signing, writer for sending.

import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  eth_sendRawTransaction,
  eth_signTransaction,
} from "@ethernauta/eth"
import type { ProviderResolver } from "@ethernauta/transport"
import {
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { number_to_hex } from "@ethernauta/utils"

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

const writer = create_writer(CHAINS)

// Pass in the resolver pair from `create_provider(provider)`
// — see `wallet-connect/example.tsx` for how to acquire it.
export async function send_transfer(
  provider: ProviderResolver,
  to: `0x${string}`,
  wei: number,
) {
  // Step 1 — wallet signs. Leave nonce/gas fields unset:
  // the wallet fills them via eth_getTransactionCount /
  // eth_estimateGas / eth_feeHistory.
  const signed = await eth_signTransaction([
    {
      to,
      value: number_to_hex(wei),
    },
  ])(provider.signer({ chain_id: CHAIN_ID }))

  // Step 2 — broadcast the RLP-encoded signed tx.
  const hash = await eth_sendRawTransaction([signed])(
    writer({ chain_id: CHAIN_ID }),
  )

  return hash
}
