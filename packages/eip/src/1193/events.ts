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

export const ProviderConnectInfoSchema = object({
  chainId: string(),
})
export type ProviderConnectInfo = InferOutput<
  typeof ProviderConnectInfoSchema
>

export const ProviderMessageSchema = object({
  type: string(),
  data: unknown(),
})
export type ProviderMessage = InferOutput<
  typeof ProviderMessageSchema
>

export const EthSubscriptionSchema = object({
  type: literal("eth_subscription"),
  data: object({
    subscription: string(),
    result: unknown(),
  }),
})
export type EthSubscription = InferOutput<
  typeof EthSubscriptionSchema
>

export const EventMapSchema = object({
  connect: ProviderConnectInfoSchema,
  disconnect: custom<ProviderRpcError>(
    (value) => value instanceof Error,
  ),
  chainChanged: string(),
  accountsChanged: array(string()),
  message: ProviderMessageSchema,
})
export type EventMap = InferOutput<typeof EventMapSchema>

export type EventName = keyof EventMap

type Listener<E extends EventName> = (
  payload: EventMap[E],
) => void

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
  const buckets: { [E in EventName]: Set<Listener<E>> } = {
    connect: new Set(),
    disconnect: new Set(),
    chainChanged: new Set(),
    accountsChanged: new Set(),
    message: new Set(),
  }
  return {
    on(event, listener) {
      buckets[event].add(listener)
    },
    removeListener(event, listener) {
      buckets[event].delete(listener)
    },
    emit(event, payload) {
      for (const listener of buckets[event]) {
        listener(payload)
      }
    },
  }
}
