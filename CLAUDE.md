# CLAUDE.md

Guidance for Claude Code working on the Ethernauta monorepo. This file is a **router**, not a manual — the substantive guidance lives in the skills under `skills/<name>/SKILL.md`. Read the relevant skill before planning or writing code.

## What Ethernauta is

A pnpm workspace that ships:

1. A set of published packages (`@ethernauta/core`, `@ethernauta/utils`, `@ethernauta/crypto`, `@ethernauta/abi`, `@ethernauta/chain`, `@ethernauta/eth`, `@ethernauta/transport`, `@ethernauta/transaction`, `@ethernauta/eip`, `@ethernauta/erc`, `@ethernauta/ens`, `@ethernauta/op`, `@ethernauta/arbitrum`, `@ethernauta/zksync`, `@ethernauta/react`) that dapps or wallets' authors consume to talk to the wallet and the chain, respectively. L2 bridge verbs (deposit / withdraw / prove / execute / claim / get_status) live per-rollup under `packages/op/src/bridge/`, `packages/arbitrum/src/bridge/`, `packages/zksync/src/bridge/` and share the `Bridgeable<T>` shape + `create_bridge` factory from `@ethernauta/transport`
2. A Chrome MV3 wallet extension (`packages/wallet/`, private) that holds an encrypted mnemonic in IndexedDB and signs requests from dapps via a `window.postMessage` ↔ `chrome.runtime` bridge

## Important information

If you are about to implement a new ERC or EIP you MUST read the

## Maxims

These are pillars. Read them before any design decision. If a proposed change conflicts with a maxim, the proposal yields — the maxim does not. They sit in front of the Hard rules below because the Hard rules enforce specifics; the Maxims set the philosophy those specifics serve.

### M1 — Primitives are first-class

The first-class citizens of this monorepo are small composable primitive functions: JSON-RPC methods (`eth_*`), encode/decode helpers (`encode_eip155_transaction_unsigned`, `decode_function_call`), hashing and normalization (`keccak256`, ENSIP normalize), Valibot schemas, and the resolver factories (`create_reader`, `create_writer`, `create_contract` — chain-config-driven, no wallet — and `create_provider(provider).signer`, the dapp-side adapter that yields a signer from any EIP-1193 source). Adding a new [EIP](./skills/eip/SKILL.md), [ERC](./skills/erc/SKILL.md), or algorithm is a folder-shaped operation: create `packages/eip/src/<n>/` or `packages/erc/src/<n>/` (or extend the un-numbered base packages for cross-cutting helpers), declare the schemas, ship the method bindings. No coordinated work with a server, a hosted indexer, or a wallet release. Folder + done.

The signing strategy that primitives default to is the **sign-with-`eth_signTransaction`-then-broadcast-with-the-writer** pattern (path 2 — see M3). Primitives never depend on a specific wallet implementation; they depend only on the JSON-RPC method protocol.

### M2 — Standard wallet protocols are built on the primitives

On top of the primitive layer the monorepo provides standard wallet protocols (the full EIP-1193 provider surface, EIP-5792 batched calls, EIP-6963 discovery, future EIP-7702 delegation). This is what makes Ethernauta interoperable: Ethernauta dapps can talk to ANY standards-compliant wallet, and the Ethernauta wallet can serve ANY standards-compliant dapp.

When the wallet implements a standard RPC method (`eth_sendTransaction`, `wallet_sendCalls`, `personal_sign`, …), the implementation is a thin facade that composes primitives plus user confirmation — **never a parallel wallet-private code path**. The `wallet_sendCalls` handler reaches for `encode_eip155_transaction_unsigned` and `eth_sendRawTransaction`, not for some wallet-internal duplicate. This is what gives the wallet's RPC handlers their auditability and what makes iteration cheap.

Anything implementing a numbered standard lives in `packages/eip/src/<n>/` or `packages/erc/src/<n>/`. The folder name is the standard number; the `index.ts` carries the spec link comment and re-exports the public surface. Primitives the implementation calls live in un-numbered packages (`@ethernauta/eth`, `@ethernauta/transport`, `@ethernauta/utils`, `@ethernauta/abi`, `@ethernauta/transaction`).

