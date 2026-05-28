// https://eips.ethereum.org/EIPS/eip-1193

import {
  custom,
  type InferOutput,
  object,
  optional,
  string,
} from "valibot"

import {
  create_emitter,
  type EventMap,
  type EventName,
} from "./events"

export const RequestArgumentsSchema = object({
  method: string(),
  params: optional(
    custom<readonly unknown[] | object>(
      (value) =>
        typeof value === "object" && value !== null,
    ),
  ),
})
export type RequestArguments = InferOutput<
  typeof RequestArgumentsSchema
>

export type SignableHandler = (
  args: RequestArguments,
) => Promise<unknown>

// Generic methods (`on<E>`) cannot be expressed via a Valibot
// schema. Provider is a DI contract; validation happens at the
// request boundary inside whichever bridge creates it.
export type Provider = Readonly<{
  request: (args: RequestArguments) => Promise<unknown>
  on: <E extends EventName>(
    event: E,
    listener: (payload: EventMap[E]) => void,
  ) => void
  removeListener: <E extends EventName>(
    event: E,
    listener: (payload: EventMap[E]) => void,
  ) => void
  emit: <E extends EventName>(
    event: E,
    payload: EventMap[E],
  ) => void
}>

export const CreateProviderOptionsSchema = object({
  request: custom<SignableHandler>(
    (value) => typeof value === "function",
  ),
})
export type CreateProviderOptions = InferOutput<
  typeof CreateProviderOptionsSchema
>

// The 1193 envelope. No dispatch, no state, no policy —
// just the four-field shape EIP-1193 specifies (request,
// on, removeListener) plus an `emit` handle so the caller
// can fan events in from whichever bridge it owns.
//
// All wallet policy (method routing, state cache,
// permission shape, capability advertisement) lives
// outside this function. See packages/wallet/src/utils/
// dispatch.ts for Ethernauta's router.
export function create_provider(
  options: CreateProviderOptions,
): Provider {
  const emitter = create_emitter()
  return {
    request: options.request,
    on: emitter.on,
    removeListener: emitter.removeListener,
    emit: emitter.emit,
  }
}
