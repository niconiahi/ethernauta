// Module-level shared state that the vitest plugin
// (`ethernautaAnvil()`, Phase 5) writes during its per-worker
// setup file and that the rest of the package reads per-call.
// Two values live here: the endpoint URL (consumed by `test()`)
// and the mnemonic anvil was spawned with (consumed by the
// account / signer helpers in Phase 6). Keeping them in one
// module gives the setup file a single import point and avoids
// each helper having to know about subprocess lifecycle.

let endpoint: string | undefined
let mnemonic: string | undefined

// The default mnemonic anvil uses when `--mnemonic` is omitted.
// Sourced from foundry's anvil source — `crates/anvil/src/config.rs`,
// `DEFAULT_MNEMONIC` constant.
export const DEFAULT_ANVIL_MNEMONIC =
  "test test test test test test test test test test test junk"

export const NO_PLUGIN_MESSAGE =
  "[ethernauta] anvil() called without the ethernautaAnvil() vitest plugin — add it to `vitest.config.ts`."

export const NO_MNEMONIC_MESSAGE =
  "[ethernauta] account helpers called without the ethernautaAnvil() vitest plugin — add it to `vitest.config.ts`."

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

export function set_mnemonic(phrase: string): void {
  mnemonic = phrase
}

export function clear_mnemonic(): void {
  mnemonic = undefined
}

export function get_mnemonic(): string {
  if (mnemonic === undefined) {
    throw new Error(NO_MNEMONIC_MESSAGE)
  }
  return mnemonic
}
