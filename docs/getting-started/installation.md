---
title: Installation
section: Getting Started
section_order: 1
order: 2
---

# Installation

Each Ethernauta package is independently versioned, tree-shakeable, and dependency-light. Install only what you need.

## The minimum useful set

```bash
pnpm add @ethernauta/core @ethernauta/transport @ethernauta/chain @ethernauta/eth
```

That gives you `Readable<T>` / `Writable<T>` resolvers, every `eth_*` method, and 500+ chain definitions. Enough to read any chain and broadcast any signed transaction.

## With wallet support

If your dapp talks to a wallet via EIP-1193:

```bash
pnpm add @ethernauta/eip
```

The `Provider` envelope, EIP-6963 discovery helpers, and every signing-related EIP live here. The dapp-side `create_provider(provider)` adapter that yields the `Signable<T>` resolver lives in `@ethernauta/transport`.

## ERC token bindings

```bash
pnpm add @ethernauta/erc
```

Ships ERC-20, ERC-721, ERC-1155 method bindings, plus 14 other ERCs (2612 permit, 4626 vaults, 2981 royalties, 5805 voting, …) as subpath exports.

## ENS

```bash
pnpm add @ethernauta/ens
```

ENSIP-12 forward/reverse resolution, ENSIP-15 name normalization, avatar parsing, text records.

## React

```bash
pnpm add @ethernauta/react
```

Hooks that wrap an EIP-1193 provider into the resolver shapes. Use alongside `@ethernauta/transport`.

## Transaction lifecycle tracking

```bash
pnpm add @ethernauta/transaction
```

`create_tracker`, `register_transaction`, `wait_for_receipt`, `watch_transaction`, plus a storage abstraction (`Store`) for persisting pending transactions across page reloads.

## Cryptographic primitives

```bash
pnpm add @ethernauta/crypto
```

Universal signature verification across EIP-191 (personal_sign), EIP-712 (typed-data), EIP-1271 (smart-contract signatures), and EIP-6492 (counterfactual). Plus BIP-32/39/44 key derivation if you need to derive accounts off-line.

## Peer requirements

- **TypeScript 5.x** — the inference patterns rely on tuple types and `satisfies`.
- **An ES2022 runtime** — modern browsers, Node 20+, Bun, Cloudflare Workers, Deno.
- **No bundler-specific tricks.** Every package ships ESM + CJS + types.

## All packages at once

```bash
pnpm add \
  @ethernauta/core @ethernauta/utils \
  @ethernauta/abi @ethernauta/chain \
  @ethernauta/eth @ethernauta/transport @ethernauta/transaction \
  @ethernauta/crypto \
  @ethernauta/eip @ethernauta/erc @ethernauta/ens \
  @ethernauta/react
```

## The wallet extension

`@ethernauta/wallet` is **not on npm**. It's the Chrome MV3 extension under `packages/wallet/` in the monorepo. Build it locally:

```bash
git clone <ethernauta-repo>
cd ethernauta
pnpm install
pnpm --filter @ethernauta/wallet zip
```

Then load `packages/wallet/extension.zip` as an unpacked extension in Chrome.
