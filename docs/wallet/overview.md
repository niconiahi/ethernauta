---
title: Overview
section: Wallet
section_order: 6
order: 1
---

# The Ethernauta wallet

A Chrome MV3 extension that holds an encrypted mnemonic in IndexedDB, signs requests from dapps via the standard EIP-1193 protocol, and implements the wallet half of every standard the library exposes — EIP-1102, EIP-2255, EIP-3085, EIP-3326, EIP-5792, EIP-7702, EIP-6963, plus the signing flows (EIP-191, EIP-712).

It is **private** — not on npm, not a published package. It exists in the monorepo at `packages/wallet/` and is consumed by dapps through the 1193 protocol like any other wallet. But its **dispatch contract** is public: this section documents what RPC methods it implements, where they route, and what each confirmation view asks the user to authorize.

## Why this matters even if you don't use it

Two reasons.

**It demonstrates the library.** The wallet is built entirely on top of `@ethernauta/eth`, `@ethernauta/transport`, `@ethernauta/transaction`, `@ethernauta/eip/<n>`, `@ethernauta/crypto`. There's no wallet-internal parallel surface. Reading the wallet code is the most thorough way to see how the primitives compose.

**It defines the 1193 contract a standards-compliant wallet should expose.** When you build a dapp against the library's resolvers, the resolvers expect a wallet that routes methods the way Ethernauta does. The Ethernauta wallet is the reference; any standards-compliant wallet (MetaMask, Rabby, …) should behave equivalently.

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│ Dapp page                                                  │
│   window.ethereum (EIP-1193 envelope from inpage script)   │
└──────────────────────────┬─────────────────────────────────┘
                           │ provider.request(...)
                           ▼
┌────────────────────────────────────────────────────────────┐
│ Content script                                             │
│   window.postMessage ↔ chrome.runtime bridge               │
└──────────────────────────┬─────────────────────────────────┘
                           │ chrome.runtime.sendMessage
                           ▼
┌────────────────────────────────────────────────────────────┐
│ Service worker (background)                                │
│   packages/wallet/src/utils/dispatch.ts                    │
│     ├─ tier 1: wallet-state methods (cached)               │
│     ├─ tier 2: chain reads (forwarded to RPC)              │
│     ├─ tier 3: signables (forwarded to popup)              │
│     └─ tier 4: wallet-internal (storage reads)             │
└──────────────────────────┬─────────────────────────────────┘
                           │ chrome.runtime.openPopup() for tier 3
                           ▼
┌────────────────────────────────────────────────────────────┐
│ Popup (separate process)                                   │
│   View routing based on incoming envelope.method           │
│   Vault decryption                                         │
│   Signing (mnemonic never leaves this process)             │
└────────────────────────────────────────────────────────────┘
```

The popup is a separate process. **The mnemonic and the private key never cross a process boundary** (hard rule 10 in CLAUDE.md). Not over `postMessage`, not over `chrome.runtime`, not into any log. Signing happens inside the popup; the popup posts back only the signature or the signed bytes.

## What it implements

See [Dispatch](/wallet/dispatch) for the full per-tier method table — this overview just notes the highlights.

- **Account exposure** — EIP-1102 (`eth_requestAccounts`).
- **Permissions** — EIP-2255 (`wallet_getPermissions`, `wallet_requestPermissions`).
- **Chain management** — EIP-3085 (`wallet_addEthereumChain`), EIP-3326 (`wallet_switchEthereumChain`).
- **Transactions** — `eth_sendTransaction` (path 1), `eth_signTransaction` (path 2).
- **Signatures** — `personal_sign` (EIP-191), `eth_signTypedData_v4` (EIP-712), legacy `eth_sign` (gated).
- **Batched calls** — EIP-5792 (`wallet_sendCalls`, `wallet_getCallsStatus`).
- **Set-code transactions** — EIP-7702 (`wallet_signAuthorization`, `wallet_sendSetCodeTransaction`).
- **Multi-wallet discovery** — EIP-6963 announce-on-load.

## Each view is a contract

The popup hosts confirmation views — one per signable method. Each view's job is to **show the user exactly what they're about to authorize** and either return a signature or an error.

See [Views](/wallet/views) for one entry per view: what triggers it, what the user sees, what's returned.

## Building

```bash
git clone <repo>
pnpm install
pnpm --filter @ethernauta/wallet build
pnpm --filter @ethernauta/wallet zip   # → packages/wallet/extension.zip
```

Load the unpacked zip as a Chrome extension. The wallet starts with no mnemonic — use the `mnemonics` view to generate or import one.

## See also

- [Dispatch](/wallet/dispatch) — the four-tier router.
- [Views](/wallet/views) — every confirmation surface.
- [Vault](/wallet/vault) — how the mnemonic is encrypted and where it lives.
- [Concepts → the wallet contract](/concepts/wallet-contract).
