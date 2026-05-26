---
title: Introduction
section: Getting Started
section_order: 1
order: 1
---

# Introduction

Ethernauta is a TypeScript library for talking to Ethereum from a dapp — and a Chrome wallet extension that implements the standard wallet RPC protocols on top of those same primitives.

The library is organized around a single principle: **primitives first**. Everything you can do with a wallet, you can also do without one — by composing the same primitive functions yourself.

## What lives here

- `@ethernauta/core` — primitive Valibot schemas
- `@ethernauta/eth` — `eth_*` JSON-RPC method bindings
- `@ethernauta/transport` — resolvers (`Readable`, `Writable`, `Signable`, `Callable`)
- `@ethernauta/eip` — standard EIPs as importable subpaths
- `@ethernauta/erc` — ERC method bindings as importable subpaths

Read the next page to install.
