// https://eips.ethereum.org/EIPS/eip-6963

import {
  custom,
  type InferOutput,
  instance,
  number,
  object,
  optional,
  safeParse,
  string,
} from "valibot"

import type { Provider } from "../1193"

export type { Provider } from "../1193"

export const eip6963ProviderInfoSchema = object({
  uuid: string(),
  name: string(),
  icon: string(),
  rdns: string(),
})
export type EIP6963ProviderInfo = InferOutput<
  typeof eip6963ProviderInfoSchema
>

export const eip6963ProviderDetailSchema = object({
  info: eip6963ProviderInfoSchema,
  provider: custom<Provider>(
    (value) => value != null && typeof value === "object",
  ),
})
export type EIP6963ProviderDetail = InferOutput<
  typeof eip6963ProviderDetailSchema
>

// DOM-class extensions: intersection types preserve the named
// event shape (with literal `type`) without re-declaring the
// base CustomEvent / Event surface.
export type EIP6963AnnounceProviderEvent =
  CustomEvent<EIP6963ProviderDetail> & {
    readonly type: "eip6963:announceProvider"
  }

export type EIP6963RequestProviderEvent = Event & {
  readonly type: "eip6963:requestProvider"
}

export const ANNOUNCE_EVENT =
  "eip6963:announceProvider" as const
export const REQUEST_EVENT =
  "eip6963:requestProvider" as const

export function announce(
  detail: EIP6963ProviderDetail,
): void {
  const frozen = Object.freeze({
    info: Object.freeze(detail.info),
    provider: detail.provider,
  })

  function dispatch() {
    window.dispatchEvent(
      new CustomEvent(ANNOUNCE_EVENT, { detail: frozen }),
    )
  }

  dispatch()
  window.addEventListener(REQUEST_EVENT, dispatch)
}

export const discoverOptionsSchema = object({
  target: optional(instance(EventTarget)),
  ms: optional(number()),
})
export type DiscoverOptions = InferOutput<
  typeof discoverOptionsSchema
>

/**
 * Dapp-side discovery — fires `eip6963:requestProvider`,
 * collects every wallet that responds with
 * `eip6963:announceProvider`, dedupes by rdns. Resolves
 * after `ms` (default 100) — wallets typically announce
 * synchronously, but the spec allows them to be late.
 */
export function discover_providers(
  options: DiscoverOptions = {},
): Promise<EIP6963ProviderDetail[]> {
  const target = options.target ?? window
  const ms = options.ms ?? 100
  return new Promise((resolve) => {
    const seen = new Map<string, EIP6963ProviderDetail>()
    function handler(event: Event) {
      // EIP-6963 dispatches the announce payload as a
      // CustomEvent.detail. `event` arrives typed as the DOM
      // base Event; `instanceof CustomEvent` is the
      // control-flow branch that decides whether to parse the
      // payload at all.
      if (!(event instanceof CustomEvent)) return
      const parsed = safeParse(
        eip6963ProviderDetailSchema,
        event.detail,
      )
      if (!parsed.success) return
      const detail = parsed.output
      if (seen.has(detail.info.rdns)) return
      seen.set(detail.info.rdns, detail)
    }
    target.addEventListener(ANNOUNCE_EVENT, handler)
    target.dispatchEvent(new Event(REQUEST_EVENT))
    setTimeout(() => {
      target.removeEventListener(ANNOUNCE_EVENT, handler)
      resolve(Array.from(seen.values()))
    }, ms)
  })
}

/**
 * Synchronous variant: pick the first announced provider
 * matching the given rdns, or undefined. Useful when the
 * caller has already done discovery and just wants to
 * resolve a known wallet.
 */
export async function pick_provider(
  rdns: string,
  options: DiscoverOptions = {},
): Promise<EIP6963ProviderDetail | undefined> {
  const providers = await discover_providers(options)
  return providers.find((p) => p.info.rdns === rdns)
}

/**
 * Minimal storage interface — covers the synchronous shape
 * of `window.localStorage` / `window.sessionStorage` and
 * any in-memory shim. A test, an MV3 background script
 * (via a thin wrapper), or a node process can each supply
 * their own implementation.
 *
 * Function-bearing DI contract — kept as an intersection-shaped
 * alias because Valibot cannot type per-call argument relations.
 */
export type Store = Readonly<{
  get: (_key: string) => string | null
  set: (_key: string, _value: string) => void
  remove: (_key: string) => void
}>

/**
 * Adapt a DOM-shaped storage (window.localStorage,
 * window.sessionStorage, or any object that implements the
 * standard Web Storage interface) into the Ethernauta
 * `Store` shape.
 */
export function web_storage(
  backing: globalThis.Storage,
): Store {
  return {
    get(key) {
      return backing.getItem(key)
    },
    set(key, value) {
      backing.setItem(key, value)
    },
    remove(key) {
      backing.removeItem(key)
    },
  }
}

export const setProviderDetailOptionsSchema = object({
  store: custom<Store>(
    (value) => value != null && typeof value === "object",
  ),
  key: string(),
  provider_detail: eip6963ProviderDetailSchema,
})
export type SetProviderDetailOptions = InferOutput<
  typeof setProviderDetailOptionsSchema
>

/**
 * Persist the user-picked wallet identifier so a later page
 * load can rehydrate the matching live `EIP6963ProviderDetail`
 * via `get_provider_detail`. The Provider object itself is
 * never serialized — only the rdns is written.
 */
export function set_provider_detail(
  options: SetProviderDetailOptions,
): void {
  options.store.set(
    options.key,
    options.provider_detail.info.rdns,
  )
}

export const clearProviderDetailOptionsSchema = object({
  store: custom<Store>(
    (value) => value != null && typeof value === "object",
  ),
  key: string(),
})
export type ClearProviderDetailOptions = InferOutput<
  typeof clearProviderDetailOptionsSchema
>

/**
 * Clear a previously-persisted picked-wallet selection.
 * Use on disconnect, or after `get_provider_detail`
 * resolves to null (wallet uninstalled).
 */
export function clear_provider_detail(
  options: ClearProviderDetailOptions,
): void {
  options.store.remove(options.key)
}

export const getProviderDetailOptionsSchema = object({
  store: custom<Store>(
    (value) => value != null && typeof value === "object",
  ),
  key: string(),
  target: optional(instance(EventTarget)),
  ms: optional(number()),
})
export type GetProviderDetailOptions = InferOutput<
  typeof getProviderDetailOptionsSchema
>

/**
 * Rehydrate a full `EIP6963ProviderDetail` from a
 * previously-persisted rdns by re-issuing the EIP-6963
 * announce request and filtering by rdns. Returns `null`
 * when either no rdns is persisted or the matching wallet
 * did not announce within `ms` (uninstalled, disabled, slow
 * to initialize).
 *
 * Pattern:
 *   read rdns → request announce → match by rdns
 *             → detail rehydrated
 */
export async function get_provider_detail(
  options: GetProviderDetailOptions,
): Promise<EIP6963ProviderDetail | null> {
  const rdns = options.store.get(options.key)
  if (!rdns) return null
  const provider_detail = await pick_provider(rdns, {
    target: options.target,
    ms: options.ms,
  })
  return provider_detail ?? null
}
