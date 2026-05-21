// https://docs.ens.domains/learn/deployments

import type { Address } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"
import type { ChainId } from "@ethernauta/transport"
import { parse } from "valibot"

// ENS Registry with Fallback, deployed at the same
// address on mainnet, Sepolia, Goerli, and Holesky via
// deterministic deployment.
export const ENS_REGISTRY = parse(
  addressSchema,
  "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
)

const REGISTRY_BY_CHAIN: Record<string, Address> = {
  "eip155:1": ENS_REGISTRY,
  "eip155:11155111": ENS_REGISTRY,
  "eip155:17000": ENS_REGISTRY,
}

export function get_registry_address(
  _chain_id: ChainId,
  _override?: Address,
): Address {
  if (_override) return parse(addressSchema, _override)
  const registry = REGISTRY_BY_CHAIN[_chain_id]
  if (!registry) {
    throw new Error(
      `no ENS registry known for chain ${_chain_id}`,
    )
  }
  return registry
}

export const ZERO_ADDRESS = parse(
  addressSchema,
  "0x0000000000000000000000000000000000000000",
)
