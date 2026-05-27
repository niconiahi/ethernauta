---
title: Two paths
section: Concepts
section_order: 2
order: 3
---

# Two paths

This is the maxim (M3 in CLAUDE.md) that the library exists to preserve:

```
ethernauta primitives → standard interface (wallet) → dapp     path 1
ethernauta primitives → dapp                                   path 2
```

Both paths ship. Both are first-class. **Collapsing either is a violation** regardless of how clean the resulting code looks.

## Path 1 — wallet does it all

The dapp calls a wallet-implemented RPC method (`eth_sendTransaction`, `personal_sign`, `wallet_sendCalls`, …). The wallet does the heavy lifting: builds the tx, fills in nonce / gas, prompts the user, signs, broadcasts, returns a hash. From the dapp's POV it's one round trip.

```ts
import { create_signer } from "@ethernauta/transport";
import { eth_send_transaction } from "@ethernauta/eth";

const signer = create_signer([eip155_1]);

const hash = await eth_send_transaction({
  to: recipient,
  value: amount,
  input: "0x",
})(signer({ chain_id: eip155_1.chain_id }));
```

What the dapp gives up: control of the broadcast endpoint, ability to inspect the signed payload before it hits the network, ability to retry with a different RPC.

What the dapp gets: simplicity. One call, one prompt, one hash.

## Path 2 — wallet signs, dapp broadcasts

The dapp asks the wallet only for the signed bytes (`eth_signTransaction`), then broadcasts them itself through a `Writable<T>` against any RPC (the chain's public endpoints, the dapp's own infrastructure, a private bundler).

```ts
import { create_signer, create_writer } from "@ethernauta/transport";
import { eth_sign_transaction, eth_send_raw_transaction } from "@ethernauta/eth";

const signer = create_signer([eip155_1]);
const writer = create_writer([eip155_1]);

const signed = await eth_sign_transaction({
  to: recipient,
  value: amount,
  input: "0x",
})(signer({ chain_id: eip155_1.chain_id }));

// inspect, log, persist `signed` here if you want

const hash = await eth_send_raw_transaction(signed)(
  writer({ chain_id: eip155_1.chain_id }),
);
```

Two round trips. The dapp now owns the broadcast — which means it can:

- Log or persist the signed bytes before they hit the network.
- Retry against a different RPC if the first one rejects.
- Forward through a private bundler or MEV-protection service.
- Re-broadcast after a chain reorg without re-prompting the user.
- Sign now and broadcast later.

## Symmetry across signatures

The same split holds for everything that signs, not just transactions:

| Path 1 (wallet does it all) | Path 2 (primitive composition) |
|---|---|
| `eth_sendTransaction` | `eth_signTransaction` + `eth_sendRawTransaction` |
| `wallet_sendCalls` | `wallet_sendCalls` (path 2 not yet exposed) |
| `personal_sign` | `personal_sign` + dapp verifies / persists |
| `eth_signTypedData_v4` | `eth_signTypedData_v4` + dapp submits to off-chain venue |
| `wallet_sendSetCodeTransaction` (EIP-7702) | `wallet_signAuthorization` + `eth_sendRawTransaction` |

Anywhere a signature is needed, there's a wallet-internal flow that hides the choreography and a primitive flow that exposes it. The library refuses to take one away.

## Why not collapse?

Most libraries (`ethers`, `viem`) only expose path 1. The wallet signs and broadcasts; the dapp gets a hash. That's a fine default and it's what most dapps want.

But "most" is not "all." The dapps that lose under path-1-only are exactly the ones with the highest stakes:

- **Bridges** — need to inspect the signed tx before broadcast, persist it across retries.
- **MEV-sensitive flows** — need to broadcast through a private endpoint.
- **Idempotency-sensitive systems** — re-broadcasting after a reorg without a new user prompt.
- **Audit-heavy systems** — must log the exact bytes the user signed, separate from what reached the chain.

Forcing those dapps onto path 1 means forcing them into workarounds (raw provider calls, parallel ethers/web3 instances, reimplementing signing). Ethernauta refuses that.

## The cost

Path 2 needs both `create_signer` and `create_writer`. That's two transport objects instead of one. It's a one-line extra setup and the library docs surface it as a deliberate choice rather than a friction point.

The trade-off the maxim forces: a slightly wider surface area for a permanently broader use case.
