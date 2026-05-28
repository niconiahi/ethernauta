// Module-level shared state that the vitest plugin (`ethernautaAnvil()`,
// Phase 5) writes during `globalSetup` and that `test()` reads
// per-call. Keeping the store in this dedicated module gives the
// plugin a single import point and avoids `test()` itself having
// to know about subprocess lifecycle.

let endpoint: string | undefined

export const NO_PLUGIN_MESSAGE =
  "[ethernauta] test() called without the ethernautaAnvil() vitest plugin — add it to `vitest.config.ts`."

export function set_endpoint(url: string): void {
  endpoint = url
}

export function clear_endpoint(): void {
  endpoint = undefined
}

export function get_endpoint(): string {
  if (endpoint === undefined) {
    throw new Error(NO_PLUGIN_MESSAGE)
  }
  return endpoint
}
