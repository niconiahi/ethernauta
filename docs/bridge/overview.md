---
title: Bridge — overview
section: Bridge
section_order: 11
order: 1
---

# Bridges in Ethernauta

A **bridge** in Ethernauta is a method call that originates on one chain and targets state change on another. The same shape — `Bridgeable<T>` — covers every rollup we support (OP Stack, Arbitrum Nitro, zkSync Era), and every direction (L1 → L2 deposits, L2 → L1 withdrawals, L2-only recovery).

Per-rollup worked examples live alongside this page:

- [`/bridge/op`](/bridge/op) — OP Stack deposit + fault-proof withdraw round trip.
- [`/bridge/arbitrum`](/bridge/arbitrum) — Arbitrum deposit, retryable lifecycle, withdraw round trip.
- [`/bridge/zksync`](/bridge/zksync) — zkSync Era deposit, withdraw round trip, failed-deposit recovery.

For the deeper "why does this protocol exist at all" reading, see [`BRIDGE.md`](https://github.com/niconiahi/ethernauta/blob/main/BRIDGE.md) at the repo root — the author-notes walkthrough this page distills.

## The three-step mental model

Every bridge action — regardless of rollup, regardless of direction — follows the same three steps:

1. **Fetch the proof artifacts.** Origin-side reads. The exact mechanism varies: OP composes an output-root proof against a resolved dispute game; Arbitrum reads the `NodeInterface.constructOutboxProof` precompile; zkSync hits the `zks_getL2ToL1LogProof` sequencer RPC. The verb that does this is `fetch_message_proof`.
2. **Pack + sign + submit a destination-side transaction** that carries the message + proof in calldata to the destination chain's bridge or portal contract.
3. **The destination contract verifies + executes** — releases funds, delivers the message.

Steps 2 and 3 are identical in shape across all three rollup families. Only step 1 varies, and the per-rollup verb under `@ethernauta/<rollup>/bridge` hides that variance behind a uniform call site.

L1 → L2 collapses step 1 entirely. The L2 chain reads L1 directly (the sequencer derives from it), so deposits are a single signed L1 transaction with no user-side proof — see [`BRIDGE.md`](https://github.com/niconiahi/ethernauta/blob/main/BRIDGE.md) for why this asymmetry holds.

## The `Bridgeable<T>` shape

Bridge verbs ride one function shape, defined in `@ethernauta/transport`:

```ts
import type { ChainId, Reader, Signer } from "@ethernauta/transport"

export type ResolvedBridgeSide = Readonly<{
  chain_id: ChainId
  reader: Reader
}>

export type ResolvedBridge = Readonly<{
  signer?: Signer
  l1: ResolvedBridgeSide
  l2: ResolvedBridgeSide
}>

export type Bridgeable<T> = (
  _resolved: ResolvedBridge,
) => Promise<T>
```

Three things to notice:

- **`l1` / `l2`, not `origin` / `destination`.** Topology-named so registry lookups (which are always keyed by `l2.chain_id` because there's one L1 portal per L2) read the same way in every verb. Deposits sign on `l1`; start-withdraws sign on `l2`; prove + execute sign on `l1`. Names don't flip between deposit and withdraw.
- **`signer?` rides at the top level, not per-side.** Each verb signs on exactly one side. The factory unpacks a `ResolvedSigner` tuple and stores the function only; verbs build their own `SignContext` per call with the right `chain_id`.
- **`signer` is optional.** Read-only verbs (`get_status`, `fetch_message_proof`) ignore it. Mutation verbs throw a typed "`<verb>` requires a signer" error when called without one.

The shape is per-rollup-agnostic. Every verb in `@ethernauta/op/bridge`, `@ethernauta/arbitrum/bridge`, and `@ethernauta/zksync/bridge` returns a `Bridgeable<T>` so the call site is the same across rollups.

## The `create_bridge` factory

Each rollup package re-exports its own `create_bridge` that wraps the transport-level factory and decorates both sides' readers with the rollup's error decoder. Construction takes only the chain configuration; the signer is per-call:

```ts
import { http } from "@ethernauta/transport"
import { create_bridge, send_eth } from "@ethernauta/op"

const bridge = create_bridge([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
  {
    chainId: OP_SEPOLIA_CHAIN_ID,
    transports: [http("https://sepolia.optimism.io")],
  },
])

const hash = await send_eth({
  to: recipient,
  amount,
  min_gas_limit: parse(Uint32Schema, "0x30d40"),
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: OP_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

Two calls, in order: the verb returns a `Bridgeable<Hash32>`; the resolver call constructs the `ResolvedBridge`. The same `bridge` instance serves read-only and mutation calls — read verbs simply omit `signer`.

Reader-layer error wrapping means the typed-throw guarantee is independent of which verb the dapp calls. When the L1 contract reverts with a recognized custom-error selector, `with_op_errors` / `with_arbitrum_errors` / `with_zksync_errors` catches it inside the RPC response and re-throws the typed `<Rollup>BridgeFailure` — verbs themselves stay on a single one-line broadcast shape.

## Verb naming — share on action, not on ABI

Verbs are named after the action, not the contract function they call. Two rollups share a verb name only when they perform genuinely the same action.

### Shared across all three rollups

| Verb | Action |
|---|---|
| `send_eth` | Lock ETH on L1, credit ETH on L2. |
| `send_erc20` | Lock ERC-20 on L1, mint canonical L2 representation. |
| `send_message` | Execute arbitrary calldata on L2 from L1. `send_eth` and `send_erc20` are special cases. |
| `start_withdraw_eth` | Burn ETH on L2, emit the L2 → L1 log. |
| `start_withdraw_erc20` | Burn the L2 ERC-20, emit the L2 → L1 log. |
| `start_withdraw_message` | Emit an arbitrary L2 → L1 message log. |
| `fetch_message_proof` | Read both chains, return the proof bundle L1 needs to redeem the message. |
| `execute_withdraw` | The final L1 transaction that releases funds / executes the message. |
| `get_status` | Read both chains, report where the op sits in its lifecycle. |

The param shape may vary across rollups because each one's proof and message format is its own. The dapp picks the verb file from the rollup package it's targeting; there's no cross-rollup polymorphism in the verb signature.

### Per-rollup verbs

| Rollup | Verb | Action |
|---|---|---|
| OP only | `prove_withdraw` | Record the withdrawal proof on L1 against a resolved dispute game. Arbitrum + zkSync validate inline, so they don't need a separate prove step. |
| Arbitrum only | `redeem_retryable` | Manually execute a queued retryable ticket on L2 when the auto-redeem failed. |
| Arbitrum only | `cancel_retryable` | Abort a pending retryable ticket and refund the L1-locked value. |
| zkSync only | `claim_failed_deposit` | Release L1-locked funds back to the sender when the L2 side of a deposit reverted. |

Param-shape uniformity is not a goal. The shared set is a discovery — we don't pad it with no-op stubs or asymmetric semantics to force a uniform interface.

### `get_status` returns a per-rollup state union

The action — read state — is shared. The state union isn't. OP under fault proofs covers `initiated_l2`, `awaiting_game_proposal`, `game_in_progress`, `ready_to_prove`, `proof_pending_maturity`, `ready_to_finalize`, `finalized`, `game_invalidated`. Arbitrum is `initiated_l2`, `confirming`, `executable`, `executed`. zkSync is `initiated_l2`, `batch_pending`, `ready_to_finalize`, `finalized`. Dapps that want to be rollup-generic do a `switch(status.state)` per rollup; the typed union per rollup makes the switch exhaustive at compile time.

## Path-2 broadcast — the signing strategy

Every mutation verb composes the **sign-with-`eth_signTransaction`-then-broadcast-with-`eth_sendRawTransaction`** pattern. The wallet only signs; the dapp broadcasts. `eth_sendTransaction` is never used by a bridge verb.

This is path 2 from [the two-paths maxim](/concepts/two-paths): no wallet RPC method dependency beyond `eth_signTransaction`. The wallet doesn't need to know what a bridge is, doesn't maintain bridge-specific state, doesn't host a bridge UI. Every L1 contract write, every L2 burn, every prove, every finalize composes the same two-line broadcast:

```ts
const signed = await ABI_BINDING(args)([signer, sign_ctx])
return eth_sendRawTransaction([signed])([reader, read_ctx])
```

For read-only verbs, the bundle's `signer` is `undefined` and the read verbs never touch it. Those calls work entirely without a wallet.

## Hosted infrastructure — none

Per [M4 in CLAUDE.md](/concepts/primitives-first), no bridge verb depends on a paid third-party service. Proofs are constructed from public RPC + on-chain state + the rollup's own sequencer RPC (operated by the rollup, not a paid third party). No external indexers, no off-chain attestations, no API keys.

This is the constraint that makes "folder + done" possible: adding a new rollup family is shaped like `packages/<rollup>/src/bridge/` with thin spec-faithful bindings + higher-level verbs, no coordinated infrastructure rollout.

## How we compare

Each rollup package ships a `COMPARISON.md` benchmarking the verb surface against the closest equivalent in that ecosystem's official SDK:

- [`packages/op/COMPARISON.md`](https://github.com/niconiahi/ethernauta/blob/main/packages/op/COMPARISON.md) — vs `viem/op-stack` + `@eth-optimism/sdk`.
- [`packages/arbitrum/COMPARISON.md`](https://github.com/niconiahi/ethernauta/blob/main/packages/arbitrum/COMPARISON.md) — vs `@arbitrum/sdk` + `viem`.
- [`packages/zksync/COMPARISON.md`](https://github.com/niconiahi/ethernauta/blob/main/packages/zksync/COMPARISON.md) — vs `zksync-ethers` + `viem/zksync`.

Each doc covers architecture and philosophy (path-2 sign-then-broadcast vs wallet-bound `eth_sendTransaction` defaults), the verb-surface coverage table, status / lifecycle, error taxonomy, proof bundle, M4 hosted-infrastructure dependence, L2-specific recovery verbs, and bundle-size / tree-shaking. Each closes with a gap reading (what Ethernauta doesn't yet cover) and a suggested order of operations for closing those gaps.

## Maxim alignment

- **[M1 — primitives are first-class.](/concepts/primitives-first)** Bridge verbs are primitive compositions of `eth_*` reads, contract writes, and proof-construction helpers. Adding a new rollup is a folder-shaped operation under `packages/<rollup>/src/bridge/`.
- **[M2 — standards on primitives.](/concepts/primitives-first)** None of the bridge ops are EIP-numbered standards, so they live in their rollup packages per Hard Rule 11, not in `@ethernauta/eip`.
- **[M3 — two consumer paths.](/concepts/two-paths)** Path 2 (no wallet) works for every read-side verb. Path 1 (with wallet) is the only path for mutation verbs — the wallet is structural, not optional.
- **[M4 — no paid services.](/concepts/primitives-first)** Public RPC + on-chain state + the rollup's own sequencer RPC. No paid indexers, no off-chain attestations.
- **[M5 — 1193 is a transport facade.](/concepts/1193-as-transport)** `create_bridge` is cross-chain plumbing in `@ethernauta/transport` alongside `create_reader` / `create_writer` / `create_provider`. It does not extend the 1193 envelope.

## See also

- [`/bridge/op`](/bridge/op) — OP Stack worked example.
- [`/bridge/arbitrum`](/bridge/arbitrum) — Arbitrum worked example.
- [`/bridge/zksync`](/bridge/zksync) — zkSync Era worked example.
- [`/concepts/two-paths`](/concepts/two-paths) — the path-1 / path-2 distinction that determines when a bridge verb works wallet-less.
- [`/concepts/resolver-shapes`](/concepts/resolver-shapes) — `Readable<T>` / `Writable<T>` / `Signable<T>` / `Callable<T>`; `Bridgeable<T>` is the cross-chain peer.
- [`BRIDGE.md`](https://github.com/niconiahi/ethernauta/blob/main/BRIDGE.md) — the author-notes walkthrough of how every bridge protocol actually works.
