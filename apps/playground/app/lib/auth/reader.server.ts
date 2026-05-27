// The playground's chain wiring for SIWE verification.
// Same shape every demo uses: a hand-picked array of
// `{ chainId, transports }` passed to `create_reader`.
// Any SIWE message whose `Chain ID` field isn't covered
// here will surface as `unsupported_chain` from the verify
// route — that's the consumer's policy, not a property of
// `verify_siwe_message` itself.

import {
  eip155_1,
  eip155_11155111,
} from "@ethernauta/chain"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})
const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

export const reader = create_reader([
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [
      http("https://ethereum-rpc.publicnode.com"),
    ],
  },
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
])
