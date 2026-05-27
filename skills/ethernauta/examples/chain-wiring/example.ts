// Build the chain id and chain entries once at module scope.
// Pass the resulting CHAINS array to whichever factories you need.

import {
  eip155_1,
  eip155_11155111,
} from "@ethernauta/chain"
import {
  create_reader,
  create_signer,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const NAMESPACE = { ETHEREUM: "eip155" }

// CAIP-2 strings — never raw integers.
export const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_1.chainId,
})
export const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})

// One ChainEntry per supported chain. `transports` only needed
// for reader / writer / contract — not for the signer.
const CHAINS = [
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
      // Add more for fallback — Promise.any picks the first to succeed.
    ],
  },
]

// Module-scope factories. Stable for the lifetime of the dapp.
export const reader = create_reader(CHAINS)
export const writer = create_writer(CHAINS)
export const signer = create_signer(CHAINS)
