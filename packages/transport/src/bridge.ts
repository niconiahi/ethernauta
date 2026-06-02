import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import {
  type ChainId,
  ChainIdSchema,
} from "./chain/chain-id"
import {
  type ChainEntry,
  create_dispatcher,
  type Reader,
  require_chain,
} from "./reader"
import type { ResolvedSigner, Signer } from "./signer"

export const BridgeInputSchema = object({
  l1: ChainIdSchema,
  l2: ChainIdSchema,
})
export type BridgeInput = InferOutput<
  typeof BridgeInputSchema
>

// Function-bearing DI contract — Reader is a function
// shape Valibot can't capture. The Readonly<{...}> form
// satisfies R4's narrow exception list. `chain_id` rides
// alongside so verbs can resolve per-chain config
// (registry lookups, etc.) the same way ResolvedReader
// carries ReadContext for chain reads.
export type ResolvedBridgeSide = Readonly<{
  chain_id: ChainId
  reader: Reader
}>

// Cross-chain shape — L1 + L2 readers in the same call
// (status, withdrawal-proof construction) plus an
// optional signer for mutation verbs. The signer rides at
// top-level (not per-side): verbs build their own
// SignContext per call, with the chain_id of whichever
// side they broadcast on. Read-only verbs ignore it.
export type ResolvedBridge = Readonly<{
  signer?: Signer
  l1: ResolvedBridgeSide
  l2: ResolvedBridgeSide
}>

export type Bridgeable<T> = (
  _resolved: ResolvedBridge,
) => Promise<T>

export function create_bridge(
  chains: ChainEntry[],
): (
  _input: BridgeInput & { signer?: ResolvedSigner },
) => ResolvedBridge {
  return ({
    signer: resolved_signer,
    ..._input
  }): ResolvedBridge => {
    const input = parse(BridgeInputSchema, _input)
    const l1 = require_chain(chains, input.l1)
    const l2 = require_chain(chains, input.l2)
    const signer = resolved_signer
      ? resolved_signer[0]
      : undefined
    return {
      signer,
      l1: {
        chain_id: input.l1,
        reader: create_dispatcher(
          l1.transports,
          l1.strategy,
        ),
      },
      l2: {
        chain_id: input.l2,
        reader: create_dispatcher(
          l2.transports,
          l2.strategy,
        ),
      },
    }
  }
}

export type Bridge = ReturnType<typeof create_bridge>
