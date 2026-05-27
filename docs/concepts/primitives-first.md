---
title: Primitives first
section: Concepts
section_order: 2
order: 1
---

# Primitives first

The first-class citizens of this monorepo are small composable functions: JSON-RPC method bindings (`eth_*`), encode / decode helpers (`encode_eip155_transaction_unsigned`, `decode_function_call`), hashing and normalization (`keccak256`, ENSIP normalize), Valibot schemas, and the four resolver factories. Everything larger — wallet RPC handlers, EIP implementations, ERC token bindings — is built by composing those primitives.

This page is the philosophy that the rest of the docs assume.

## Folder + done

Adding a new EIP, ERC, or algorithm is a **folder-shaped operation**:

1. Create `packages/eip/src/<n>/` (for EIPs) or `packages/erc/src/<n>/` (for ERCs).
2. Declare Valibot schemas for the wire boundaries.
3. Ship method bindings that compose existing primitives.
4. Re-export from the package's subpath.

No coordinated work with a server. No hosted indexer. No paid RPC provider. No wallet release tied to a dapp release. The folder is the whole change.

The contrast: adding a new feature in most Ethereum SDKs means cutting a new client release, updating the wallet's allowlist, and possibly standing up an off-chain service. Ethernauta refuses that coupling.

## What the wallet adds (and doesn't)

The wallet exists as a consumer of the primitives, not as a parallel universe. When the wallet implements `eth_sendTransaction`, its handler reaches for `encode_eip155_transaction_unsigned`, `sign_digest`, and `eth_sendRawTransaction` — the same primitives a dapp on path 2 calls directly. There is no wallet-private code path that bypasses them.

That's not just a code-quality choice. It's what gives the wallet's RPC handlers their auditability — anyone can read the same eight lines that the wallet runs. And it's what makes iteration cheap: when a primitive improves, the wallet handler improves automatically.

## What stays out

- **Hosted services we operate.** No proprietary indexer, bundler, paymaster, or RPC endpoint dependency.
- **Coordinated rollouts.** A new EIP must not require a wallet release plus a server deploy plus a dapp upgrade in lockstep.
- **Parallel surfaces.** When the library exposes a primitive (`eth_signTransaction` + `eth_sendRawTransaction`) and the wallet exposes a higher-level wrapper (`eth_sendTransaction`), both stay first-class. Neither hides the other.

## The shape this produces

The rest of the Concepts pages walk through what primitives-first looks like in practice:

- [The four resolver shapes](/concepts/resolver-shapes) — `Readable`, `Writable`, `Signable`, `Callable`. Three of them never touch a wallet.
- [Two paths](/concepts/two-paths) — with-wallet vs no-wallet, both first-class.
- [Schemas are the types](/concepts/schemas-are-types) — Valibot at every boundary.
- [1193 is a transport](/concepts/1193-as-transport) — the provider envelope is a four-field facade, not a policy layer.
- [Folder-shaped standards](/concepts/folder-shaped-standards) — adding EIP-7702.
- [The wallet contract](/concepts/wallet-contract) — what the wallet routes where.
