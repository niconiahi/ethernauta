// https://eips.ethereum.org/EIPS/eip-1193#events

import type { ProviderRpcError } from "./error"

export interface ProviderConnectInfo {
  readonly chainId: string
}

export interface ProviderMessage {
  readonly type: string
  readonly data: unknown
}

export interface EthSubscription extends ProviderMessage {
  readonly type: "eth_subscription"
  readonly data: {
    readonly subscription: string
    readonly result: unknown
  }
}

export type EventMap = {
  connect: ProviderConnectInfo
  disconnect: ProviderRpcError
  chainChanged: string
  accountsChanged: string[]
  message: ProviderMessage
}

export type EventName = keyof EventMap

type Listener<E extends EventName> = (
  payload: EventMap[E],
) => void

export type AnyListener = (payload: never) => void

export type Emitter = {
  on<E extends EventName>(
    event: E,
    listener: Listener<E>,
  ): void
  removeListener<E extends EventName>(
    event: E,
    listener: Listener<E>,
  ): void
  emit<E extends EventName>(
    event: E,
    payload: EventMap[E],
  ): void
}

export function create_emitter(): Emitter {
  const listeners = new Map<EventName, Set<AnyListener>>()
  return {
    on(event, listener) {
      const existing = listeners.get(event)
      if (existing) {
        existing.add(listener as AnyListener)
        return
      }
      listeners.set(
        event,
        new Set([listener as AnyListener]),
      )
    },
    removeListener(event, listener) {
      listeners.get(event)?.delete(listener as AnyListener)
    },
    emit(event, payload) {
      const set = listeners.get(event)
      if (!set) return
      for (const listener of set) {
        ;(
          listener as (payload: EventMap[typeof event]) => void
        )(payload)
      }
    },
  }
}
