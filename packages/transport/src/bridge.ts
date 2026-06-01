import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import {
  type ChainId,
  ChainIdSchema,
} from "./chain/chain-id"
import {
  create_dispatcher,
  type Dispatcher,
} from "./dispatcher"
import {
  type ChainEntry,
  require_chain,
} from "./require-chain"
import type { Signer } from "./signer"

export const BridgeInputSchema = object({
  origin: ChainIdSchema,
  destination: ChainIdSchema,
})
export type BridgeInput = InferOutput<
  typeof BridgeInputSchema
>

// Function-bearing DI contract — Dispatcher / Signer are
// function shapes Valibot can't capture. The Readonly<{...}>
// form satisfies R4's narrow exception list. `chain_id`
// rides alongside so verbs can resolve per-chain config
// (bridge contract addresses, gas params, …) the same way
// ResolvedReader carries ReadContext for chain reads.
export type ResolvedBridgeSide = Readonly<{
  chain_id: ChainId
  reader: Dispatcher
  signer?: Signer
}>

// Function-bearing DI contract — see ResolvedBridgeSide.
export type ResolvedBridge = Readonly<{
  origin: ResolvedBridgeSide
  destination: ResolvedBridgeSide
}>

export type Bridgeable<T> = (
  _resolved: ResolvedBridge,
) => Promise<T>

export function create_bridge(chains: ChainEntry[]): (
  _input: BridgeInput & {
    signer?: (_input: { chain_id: ChainId }) => Signer
  },
) => ResolvedBridge {
  return (_input): ResolvedBridge => {
    const input = parse(BridgeInputSchema, _input)
    const origin_chain = require_chain(chains, input.origin)
    const destination_chain = require_chain(
      chains,
      input.destination,
    )
    const origin_signer = _input.signer
      ? _input.signer({ chain_id: input.origin })
      : undefined
    const destination_signer = _input.signer
      ? _input.signer({ chain_id: input.destination })
      : undefined
    return {
      origin: {
        chain_id: input.origin,
        reader: create_dispatcher(
          origin_chain.transports,
          origin_chain.strategy,
        ),
        signer: origin_signer,
      },
      destination: {
        chain_id: input.destination,
        reader: create_dispatcher(
          destination_chain.transports,
          destination_chain.strategy,
        ),
        signer: destination_signer,
      },
    }
  }
}

export type Bridge = ReturnType<typeof create_bridge>
