// The playground's chain wiring for SIWE verification.
// Covers every chain a demo can keep the wallet on, so a
// connect flow doesn't fail with `unsupported_chain` just
// because the user previously switched chains for another
// demo (the wallet persists `selected_chain` in
// chrome.storage.local). Any SIWE message whose `Chain ID`
// field isn't covered here surfaces as `unsupported_chain`
// from the verify route — that's the consumer's policy, not
// a property of `verify_siwe_message` itself.

import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { eip155_324 } from "@ethernauta/chain/eip155-324"
import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_11155420 } from "@ethernauta/chain/eip155-11155420"
import type { Chain } from "@ethernauta/chain"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

function entry(chain: Chain) {
  const rpc_url = chain.rpc[0]
  if (!rpc_url) {
    throw new Error(
      `chain ${chain.chainId} has no rpc — pick another`,
    )
  }
  return {
    chainId: encode_chain_id({
      namespace: "eip155",
      reference: chain.chainId,
    }),
    transports: [http(rpc_url)],
  }
}

export const reader = create_reader([
  entry(eip155_1), // Ethereum Mainnet
  entry(eip155_10), // OP Mainnet
  entry(eip155_324), // zkSync Era
  entry(eip155_8453), // Base
  entry(eip155_42161), // Arbitrum One
  entry(eip155_11155111), // Sepolia
  entry(eip155_11155420), // OP Sepolia
])
