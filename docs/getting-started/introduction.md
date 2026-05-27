---
title: Introduction
section: Getting Started
section_order: 1
order: 1
---

# Introduction

Ethernauta is a TypeScript monorepo that ships two things:

1. **A library of primitives** for talking to Ethereum — RPC method bindings, transaction codecs, ABI encode/decode, EIP and ERC implementations, ENS resolution, React hooks. Every primitive is a small composable function. No hosted infrastructure, no hidden state, no opinionated client object.
2. **A Chrome MV3 wallet extension** that holds an encrypted mnemonic in IndexedDB and serves dapps via the standard EIP-1193 protocol. The wallet implements the standards on top of the same primitives the library exposes.

The library is what most readers want. The wallet is one possible consumer of it.

## What sets it apart

**Two consumer paths, both first-class.** Every operation that needs a signature can either go through a wallet (`eth_sendTransaction` — path 1, one round trip) or be assembled from primitives by the dapp itself (`eth_signTransaction` + `eth_sendRawTransaction` — path 2, the dapp owns the broadcast). The library refuses to collapse the choice. Most libraries only expose path 1.

**Standards are folders.** Adding EIP-7702, EIP-5792, or a new ERC is a `mkdir` operation. Schemas, methods, helpers all live under `packages/eip/src/<n>/` or `packages/erc/src/<n>/`. The folder name is the standard number. No coordinated work with a hosted indexer, no server-side deploy, no wallet release coupling.

**Schemas are the types.** Every value-bearing boundary in the codebase has a Valibot schema first; the TypeScript type comes from `v.InferOutput`. The schema parses inputs at the boundary, the parsed value flows through the interior with its types inferred. No hand-rolled `type X = { … }` for wire data, no `interface`.

**No hosted services.** The library never depends on a paid RPC provider, a hosted indexer, a bundler, or a paymaster operated by us. Every feature works against public RPC endpoints plus the wallet extension plus dapp code. If a standard genuinely requires hosted infrastructure (ERC-4337 as originally written, for instance), it stays out of scope until an in-house dependency-free implementation becomes feasible.

## The packages

Each is independently versioned and tree-shakeable:

| Package | Purpose |
|---|---|
| `@ethernauta/core` | Primitive Valibot schemas: addresses, bytes, uints, hashes |
| `@ethernauta/utils` | Pure helpers: hex/bytes/number conversion, RLP, ether parsing |
| `@ethernauta/abi` | ABI codec + log decoding + code generation |
| `@ethernauta/chain` | 500+ EIP-155 chain definitions |
| `@ethernauta/eth` | Every `eth_*` JSON-RPC method binding |
| `@ethernauta/transport` | The four resolver factories + HTTP/WebSocket transports |
| `@ethernauta/transaction` | Transaction lifecycle tracking: `Trackable<T>`, `Watchable` |
| `@ethernauta/crypto` | Universal signature verification across EIP-191/712/1271/6492 |
| `@ethernauta/eip` | 17 EIPs as importable subpaths |
| `@ethernauta/erc` | 17 ERCs as importable subpaths |
| `@ethernauta/ens` | ENSIP-12, ENSIP-15, multi-call resolution |
| `@ethernauta/react` | React hooks: `useProvider`, `useProviderDetail` |
| `@ethernauta/cli` | ABI codegen + selector registry tooling |
| `@ethernauta/wallet` | The Chrome MV3 extension (private, not published) |

## Where to go next

- [Install](/getting-started/installation) — pick the packages you need.
- [First read](/getting-started/first-read) — a chain read in 10 lines.
- [First signature](/getting-started/first-signature) — sign and broadcast a transaction.
- [Concepts → Two paths](/concepts/two-paths) — the path-1 / path-2 split.
- [Concepts → The four resolver shapes](/concepts/resolver-shapes) — `Readable`, `Writable`, `Signable`, `Callable`.