### M3 — Two consumer paths, both first-class, both must always work

```
ethernauta primitives → standard interface implementation → consumer dapp   (path 1, with wallet)
ethernauta primitives → consumer dapp                                       (path 2, no wallet required)
```

A dapp must be able to consume the library on **either path**. The four-shape resolver split exists specifically for this:

- `Readable<T>` via `create_reader(CHAINS)` — chain reads, no wallet. (The path-1 sibling `create_provider(provider).reader` routes the same shape through the wallet's selected RPC — see M5.)
- `Writable<T>` via `create_writer(CHAINS)` — broadcast pre-signed bytes, no wallet.
- `Callable<T>` via `create_contract(CHAINS)` — `eth_call` reads, no wallet.
- `Trackable<T>` / `Watchable` via `create_tracker(CHAINS, { store })` — lifecycle tracking via receipt polling, no wallet.
- `Signable<T>` via `create_provider(provider).signer` — the **only** shape that requires a wallet. `provider` is an EIP-1193 source acquired via EIP-6963 discovery; there is no chain-config-driven shortcut.

Collapsing or removing path 2 is a violation of this maxim regardless of how clean the resulting code looks. When the wallet adds a standard RPC method, the matching primitive stays available on path 2. Concretely: `eth_sendTransaction` (path 1, `Signable<Hash32>` — wallet signs and broadcasts) and `eth_signTransaction` + `eth_sendRawTransaction` (path 2, primitive composition — dapp broadcasts) BOTH exist as exported methods. The library does not force a choice between them; the dapp does, per call. Documentation should show them side-by-side wherever the choice is non-obvious.

### M4 — No paid services, no hosted infrastructure, no coordinated rollouts

The library never introduces dependencies on third-party services (hosted indexers, bundlers, paymasters, RPC providers we operate). Every feature must work entirely from public RPC endpoints + the wallet extension + dapp code. This is what makes "folder + done" possible — the moment a new EIP requires us to also stand up an off-chain service or coordinate a wallet release with a server deploy, the iteration cost ceases to be O(1) and the maxim is broken. If a standard genuinely requires hosted infrastructure (ERC-4337 as written, for example), it is out of scope until or unless an in-house, dependency-free implementation becomes feasible.

### M5 — The EIP-1193 provider is a transport facade, not a policy layer

The 1193 envelope exposes only what EIP-1193 formally defines: `request`, the event emitter, and the standard error space. Method existence, routing (chain-read vs wallet-state vs signable vs wallet-internal), state caching, and confirmation policy are wallet-side concerns and live in `packages/wallet/`. Dapps consume providers symmetrically via the primitive adapter (`create_provider(provider).reader` / `.signer`), never via a parallel API surface.

This is the symmetric dual of M2: when the wallet implements a 1193 method, the implementation is a thin facade over primitives plus user confirmation; when a dapp consumes a 1193 method, the call site is a thin facade over primitives. Both sides converge on the same `method(args)(transport)` shape, and EIP-1193 is a *protocol*, not the call shape.

Concretely:

- **Wallet side.** `create_envelope({ request })` in `@ethernauta/eip/1193` produces the four-field 1193 object (`request`, `on`, `removeListener`, `emit`) and nothing else. The router lives in `packages/wallet/src/utils/dispatch.ts` with four strict allowlists (wallet-state, chain-read, signable, wallet-internal); methods outside all four return 4200.
- **Dapp side.** `create_provider(provider)` from `@ethernauta/transport` adapts any 1193 source (an EIP-6963 announce result, `window.ethereum`, a test mock) into Ethernauta's resolver shape — `.reader({ chain_id })` for `Readable<T>` consumers, `.signer({ chain_id })` for `Signable<T>` consumers. The signer is **only** available through this adapter; there is no chain-config-driven `create_signer` exported from `@ethernauta/transport`. The reader call site is identical in form to `create_reader(CHAINS)({ chain_id })`; only the transport-construction line differs.

Playground demos surface this convergence by showing the call shape once — the transport choice (public RPC reader vs wallet-routed provider) is the dapp's decision, made per call, not a visual contrast every demo has to enact.

## Routing — which skill to read

Match the task at hand against this table **before** you start planning. If a skill applies, read it first; the skill is the source of truth, this file is not.

| Task | Skill | When |
|---|---|---|
| Write any line of TypeScript anywhere in this repo | `skills/no-violations/SKILL.md` | **Always.** No `as`, no redundant `:` annotation, no `@ts-*` / `biome-ignore` / `eslint-disable`, no per-path or per-rule exemptions in `biome.json`. Enforced by `scripts/no-escape-hatches.sh` against the committed baseline |
| Declare any value-bearing type (function params, return values, messages, storage, signals) | `skills/conventions/SKILL.md` | **Always.** Non-negotiable rule: Valibot schemas first, types via `v.InferOutput`. Never `interface`, never hand-rolled `type X = { ... }` |
| Need a primitive schema (address, bytes-N, hash32, uintN, …) | `skills/core/SKILL.md` | Before declaring any new schema. Most likely it already exists in `@ethernauta/core` |
| Add or modify an EIP | `skills/eip/SKILL.md` | Adding a new `packages/eip/src/<n>/` folder, or changing one of `191`, `712`, `1102`, `1193`, `1271`, `2255`, `3085`, `3326`, `4337`, `4361`, `5792`, `6492`, `6963`, `7702` |
| Add or modify an ERC | `skills/erc/SKILL.md` | Adding a new `packages/erc/src/<n>/` folder, generating method bindings, wiring an extension, regenerating the selector registry |
| Touch the wallet extension | `skills/wallet/SKILL.md` | Anything under `packages/wallet/` — message envelope, view routing, vault, new RPC method handler, popup view |
| Write a vitest-anvil test against the library | `skills/testing/SKILL.md` | The `ethernauta_anvil()` plugin, `anvil()`, `create_testing_provider`, account derivation, snapshot/revert isolation, or anything else under `packages/testing/` |
| Write a helper function anywhere | `skills/utils/SKILL.md` | Decide "utils vs colocated" using the rubric. Default to colocation |
| Build a dapp consuming `@ethernauta/*` | `skills/ethernauta/SKILL.md` | Factories / resolvers / methods, chain wiring, reads, contract calls, sign + broadcast, transaction tracking, EIP-6963 discovery, error shapes |
| Add or modify L2 rollup support (OP / Arbitrum / zkSync) — predeploys, precompiles, fee math, bridge verbs, RPC method bindings | `skills/ethernauta/SKILL.md` + the matching `packages/<op\|arbitrum\|zksync>/COMPARISON.md` | Anything under `packages/op/`, `packages/arbitrum/`, `packages/zksync/`. Bridge verbs live under each `src/bridge/` and resolve via `create_bridge` from `@ethernauta/transport` |

## Planning protocol

When asked to implement or change anything in this repo:

1. **Map the task to skills.** Use the table above. A task may match several — e.g. "add EIP-7702 to the wallet" matches `eip`, `wallet`, and `conventions`. Read all matched skills.
2. **Identify the boundaries.** What values cross? Parameters, return values, messages, storage, signals. Each one needs a Valibot schema (`conventions` skill).
3. **Identify the primitives.** Each boundary value decomposes into core primitives (`core` skill). Reuse `addressSchema`, `bytesSchema`, etc. — do not redeclare regexes.
4. **Pick the method shape.** If the operation needs a transport, choose `Readable<T>` / `Writable<T>` / `Signable<T>` / `Callable<T>` (`ethernauta` skill, section 1). Pure operations are plain functions.
5. **Match the folder shape.** Use the existing structure of the package you are extending — do not invent a new layout. The `eip` and `erc` skills document the canonical folder shapes.
6. **Decide where helpers go.** Apply the flowchart in `skills/utils/SKILL.md`. Default to colocation; promote to `@ethernauta/utils` only when truly universal.

## Hard rules (the project-wide invariants)

These bind regardless of task. They are surfaced here so they cannot be missed even if a skill is skipped.

1. **No `interface`, no hand-rolled `type X = { ... }` for value-bearing data.** Valibot schema first, `type X = InferOutput<typeof xSchema>` second. The schema is the type. (`conventions`)
2. **Validate at the boundary with `parse`, never `safeParse`.** Throws are the contract. The idiom is `_param` (loose, prefixed) → `parse` → `param` (validated). (`conventions`)
3. **Primitive schemas live in `@ethernauta/core`** and nowhere else. Compose them; do not redeclare regexes inside feature packages. (`core`)
4. **Curried method invocation never collapses.** `method(args)(resolver({ chain_id, ...ctx }))` — two calls, in order. (`ethernauta` skill, section 1)
5. **The wallet does the gas/nonce work.** When emitting an `eth_signTransaction` payload, set only `to`, `value`, `input`, and `_ethernauta.function` sidecar. Never set `nonce`, `gas`, `maxFeePerGas`, `maxPriorityFeePerGas`. (`erc`, `wallet`)
6. **Every wire envelope is `parse`d before use.** `EthernautaEventSchema` / `EthernautaRequestSchema` / `EthernautaResponseSchema` at the message-passing layer; method-specific schemas after dispatch. (`wallet`)
7. **Filenames kebab-case, functions snake_case, schemas lowerCamelCase+Schema, types PascalCase.** ABI-bound identifiers (`balanceOf`, `transferFrom`) preserve their ABI casing for `keccak(signature)` matching. (`erc`)
8. **Spec link at the top of every standards file.** `// https://eips.ethereum.org/EIPS/eip-<n>` for EIPs, `// https://eips.ethereum.org/EIPS/eip-<n>` or the ENS doc link for ERCs. (`eip`, `erc`)
9. **No new dependencies in `@ethernauta/utils`.** It must stay pure, dependency-free, side-effect-free. (`utils`)
10. **The mnemonic and private key never leave the popup process.** Not over `postMessage`, not over `chrome.runtime`, not into a log. (`wallet`)
11. **Anything implementing a named standard (EIP-N or ERC-N) lives in `packages/eip/src/<n>/` or `packages/erc/src/<n>/`.** No exceptions. Even small helpers — if their behavior is defined by a numbered standard, they belong in the matching standard folder, not scattered into `@ethernauta/abi`, `@ethernauta/utils`, or anywhere else. The folder name is the standard number; the `index.ts` carries the spec link comment and re-exports the public surface. (`eip`, `erc`)
12. **No `as` type assertion, no redundant `:` annotation, no `@ts-*` / `biome-ignore` / `eslint-disable` ignore comments, no per-path or per-rule exemptions in `biome.json`, and no `any` / `never` / `unknown` unless the value's type provably cannot be expressed strictly.** Boundaries validate with Valibot `parse`; interiors infer. At every `parse(...)` call, use the narrowest available primitive in `@ethernauta/core` — if the right primitive is missing, add it instead of widening. Before reaching for `any` / `never` / `unknown`, try the strict generic form (`<T extends ...>` plus a mapped tuple type when the relationship is per-position) — escape hatches are last resort, not first. Enforced by `scripts/no-escape-hatches.sh` against `scripts/no-escape-hatches.baseline.json`. **Phase 10 (2026-05-25) locks ten counters at hard zero** (`as`, `ts-ignore`, `biome-ignore` line, `biome-ignore-all`, `interface`, `object_type`, `eslint-disable`, `any`, `invariant_calls`, `redundant_annotations`); `never` and `unknown` stay on no-increase semantics. A narrow allow-list of documented R1 / R4 exceptions (recursive Valibot anchors, declaration merging on built-in globals, the irreducible mapped-tuple boundary in `decode_function_result`) is tagged with `// allow-violation: <tag>` on the line above and stripped before counting — full mechanism in `skills/no-violations/SKILL.md`. History: `tmp/plans/no-casts-no-annotations/`. (`no-violations`)

## Workspace shape

```
packages/
  core/         primitive Valibot schemas (skills/core)
  utils/        pure dependency-free helpers (skills/utils)
  crypto/       cross-spec signature / SIWE verification + HD key derivation
  abi/          ABI encode/decode codecs
  chain/        500+ EIP-155 chain definitions
  eth/          eth_* JSON-RPC methods (Readable / Writable / Signable) + 1559 fee math + buffer-gas-limit
  transport/    Readable/Writable/Signable/Callable/Bridgeable, resolvers, http, create_bridge, create_provider adapter
  eip/          EIPs as importable subpaths (skills/eip)
  erc/          ERC method bindings as importable subpaths (skills/erc)
  ens/          ENS-specific primitives (ENSIP normalize, etc.)
  transaction/  lifecycle tracker (pending → mined / reverted)
  op/           OP-Stack: predeploys, fees (estimate_op_fees), op-node rpc, per-chain L1 deploys, bridge verbs
  arbitrum/     Arbitrum: 16 precompiles, fees (estimate_arbitrum_fees), arb_* rpc, orbit chains, bridge verbs, timeboost
  zksync/       zkSync Era: system contracts, zks_* rpc, 0x71 (EIP-712) tx encoder + signer, L1 deploys, bridge verbs
  testing/      vitest plugin + anvil spawner (skills/testing)
  wallet/       Chrome MV3 extension, PRIVATE (skills/wallet)
  cli/          codegen (walker mode) + registry tooling
  react/        React hooks (useProvider, useProviderDetail)

  (Solidity sources are colocated inside each package's `src/` — there is no top-level `contracts/` directory.)

apps/
  playground/   React Router dapp used for live testing
  docs/         SvelteKit docs site (reads markdown from ../../docs/content)

docs/
  content/      markdown source for the docs site

skills/
  conventions/  Valibot-first typing — read first, always
  no-violations/no-`as` / no-redundant-annotation / no-escape-hatches baseline
  core/         catalog of @ethernauta/core primitives
  utils/        catalog of @ethernauta/utils + utils-vs-colocated rubric
  eip/          guidelines for adding/modifying EIPs
  erc/          guidelines for adding/modifying ERCs
  testing/      vitest plugin + anvil lifecycle for dapp tests
  wallet/       wallet architecture and how to extend it
  ethernauta/   dapp-consumer guide (factories, resolvers, methods)
```

## Common commands

```bash
pnpm dev                            # wallet extension + playground watch builds
pnpm test                           # vitest across packages
pnpm build                          # build all packages in dependency order
biome check                         # lint
biome format --write .              # format

pnpm --filter @ethernauta/erc generate   # regenerate the ERC selector registry
pnpm --filter @ethernauta/wallet zip     # produce extension.zip
```

Per-package: `pnpm --filter @ethernauta/<pkg> {dev|build|test:unit|lint}`.

## Tooling notes

- **TypeScript 5.8.3**, JSX transform `react-jsx` for Preact, path aliases for `@ethernauta/*`.
- **Vite 7** for the wallet extension; **tsdown 0.13** for published packages.
- **Biome 2.1** is the linter and formatter. Style: 60-col, snake_case functions, semicolons as needed, 2-space indent.
- **Vitest 3** with the edge-runtime environment. `fake-indexeddb` for vault tests.
- **pnpm** workspace. Internal packages reference each other via `workspace:*`.

## Where to start, by task type

- **Bug in the wallet UI** → `skills/wallet/SKILL.md`, then the relevant view under `packages/wallet/src/views/`.
- **A dapp can't sign something** → `skills/wallet/SKILL.md` (envelope + lifecycle) and `skills/ethernauta/SKILL.md` (consumer side).
- **Adding a new ERC token method** → `skills/erc/SKILL.md`, then mimic `packages/erc/src/20/methods/transfer.ts` or `balance-of.ts`.
- **Adding an EIP** → `skills/eip/SKILL.md`, then mimic `packages/eip/src/1271/` (full standard) or `packages/eip/src/1102/` (single-method).
- **A schema seems to be missing** → `skills/core/SKILL.md` to check the catalog; if truly missing and reused, add to `@ethernauta/core` following the canonical shape.
- **About to write a helper** → `skills/utils/SKILL.md` decision flowchart. Default to colocation.
- **About to write `interface` or `type X = { ... }`** → stop, read `skills/conventions/SKILL.md`, write a Valibot schema instead.
