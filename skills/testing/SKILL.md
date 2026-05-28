---
name: testing
description: How @ethernauta/testing works — the vitest plugin's lifecycle ownership model, the three subpaths, the seam where consumers compose with create_provider, and the boundary against the (separate) simulation product. Read this before extending the testing utility or shipping a Jest/Mocha adapter.
---

# `@ethernauta/testing`

A vitest-first testing utility that gives `@ethernauta/*`
consumers a local EVM with snapshot/revert isolation and zero
boilerplate. One plugin line in `vitest.config.ts`, one
`anvil()` import in the test file, and the consumer's existing
`create_reader` / `create_provider` composition runs against a
freshly spawned anvil — pre-funded accounts, per-test
isolation, optional fork mode — with anvil's lifecycle fully
owned by the plugin.

## The three subpaths

Decided in `01-scope.md`. The package's `package.json` exports
exactly these:

| Subpath | Exports | Imported from |
|---|---|---|
| `@ethernauta/testing` | `anvil()`, `anvil_account`, `anvil_accounts`, `create_testing_provider`, `without_isolation`, `TestConfigSchema`, `ForkConfigSchema` | Test files |
| `@ethernauta/testing/vitest` | `ethernauta_anvil()` plugin | `vitest.config.ts` only |
| `@ethernauta/testing/anvil` | Anvil RPC method bindings (`evm_snapshot`, `evm_revert`, `evm_mine`, `evm_increaseTime`, `anvil_impersonateAccount`, `anvil_setBalance`, `anvil_setStorageAt`, `anvil_setCode`, `anvil_dumpState`, `anvil_loadState`) | Tests that drive anvil state directly |

