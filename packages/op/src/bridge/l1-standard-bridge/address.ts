// L1StandardBridgeProxy addresses, keyed by the L2 chain id
// the proxy serves. Each OP-stack L2 has its own proxy on
// its parent L1; the L2 chain id uniquely identifies it.
// Sourced from packages/op/src/deploys/eip155-<l2>.ts; kept
// inline (rather than re-imported from the deploy registry)
// so the bridge layer doesn't pull in the full superchain
// deploy graph for a one-field lookup.
//
// Slice 1 ships OP Sepolia only — mainnet pairs follow in
// slice 2 once verified per 02-phases.md.

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import {
  type ChainId,
  encode_chain_id,
} from "@ethernauta/transport"
import { parse } from "valibot"

const OP_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155420",
})

const L1_STANDARD_BRIDGE_PROXIES: Record<ChainId, Address> =
  {
    [OP_SEPOLIA]: parse(
      AddressSchema,
      "0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1",
    ),
  }

export function require_l1_standard_bridge_address(
  l2_chain_id: ChainId,
): Address {
  const address = L1_STANDARD_BRIDGE_PROXIES[l2_chain_id]
  if (!address) {
    throw new Error(
      `no L1StandardBridgeProxy registered for L2 chain ${l2_chain_id}`,
    )
  }
  return address
}
