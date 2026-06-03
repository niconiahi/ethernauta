import {
  type BridgeInput,
  type ChainEntry,
  create_bridge as create_bridge_transport,
  type ResolvedBridge,
  type ResolvedSigner,
} from "@ethernauta/transport"

import { with_zksync_errors } from "./errors"

// zkSync-flavored bridge factory: produces a `ResolvedBridge`
// whose `l1.reader` and `l2.reader` are pre-wrapped with
// `with_zksync_errors`. Any RPC error carrying a recognized
// zkSync bridge custom-error selector becomes a thrown
// `ZksyncBridgeFailure`; unrecognized errors pass through
// unchanged.
//
// Exported as `create_bridge` from `@ethernauta/zksync` —
// shadows the generic `create_bridge` from
// `@ethernauta/transport` by import path. Dapps that need
// both pick one and rename. Sibling factories ship in
// `@ethernauta/op` and `@ethernauta/arbitrum`, each wrapping
// the transport substrate with its own decorator.
export function create_bridge(
  chains: ChainEntry[],
): (
  _input: BridgeInput & { signer?: ResolvedSigner },
) => ResolvedBridge {
  const inner = create_bridge_transport(chains)
  return (_input): ResolvedBridge => {
    const resolved = inner(_input)
    return {
      signer: resolved.signer,
      l1: {
        chain_id: resolved.l1.chain_id,
        reader: with_zksync_errors(resolved.l1.reader),
      },
      l2: {
        chain_id: resolved.l2.chain_id,
        reader: with_zksync_errors(resolved.l2.reader),
      },
    }
  }
}
