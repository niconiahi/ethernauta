// OptimismPortalProxy addresses, keyed by the L2 chain id
// the proxy serves. Each OP-stack L2 has its own portal on
// its parent L1; the L2 chain id uniquely identifies it. The
// impl behind the proxy is `OptimismPortal2` under fault
// proofs — the proxy address stays canonical.

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

const OPTIMISM_PORTAL_PROXIES: Record<ChainId, Address> = {
  [OP_MAINNET]: parse(
    AddressSchema,
    "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed",
  ),
  [OP_SEPOLIA]: parse(
    AddressSchema,
    "0x16Fc5058F25648194471939df75CF27A2fdC48BC",
  ),
}

export function require_optimism_portal_address(
  l2_chain_id: ChainId,
): Address {
  const address = OPTIMISM_PORTAL_PROXIES[l2_chain_id]
  if (!address) {
    throw new Error(
      `no OptimismPortalProxy registered for L2 chain ${l2_chain_id}`,
    )
  }
  return address
}
