---
title: 1193 is a transport
section: Concepts
section_order: 2
order: 5
---

# 1193 is a transport, not a policy

EIP-1193 defines a four-field interface:

```ts
import type { Provider } from "@ethernauta/eip/1193";

// Provider exposes exactly four fields:
//   request(args): Promise<unknown>
//   on(event, listener): void
//   removeListener(event, listener): void
//   emit(event, payload): void
declare const provider: Provider;
void provider;
```

That's it. Method existence, routing, state caching, confirmation policy — **none of those are part of 1193**. They're wallet-side concerns. Ethernauta enforces that separation rigidly (M5 in the project maxims).

## Wallet side: a thin facade

The wallet's `create_envelope` (in `@ethernauta/eip/1193`) produces the four-field 1193 object and nothing else. The dispatcher (`packages/wallet/src/utils/dispatch.ts`) routes incoming requests against four strict allowlists:

- **Wallet-state methods** — answered from cache (`eth_chainId`, `eth_accounts`, `net_version`, `wallet_getCapabilities`, `wallet_getPermissions`, `wallet_switchEthereumChain`).
- **Chain-read methods** — forwarded to the active chain's RPC (`eth_blockNumber`, `eth_call`, `eth_getBalance`, …).
- **Signable methods** — forwarded to the popup for user confirmation (`eth_sendTransaction`, `personal_sign`, `eth_signTypedData_v4`, `wallet_sendCalls`, `wallet_sendSetCodeTransaction`, …).
- **Wallet-internal methods** — answered from extension storage (`wallet_getCallsStatus` for EIP-5792 batch tracking).

A method outside all four returns 4200 (Unsupported Method). The 1193 envelope itself doesn't know any of this — it just calls a dispatch function.

## Dapp side: the same shape

A dapp consuming a 1193 provider doesn't reach for a different API. The library adapts the provider into the same resolver shapes:

```ts
import { parse } from "valibot";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { eth_blockNumber, eth_sendTransaction } from "@ethernauta/eth";
import type { Provider } from "@ethernauta/eip/1193";
import { create_provider } from "@ethernauta/transport";

declare const injected: Provider;
const adapter = create_provider(injected);

// for reads
const block = await eth_blockNumber()(
  adapter.reader({ chain_id: "eip155:1" }),
);
void block;

// for signatures
const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(UintSchema, "0x16345785d8a0000");
const input = parse(BytesSchema, "0x");
const hash = await eth_sendTransaction([{ to, value, input }])(
  adapter.signer({ chain_id: "eip155:1" }),
);
void hash;
```

The reader call shape is identical in form to `create_reader(CHAINS)({ chain_id })`. The signer has no chain-config-driven sibling — `create_provider(provider).signer` is the only way to obtain it, and the same `signer({ chain_id })` call shape applies regardless of which 1193 source (`window.ethereum`, EIP-6963 announce, test mock) you wrapped.

## What this buys

**Wallet-portable code.** A dapp written against Ethernauta resolvers works against `window.ethereum`, any EIP-6963 announcement, a test mock, or the public chain reader for non-signing operations. The call sites don't change.

**Auditability.** When the wallet handles `wallet_sendCalls`, the implementation is a 30-line function that composes `wallet_getCapabilities`, `eth_signTransaction`, and `eth_sendRawTransaction`. There is no hidden flow.

**Standards-first interop.** The Ethernauta wallet can serve any standards-compliant dapp; an Ethernauta dapp can talk to any standards-compliant wallet. The 1193 envelope is what makes that symmetric.

## What 1193 doesn't define

Things you might expect to be in the spec but aren't:

- **Method allowlists.** Each wallet decides which methods it implements. Ethernauta enforces this with four tier-shaped allowlists; other wallets do it differently.
- **State caching.** `eth_chainId` could be a fresh RPC call every time or a cached value. The wallet picks.
- **Confirmation flow.** When `eth_sendTransaction` arrives, the wallet decides whether to open a popup, autopilot via a saved policy, or reject outright.
- **Event semantics.** `accountsChanged` fires when the user picks a different account; `chainChanged` fires on switch. But *when exactly* (before or after the related promise settles?) is implementation-defined.

All of those live in `packages/wallet/`, not in `@ethernauta/eip/1193`. The 1193 package is the protocol envelope; the wallet package is the policy.

## EIP-6963 sits on top

Discovery (which provider, when there might be many) is a separate spec — EIP-6963. The wallet announces itself; dapps listen. The four-field 1193 envelope is the same regardless of how the dapp got hold of it.

See [@ethernauta/eip/6963](/eips/6963) for the discovery surface.
