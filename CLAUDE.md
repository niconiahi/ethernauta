# CLAUDE.md

Guidance for Claude Code working on the Ethernauta monorepo. This file is a **router**, not a manual — the substantive guidance lives in the skills under `skills/<name>/SKILL.md`. Read the relevant skill before planning or writing code.

## What Ethernauta is

A pnpm workspace that ships:

1. A Chrome MV3 wallet extension (`packages/wallet/`, private) that holds an encrypted mnemonic in IndexedDB and signs requests from dapps via a `window.postMessage` ↔ `chrome.runtime` bridge.
2. A set of published packages (`@ethernauta/core`, `@ethernauta/utils`, `@ethernauta/abi`, `@ethernauta/chain`, `@ethernauta/eth`, `@ethernauta/transport`, `@ethernauta/eip`, `@ethernauta/erc`, `@ethernauta/ens`) that dapps consume to talk to the wallet and the chain.

## Routing — which skill to read

Match the task at hand against this table **before** you start planning. If a skill applies, read it first; the skill is the source of truth, this file is not.

| Task | Skill | When |
|---|---|---|
| Declare any value-bearing type (function params, return values, messages, storage, signals) | `skills/conventions/SKILL.md` | **Always.** Non-negotiable rule: Valibot schemas first, types via `v.InferOutput`. Never `interface`, never hand-rolled `type X = { ... }` |
| Need a primitive schema (address, bytes-N, hash32, uintN, …) | `skills/core/SKILL.md` | Before declaring any new schema. Most likely it already exists in `@ethernauta/core` |
| Add or modify an EIP | `skills/eip/SKILL.md` | Adding a new `packages/eip/src/<n>/` folder, or changing one of `191`, `712`, `1102`, `1193`, `1271`, `2255`, `3085`, `3326`, `4337`, `4361`, `5792`, `6492`, `6963`, `7702` |
| Add or modify an ERC | `skills/erc/SKILL.md` | Adding a new `packages/erc/src/<n>/` folder, generating method bindings, wiring an extension, regenerating the selector registry |
| Touch the wallet extension | `skills/wallet/SKILL.md` | Anything under `packages/wallet/` — message envelope, view routing, vault, new RPC method handler, popup view |
| Write a helper function anywhere | `skills/utils/SKILL.md` | Decide "utils vs colocated" using the rubric. Default to colocation |
| Build a dapp consuming `@ethernauta/*` | `skills/ethernauta/SKILL.md` | Factories / resolvers / methods, chain wiring, reads, contract calls, sign + broadcast, transaction tracking, EIP-6963 discovery, error shapes |

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

## Workspace shape

```
packages/
  core/         primitive Valibot schemas (skills/core)
  utils/        pure dependency-free helpers (skills/utils)
  abi/          ABI encode/decode codecs
  chain/        500+ EIP-155 chain definitions
  eth/          eth_* JSON-RPC methods (Readable / Writable / Signable)
  transport/    Readable/Writable/Signable/Callable, resolvers, http
  eip/          EIPs as importable subpaths (skills/eip)
  erc/          ERC method bindings as importable subpaths (skills/erc)
  ens/          ENS-specific primitives (ENSIP normalize, etc.)
  wallet/       Chrome MV3 extension, PRIVATE (skills/wallet)
  cli/          codegen + registry tooling

examples/
  playground/   React Router dapp used for live testing

skills/
  conventions/  Valibot-first typing — read first, always
  core/         catalog of @ethernauta/core primitives
  utils/        catalog of @ethernauta/utils + utils-vs-colocated rubric
  eip/          guidelines for adding/modifying EIPs
  erc/          guidelines for adding/modifying ERCs
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
