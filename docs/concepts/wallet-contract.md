---
title: The wallet contract
section: Concepts
section_order: 2
order: 7
---

# The wallet contract

What the wallet actually does, from the dapp's POV. This page describes the **public dispatch contract** — which RPC methods the Ethernauta wallet implements, how it routes them, and what side effects each tier has.

The wallet is private (not on npm) but its dispatch contract is public: it's the protocol dapps consume.

## Four allowlist tiers

The dispatcher (`packages/wallet/src/utils/dispatch.ts`) routes every incoming 1193 request against four tier-shaped allowlists. A method outside all four returns 4200.

### Tier 1 — wallet state (cached, no RPC, no popup)

These read wallet-side state and return immediately:

- `eth_chainId` — current active chain.
- `eth_accounts` — currently exposed accounts (subject to permissions).
- `net_version` — decimal chain ID, legacy alias.
- `wallet_getPermissions` — EIP-2255 permission list.
- `wallet_getCapabilities` — EIP-5792 capability report.
- `wallet_switchEthereumChain` — EIP-3326 chain switch (mutates wallet state; no popup if user has previously authorized the chain).

### Tier 2 — chain reads (forwarded to active chain's RPC)

The wallet proxies these to the active chain's HTTP RPC. No signature, no popup, no wallet-held secrets. The wallet acts as a passthrough:

- `eth_blockNumber`, `eth_blobBaseFee`, `eth_gasPrice`, `eth_maxPriorityFeePerGas`, `eth_feeHistory`
- `eth_call`, `eth_estimateGas`
- `eth_getBalance`, `eth_getCode`, `eth_getStorageAt`, `eth_getProof`
- `eth_getTransactionByHash`, `eth_getTransactionByBlockHashAndIndex`, `eth_getTransactionByBlockNumberAndIndex`, `eth_getTransactionReceipt`, `eth_getTransactionCount`
- `eth_getBlockByNumber`, `eth_getBlockByHash`, `eth_getBlockTransactionCountByHash`, `eth_getBlockTransactionCountByNumber`
- `eth_getLogs`
- `eth_protocolVersion`, `eth_syncing`
- `net_listening`, `net_peerCount`, `web3_clientVersion`, `web3_sha3`

A dapp that only does reads can technically run against the wallet — or against a direct `create_reader(CHAINS)` — without behavior change. That's the point of path 2: the wallet is one transport, the public RPC is another.

### Tier 3 — signable (popup confirmation required)

These open the popup and wait for the user. They're the only methods that touch the mnemonic:

- `eth_requestAccounts` — EIP-1102 account access prompt.
- `wallet_requestPermissions` — EIP-2255 permission prompt.
- `eth_sendTransaction` — path-1 transaction signing + broadcast.
- `eth_signTransaction` — path-2 transaction signing (returns bytes).
- `personal_sign` — EIP-191 message signing.
- `eth_sign` — legacy generic sign (gated behind explicit user opt-in).
- `eth_signTypedData_v4` — EIP-712 typed-data signing.
- `wallet_addEthereumChain` — EIP-3085 chain addition prompt.
- `wallet_sendCalls` — EIP-5792 batch call submission.
- `wallet_sendSetCodeTransaction` — EIP-7702 delegation broadcast.

Each maps to a confirmation view in `packages/wallet/src/views/`:

| Method | View |
|---|---|
| `eth_requestAccounts` | `connect` + `select-account` |
| `eth_sendTransaction`, `eth_signTransaction` | `send` |
| `personal_sign` | `personal-sign` |
| `eth_signTypedData_v4` | `sign-typed-data` |
| `eth_sign` | `sign` (legacy, gated) |
| `wallet_addEthereumChain` | `add-chain` |
| `wallet_switchEthereumChain` | `select-chain` (only if not pre-authorized) |
| `wallet_sendCalls` | `send-calls` |
| `wallet_sendSetCodeTransaction` | `authorize-delegation` |

### Tier 4 — wallet internal (answered from extension storage)

Reads from wallet-managed local state that isn't pure chain data:

- `wallet_getCallsStatus` — EIP-5792 batch registry lookup. The wallet tracks batches it submitted; this method returns their status from local storage rather than rebuilding from chain.

## What never leaves the popup

**The mnemonic and the private key never cross a process boundary.** Not over `postMessage`, not over `chrome.runtime`, not into any log. Signing happens in the popup process; the popup posts back only the signature or the signed bytes.

This is hard rule 10 in CLAUDE.md and the reason for the four-tier split: tier 3 is the only place secrets exist, and tier 3 is confined to the popup.

## How dapps see the contract

From the dapp side, all of this is just 1193:

```ts
const result = await provider.request({ method, params });
```

The four-tier routing is the wallet's internal organization. The dapp only sees: "this method returns a value" or "this method opens a popup" or "this method is unsupported (4200)."

For a tighter dapp-facing API, the library wraps the provider in resolvers:

```ts
import { create_provider } from "@ethernauta/transport";

const provider = create_provider(eip1193);

// tier 2: chain reads via provider.reader
const block = await eth_blockNumber()(provider.reader({ chain_id: "eip155:1" }));

// tier 3: signables via provider.signer
const hash = await eth_sendTransaction({ to, value })(
  provider.signer({ chain_id: "eip155:1" }),
);
```

The resolver shapes ([Concepts → resolver shapes](/concepts/resolver-shapes)) map directly onto the tier split: `Reader` over tier 2, `Signer` over tier 3, `Writer` over public RPC (skipping the wallet entirely — see [Two paths](/concepts/two-paths)).

## Views as confirmation contracts

The wallet's confirmation views aren't UI noise — they're the contract surface for what the user is being asked to authorize. The [Wallet reference](/wallet/overview) section documents each view's inputs, outputs, and the dispatch path that opens it.
