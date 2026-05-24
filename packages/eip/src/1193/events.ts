// https://eips.ethereum.org/EIPS/eip-1193#events

import {
  array,
  custom,
  type InferOutput,
  literal,
  object,
  string,
  unknown,
} from "valibot"

import type { ProviderRpcError } from "./error"

export const providerConnectInfoSchema = object({
  chainId: string(),
})
export type ProviderConnectInfo = InferOutput<
  typeof providerConnectInfoSchema
>

export const providerMessageSchema = object({
  type: string(),
  data: unknown(),
})
export type ProviderMessage = InferOutput<
  typeof providerMessageSchema
>

export const ethSubscriptionSchema = object({
  type: literal("eth_subscription"),
  data: object({
    subscription: string(),
    result: unknown(),
  }),
})
export type EthSubscription = InferOutput<
  typeof ethSubscriptionSchema
>

export const eventMapSchema = object({
  connect: providerConnectInfoSchema,
  disconnect: custom<ProviderRpcError>(
    (value) => value instanceof Error,
  ),
  chainChanged: string(),
  accountsChanged: array(string()),
  message: providerMessageSchema,
})
export type EventMap = InferOutput<typeof eventMapSchema>

export type EventName = keyof EventMap

type Listener<E extends EventName> = (
  payload: EventMap[E],
) => void

export type AnyListener = (payload: never) => void

// Generic methods cannot be expressed as a Valibot schema (no
// per-call type relation). Kept as an intersection-shaped type
// alias — the "schema" is the dispatcher itself in create_emitter.
export type Emitter = Readonly<{
  on: <Event extends EventName>(
    event: Event,
    listener: Listener<Event>,
  ) => void
  removeListener: <E extends EventName>(
    event: E,
    listener: Listener<E>,
  ) => void
  emit: <E extends EventName>(
    event: E,
    payload: EventMap[E],
  ) => void
}>

export function create_emitter(): Emitter {
  const listeners = new Map<EventName, Set<AnyListener>>()
  return {
    on(event, listener) {
      const existing = listeners.get(event)
      if (existing) {
        existing.add(listener)
        return
      }
      listeners.set(event, new Set([listener]))
    },
    removeListener(event, listener) {
      listeners.get(event)?.delete(listener)
    },
    emit(event, payload) {
      const set = listeners.get(event)
      if (!set) return
      for (const listener of set) {
        listener(payload)
      }
    },
  }
}
