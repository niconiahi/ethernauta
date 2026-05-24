// https://eips.ethereum.org/EIPS/eip-1193

import type {
  ReadContext,
  ResolvedReader,
  ResolvedSigner,
  SignContext,
} from "@ethernauta/transport"
import {
  create_emitter,
  type Emitter,
  type EventMap,
  type EventName,
} from "./events"
import {
  create_injected_signer,
  create_injected_transport,
} from "./inject"

export interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

export type SignableHandler = (
  args: RequestArguments,
) => Promise<unknown>

export interface Provider {
  request(args: RequestArguments): Promise<unknown>
  on<E extends EventName>(
    event: E,
    listener: (payload: EventMap[E]) => void,
  ): void
  removeListener<E extends EventName>(
    event: E,
    listener: (payload: EventMap[E]) => void,
  ): void
}

export interface ProviderInternal extends Provider {
  emit: Emitter["emit"]
}

export type CreateProviderOptions = {
  request: SignableHandler
}

// The 1193 envelope. No dispatch, no state, no policy —
// just the four-field shape EIP-1193 specifies (request,
// on, removeListener) plus an `emit` handle so the caller
// can fan events in from whichever bridge it owns.
//
// All wallet policy (method routing, state cache,
// permission shape, capability advertisement) lives
// outside this function. See packages/wallet/src/utils/
// dispatch.ts for Ethernauta's router.
export function create_envelope(
  options: CreateProviderOptions,
): ProviderInternal {
  const emitter = create_emitter()
  return {
    request: options.request,
    on: emitter.on,
    removeListener: emitter.removeListener,
    emit: emitter.emit,
  }
}

// Wrap an EIP-1193 provider (an EIP-6963 announce result,
// window.ethereum, a test mock) into a single Ethernauta
// factory exposing both reader and signer resolvers. The
// wallet picks the RPC for the active chain, so no CHAINS
// list is needed; if the wallet fails to serve a method,
// that surfaces as the wallet's error.
//
//   const provider = create_provider(eip1193)
//   eth_getBalance(addr)(provider.reader({ chain_id }))
//   eth_sendTransaction(tx)(provider.signer({ chain_id }))
export type ProviderResolver = {
  reader: (context: ReadContext) => ResolvedReader
  signer: (context: SignContext) => ResolvedSigner
}

export function create_provider(
  provider: Provider,
): ProviderResolver {
  const http = create_injected_transport(provider)
  const signer_factory = create_injected_signer(provider)
  return {
    reader: (context: ReadContext): ResolvedReader => {
      return [[http], context]
    },
    signer: signer_factory,
  }
}
