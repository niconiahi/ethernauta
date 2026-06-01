// DisputeGameFactoryProxy addresses, keyed by the L2 chain
// id the factory serves. The factory tracks every dispute
// game proposed for the L2's output roots; withdraw verbs
// pick a `disputeGameIndex` from it.

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

const DISPUTE_GAME_FACTORY_PROXIES: Record<
  ChainId,
  Address
> = {
  [OP_MAINNET]: parse(
    AddressSchema,
    "0xe5965Ab5962eDc7477C8520243A95517CD252fA9",
  ),
  [OP_SEPOLIA]: parse(
    AddressSchema,
    "0x05F9613aDB30026FFd634f38e5C4dFd30a197Fa1",
  ),
}

export function require_dispute_game_factory_address(
  l2_chain_id: ChainId,
): Address {
  const address = DISPUTE_GAME_FACTORY_PROXIES[l2_chain_id]
  if (!address) {
    throw new Error(
      `no DisputeGameFactoryProxy registered for L2 chain ${l2_chain_id}`,
    )
  }
  return address
}