The split between `/` and `/vitest` is intentional: importing
the plugin subpath pulls in nothing from `vitest` itself
(otherwise vitest's "no vitest inside config" guard trips). Any
hook that *uses* vitest (`without_isolation` calls
`beforeAll`/`afterAll`) lives at the root subpath, alongside
`anvil()`.

## Lifecycle ownership — ours, not the user's

The plugin owns:

- **Spawn.** `dist/vitest/setup.js` runs once per vitest
  worker. It picks a free port (`pick_free_port` in
  `src/spawner/`), spawns `anvil --port <N> [...]` as a child
  process, and `set_endpoint`s the resulting URL into the
  worker-scoped `endpoint-store` module state.
- **Readiness.** `await_ready` polls `eth_blockNumber` until
  anvil responds (10 s default timeout). On timeout it kills
  the subprocess and throws with the captured stderr.
- **Isolation.** `beforeEach` / `afterEach` registered in
  `setup.ts` take `evm_snapshot` before each test and
  `evm_revert` after, unless `is_isolation_disabled()`
  returns true (set by `without_isolation()` inside a
  `describe` block, restored on `afterAll`).
- **Teardown.** `register_cleanup(handle)` adds the spawn
  handle to a process-level cleanup list; `SIGINT` /
  `SIGTERM` / `exit` fire `handle.kill()` exactly once per
  handle.

The consumer never types `spawn`, `kill`, `setup`, or
`teardown` in their test code. The contrast with viem's
pattern — where the user writes a `globalSetup.ts` themselves
— is deliberate.

## Cross-worker contract

One anvil per vitest worker. Workers don't share anvil state
(per Phase 0 OQ3 — concurrent `evm_snapshot`/`evm_revert`
across workers would clobber each other, since revert
discards all state past the snapshot, not just the calling
worker's). Implementation: `setup.ts` runs in each worker;
each worker picks its own port and spawns its own anvil.

If a user runs vitest with `fileParallelism: false`, the
plugin still works — one worker means one anvil, snapshot /
revert is single-stream.

## Plugin options → spawn args

The plugin's options schema is `TestConfigSchema` (in
`src/test/config.ts`). Every field maps 1:1 to a `build_anvil_args`
flag in `src/spawner/spawn-anvil.ts`. The first-class set
(per Phase 7 / OQ5):

| Option | Anvil flag |
|---|---|
| `chain_id: number` | `--chain-id` |
| `accounts: number` | `--accounts` |
| `mnemonic: string` | `--mnemonic` |
| `block_time: number` | `--block-time` |
| `base_fee: bigint` | `--base-fee` |
| `hardfork: string` | `--hardfork` |
| `fork.url: string` (valibot `url()` validated) | `--fork-url` |
| `fork.block_number: bigint` | `--fork-block-number` |
| `port: number` | `--port` (default: kernel-picked) |
| `extra_args: string[]` | appended verbatim |
| `isolate: boolean` (default `true`) | (plugin-only — no anvil flag) |

Adding a first-class option = one field in the schema + one
line in `build_anvil_args` + one unit test. The graduation
rule is in OQ5: any flag a second consumer asks for becomes
first-class.

## Crossing the worker boundary

Plugin runs in main vitest process. Setup file runs in each
worker. Options pass via the `ETHERNAUTA_ANVIL_OPTIONS` env
var, serialised with [devalue](https://github.com/Rich-Harris/devalue)
because `JSON.stringify` cannot represent the bigint slots
(`base_fee`, `fork.block_number`). The setup file `parse`s the
deserialised value against `TestConfigSchema` again at the
boundary.

## How `anvil()` plugs into the resolver stack

`anvil()` returns the worker's endpoint URL — a plain string,
not a Provider. The URL is the protocol primitive; a 1193
Provider is a wrapping convention. Both M3 paths accept the
URL directly:

```
http(anvil())                                  // path 2 transport
create_provider(create_testing_provider(anvil())) // path 1 resolver pair
```

`create_testing_provider(url)` is the package's only
non-trivial new code outside the spawner — it wraps `http(url)`
in a 1193 envelope via `create_provider` from
`@ethernauta/eip/1193`. From there the path-1 call shape is
identical to production's
`create_provider(window.ethereum)`. M5 in operational form.

## Account derivation

`anvil_account(index)` and `anvil_accounts(count?)` materialise
the BIP-44 derivation `m/44'/60'/0'/0/N` against the mnemonic
the plugin spawned anvil with (default
`"test test test test test test test test test test test junk"`).
The mnemonic lives in the same `endpoint-store` module the
plugin writes to.

The derivation goes through `@ethernauta/crypto`'s
`mnemonic_to_seed` → `seed_to_master_key` → `derive_private_key`
→ `private_key_to_address`. No custom crypto in the testing
package — it just composes the existing primitives.

## Boundary against the simulation plan

The transaction-simulation product (sibling plan at
`tmp/plans/transaction_simulation/`) shares **anvil lifecycle
infrastructure** with `@ethernauta/testing` and nothing else.
Concretely:

| Concern | Testing utility | Simulation |
|---|---|---|
| Consumer | A test file | A running dapp |
| Lifecycle | Per-test setup/teardown, snapshot/revert | Long-lived fork per `(chain_id, block_number)`, reused |
| Assertion | `expect(...)` | A `SimulationResult` rendered in UI |
| Cache | Irrelevant (fresh fork each test) | Central to the value |
| Plugin? | Yes (`ethernauta_anvil()`) | No (runtime API) |

The shared layer is the anvil RPC method bindings (`evm_*`,
`anvil_*`) and the spawner. v1 of the testing plan keeps that
layer inside `@ethernauta/testing`. If the simulation plan
later wants the same layer, the right move is to extract to a
shared `@ethernauta/anvil` package — that's a non-breaking
rename, the simulation plan's OQ6 tracks the decision.

## Extending — adding a Jest / Mocha / node:test adapter

The runner core (spawner + endpoint-store + isolation hooks)
is runner-agnostic. The vitest plugin is a thin layer:

- `globalSetup` analog → call `pick_free_port`, `spawn_anvil`,
  `await_ready`, `set_endpoint`, `set_mnemonic`,
  `register_cleanup`.
- `globalTeardown` analog → handled by `register_cleanup` via
  process signals; usually a no-op for the adapter.
- `beforeEach` / `afterEach` analog → snapshot / revert with
  the `is_isolation_disabled()` guard.

A Jest adapter would be a `globalSetup.ts` + `setupFilesAfterEach`
pair. A Mocha adapter would register the same hooks via
`mocha.hooks`. The `endpoint-store` module-level state model
works in any runner that gives workers their own process
identity.

## Hard rules touched

- **Rule #2 (parse at the boundary).** Every value crossing a
  boundary — anvil RPC responses, the
  `ETHERNAUTA_ANVIL_OPTIONS` env var, plugin options — is
  `parse`d against a valibot schema. No `safeParse`.
- **Rule #11 (numbered standards live in `eip/` or `erc/`).**
  Anvil isn't a numbered standard, so the bindings live here.
- **M3 (two consumer paths first-class).** `http(anvil())` and
  `create_provider(create_testing_provider(anvil()))` are both
  shipped, both tested in `m3.test.ts`.
- **M4 (no paid services, no hosted infra).** Foundry is a
  local binary the consumer installs. We don't auto-install,
  bundle, or fall back to a mock. Missing foundry = clean
  startup error.
- **M5 (1193 is a protocol, not a call shape).** The testing
  utility doesn't ship a custom signer — it ships a 1193
  Provider builder. The downstream resolver pipeline is
  transport's `create_provider`, identical to production.
