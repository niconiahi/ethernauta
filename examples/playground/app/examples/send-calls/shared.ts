// Inputs shared by the two dual-path variants of this
// demo so the standard / primitive panels can't drift.

import { eip155_11155111 } from "@ethernauta/chain"
import {
  encode_chain_id,
  http,
} from "@ethernauta/transport"

export const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

export const SEPOLIA_CHAIN_REF_HEX =
  `0x${eip155_11155111.chainId.toString(16)}` as const

export const CHAINS = [
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
]

// Two harmless 0-wei self-calls — just enough to prove the
// wallet sequenced the batch and posted both transactions.
export const TARGETS = [
  "0x1111111111111111111111111111111111111111" as const,
  "0x2222222222222222222222222222222222222222" as const,
]

export const CALLS = TARGETS.map((to) => ({
  to,
  value: "0x0" as const,
  data: "0x" as const,
}))

export const NETWORK_LABEL = `${eip155_11155111.name} (chain ${eip155_11155111.chainId})`
