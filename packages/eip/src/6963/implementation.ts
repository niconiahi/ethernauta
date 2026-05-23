// https://eips.ethereum.org/EIPS/eip-6963

import type { Provider } from "../1193"

export type { Provider } from "../1193"

export interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: Provider
}

export interface EIP6963AnnounceProviderEvent
  extends CustomEvent {
  type: "eip6963:announceProvider"
  detail: EIP6963ProviderDetail
}

export interface EIP6963RequestProviderEvent extends Event {
  type: "eip6963:requestProvider"
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

export type DiscoverOptions = {
  /** Window to listen on (defaults to `window`). */
  target?: EventTarget
  /** How long to wait for late-announcing wallets. */
  ms?: number
}

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
      const detail = (event as EIP6963AnnounceProviderEvent)
        .detail
      if (!detail?.info?.rdns) return
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
 */
export type Storage = {
  get(_key: string): string | null
  set(_key: string, _value: string): void
  remove(_key: string): void
}

export type RememberPickedProviderOptions = {
  storage: Storage
  key: string
  rdns: string
}

/**
 * Persist the user-picked wallet identifier (rdns) so a
 * later page load can rehydrate the matching live
 * Provider via `restore_picked_provider`. The Provider
 * object itself is never serialized — only the rdns key.
 */
export function remember_picked_provider(
  options: RememberPickedProviderOptions,
): void {
  options.storage.set(options.key, options.rdns)
}

export type ForgetPickedProviderOptions = {
  storage: Storage
  key: string
}

/**
 * Clear a previously-persisted picked-wallet selection.
 * Use on disconnect, or after `restore_picked_provider`
 * resolves to null (wallet uninstalled).
 */
export function forget_picked_provider(
  options: ForgetPickedProviderOptions,
): void {
  options.storage.remove(options.key)
}

export type RestorePickedProviderOptions = {
  storage: Storage
  key: string
  target?: EventTarget
  ms?: number
}

/**
 * Rehydrate a Provider from a previously-persisted rdns by
 * re-issuing the EIP-6963 announce request and filtering
 * by rdns. Returns `null` when either no rdns is persisted
 * or the matching wallet did not announce within `ms`
 * (uninstalled, disabled, slow to initialize).
 *
 * Pattern:
 *   read rdns → request announce → match by rdns
 *             → Provider rehydrated
 */
export async function restore_picked_provider(
  options: RestorePickedProviderOptions,
): Promise<Provider | null> {
  const rdns = options.storage.get(options.key)
  if (!rdns) return null
  const detail = await pick_provider(rdns, {
    target: options.target,
    ms: options.ms,
  })
  return detail?.provider ?? null
}
