// AnchorStateRegistryProxy addresses, keyed by the L2 chain
// id the registry serves. Status reads consult the registry
// for `disputeGameBlacklist` + `isGameRetired` to detect
// dispute games the chain has invalidated.

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import {
  type ChainId,
  encode_chain_id,
} from "@ethernauta/transport"
import { parse } from "valibot"

const OP_MAINNET = encode_chain_id({
  namespace: "eip155",
  reference: "10",
})

const OP_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155420",
})

const ANCHOR_STATE_REGISTRY_PROXIES: Record<
  ChainId,
  Address
> = {
  [OP_MAINNET]: parse(
    AddressSchema,
    "0x23B2C62946350F4246f9f9D027e071f0264FD113",
  ),
  [OP_SEPOLIA]: parse(
    AddressSchema,
    "0xa1Cec548926eb5d69aa3B7B57d371EdBdD03e64b",
  ),
}

export function require_anchor_state_registry_address(
  l2_chain_id: ChainId,
): Address {
  const address =
    ANCHOR_STATE_REGISTRY_PROXIES[l2_chain_id]
  if (!address) {
    throw new Error(
      `no AnchorStateRegistryProxy registered for L2 chain ${l2_chain_id}`,
    )
  }
  return address
}
