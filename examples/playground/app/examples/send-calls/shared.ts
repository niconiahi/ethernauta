// Inputs shared by the two dual-path variants of this
// demo so the standard / primitive panels can't drift.

import { eip155_11155111 } from "@ethernauta/chain"
import {
  addressSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import {
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { parse } from "valibot"

export const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

export const SEPOLIA_CHAIN_REF_HEX = parse(
  uintSchema,
  `0x${eip155_11155111.chainId.toString(16)}`,
)

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
  parse(
    addressSchema,
    "0x1111111111111111111111111111111111111111",
  ),
  parse(
    addressSchema,
    "0x2222222222222222222222222222222222222222",
  ),
]

export const CALLS = TARGETS.map((to) => ({
  to,
  value: parse(uintSchema, "0x0"),
  data: parse(bytesSchema, "0x"),
}))

export const NETWORK_LABEL = `${eip155_11155111.name} (chain ${eip155_11155111.chainId})`
