# `@ethernauta/arbitrum` vs `@arbitrum/sdk` vs `viem` — Feature Comparison

Per-package companion to the repo-root `../../BRIDGE.md` (bridge
mental model) and the sibling `../op/COMPARISON.md`. Same
legend:

- ✅ first-class / built-in
- ⚠️ partial / via add-on / awkward
- ❌ not provided
- 📦 separate package (same vendor)

**Scope.** This file scores the Arbitrum rollup family only —
`@ethernauta/arbitrum/bridge` against `@arbitrum/sdk` and
viem's Arbitrum surface. Every Ethernauta verb cell below maps
1:1 to a shipped export from
`packages/arbitrum/src/bridge/index.ts` — no aspirational
entries.

The two comparators:

- **`@arbitrum/sdk`** — Offchain Labs' official TypeScript SDK
  (`@arbitrum/sdk@^4`). Centered on the `Erc20Bridger` /
  `EthBridger` / `L2ToL1Message` / `ChildToParentMessage`
  classes plus the lifecycle helpers
  (`L1ToL2MessageStatus.WaitForStatus`,
  `L2ToL1MessageStatus`). Wraps ethers v6.
- **`viem`** — viem v2's first-party Arbitrum chain definitions
  (`viem/chains` → `arbitrum`, `arbitrumNova`,
  `arbitrumSepolia`) plus generic
  `writeContract`/`readContract` against the rollup contracts.
  No dedicated Arbitrum bridge action module the way
  `viem/op-stack` ships for the OP rollup family; bridge UX is
  user-composed.

---

## 1. Architecture & Philosophy

| Dimension | Ethernauta `@ethernauta/arbitrum/bridge` | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| Call shape | ✅ Curried `verb(args)(bridge)` — same `Bridgeable<T>` shape across all 11 Arbitrum verbs | ⚠️ Class methods on `EthBridger` / `Erc20Bridger` / `L2ToL1Message` instances; per-direction class hierarchy | ⚠️ User composes `writeContract` / `readContract` against the L1/L2 contracts |
| Validation at boundaries | ✅ Valibot `parse` on every input + envelope | ⚠️ TS-only types, internal asserts | ⚠️ TS-only types |
| Sign-then-broadcast (M3 path 2) | ✅ default — verbs compose `eth_signTransaction` + `eth_sendRawTransaction` so the wallet only signs | ⚠️ possible via raw tx but the class default is wallet-broadcast | ⚠️ possible but uncommon; default is wallet-broadcast |
| Reads work with **no** wallet attached | ✅ `Bridgeable<T>` resolvers split per-side; reads run through `l1.reader` / `l2.reader` | ⚠️ wants both L1 + L2 providers; reads work without a signer | ✅ public-client subset |
| Retryable-ticket lifecycle awareness | ✅ `redeem_retryable` / `cancel_retryable` against `ArbRetryableTx` predeploy | ✅ `L1ToL2MessageReader.getAutoRedeemAttempt` + `redeem` + `cancel` | ⚠️ user composes against the precompile |
| Outbox proof construction | ✅ `fetch_message_proof` composes `ArbSys.sendMerkleTreeState` + `NodeInterface.constructOutboxProof` + `Outbox.roots` | ✅ `L2ToL1Message.getProof` via `NodeInterface` | ⚠️ user composes the same precompile reads by hand |
| Hosted-infrastructure dependence (M4) | ✅ public RPC only — no indexer, vendor service required | ✅ public RPC only | ✅ public RPC only |
| Tree-shake granularity | ✅ per-verb subpath via `@ethernauta/arbitrum/bridge` re-exports + per-contract `@ethernauta/arbitrum/bridge/<contract>` for thin bindings | ⚠️ class-based; importing `Erc20Bridger` pulls the bridger surface | ✅ named-export shaking on viem |
| Typed error taxonomy from Outbox / retryable reverts | ✅ `variant("kind", [ProofUnavailable, RetryableExpired, AlreadyExecuted])` + `ArbitrumBridgeFailure.data` | ⚠️ raw RPC error string surfaces | ⚠️ generic `ContractFunctionRevertedError` |
| Library status | ✅ active (this slice) | ✅ active, Offchain-Labs-recommended | ✅ active (generic, no Arbitrum-specific module) |

---

## 2. Arbitrum Verb Coverage

Verb names below are the Ethernauta-side intent verbs; the
comparator columns describe the equivalent surface in each
SDK's vocabulary.

### Deposit (L1 → L2)

| Verb | Ethernauta | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| `send_eth` — lock ETH on L1, credit the L1 caller's L2-aliased address | ✅ `Inbox.depositEth()` | ✅ `EthBridger.deposit` | ⚠️ `writeContract` against `Inbox.depositEth()` |
| `send_erc20` — lock token on L1, mint canonical L2 representation | ✅ `L1GatewayRouter.outboundTransfer` (with pre-call `getGateway` read) | ✅ `Erc20Bridger.deposit` (handles gateway lookup + retryable sizing) | ⚠️ user composes router + retryable params |
| `send_message` — arbitrary L1→L2 retryable ticket | ✅ `Inbox.createRetryableTicket` with the full 8-param surface | ✅ `L1ToL2MessageCreator.createRetryableTicket` | ⚠️ user composes against `Inbox` |

### Retryable-ticket recovery (L2)

| Verb | Ethernauta | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| `redeem_retryable` — manually retry a failed auto-redeem | ✅ `ArbRetryableTx.redeem` (signed on L2) | ✅ `L1ToL2MessageWriter.redeem` | ⚠️ user composes against the precompile at `0x…006E` |
| `cancel_retryable` — abandon the ticket and refund L1 callvalue | ✅ `ArbRetryableTx.cancel` (signed on L2) | ✅ `L1ToL2MessageWriter.cancel` | ⚠️ user composes against the precompile |

### Withdraw initiation (L2 → emits log)

| Verb | Ethernauta | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| `start_withdraw_eth` | ✅ `ArbSys.withdrawEth` with `msg.value = amount` | ✅ `EthBridger.withdraw` | ⚠️ user composes against the precompile |
| `start_withdraw_erc20` | ✅ `L2GatewayRouter.outboundTransfer` (4-param overload) | ✅ `Erc20Bridger.withdraw` | ⚠️ user composes against the L2 router |
| `start_withdraw_message` | ✅ `ArbSys.sendTxToL1` | ✅ `L2ToL1MessageWriter`-style emit via direct `ArbSys` call | ⚠️ user composes against the precompile |

### Withdraw redemption (L1 execute)

| Verb | Ethernauta | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| `fetch_message_proof` — `ArbSys.sendMerkleTreeState` + `NodeInterface.constructOutboxProof` + `Outbox.roots` confirmation | ✅ `Bridgeable<MessageProof>` returning `{ message, proof, sendRoot, sendCount }` | ✅ `ChildToParentMessage.getOutboxProof` returns the proof bytes32[] | ⚠️ user composes precompile reads by hand |
| `execute_withdraw` — Outbox replay (no separate prove step) | ✅ `Outbox.executeTransaction` + reader-layer typed-error decoding | ✅ `ChildToParentMessageWriter.execute` | ⚠️ user composes against the Outbox |

### Status + helpers

| Verb | Ethernauta | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| `get_status` — direction-discriminated read | ✅ `Bridgeable<ArbitrumBridgeStatus>` returning a discriminated union (see §3) | ✅ `L1ToL2MessageReader.getStatus` (deposit) + `ChildToParentMessageReader.status` (withdraw) | ❌ user composes the same reads |
| Wait helper (`waitForStatus`) | ❌ — dapps poll `get_status` themselves (M3-aligned) | ✅ `waitForStatus({ timeout, retries })` | ❌ |
| Derive L2 retryable hash from L1 receipt | ❌ deposit side stops at `in_progress_l2`; deriving the auto-redeem L2 tx hash from `InboxMessageDelivered` is a follow-up | ✅ `L1TransactionReceipt.getL1ToL2Messages` | ❌ |

---

## 3. Status / Lifecycle Comparison

| Dimension | Ethernauta `ArbitrumBridgeStatus` | `@arbitrum/sdk` `L2ToL1MessageStatus` + `L1ToL2MessageStatus` | viem (generic) |
|---|---|---|---|
| Direction discriminator | ✅ `{ direction: "deposit" \| "withdraw" }` input + state union covering both | ⚠️ split across two enums on two reader classes | ❌ none |
| Deposit-side variants | ✅ `submitted_l1` / `included_l1` / `in_progress_l2` / `succeeded_l2` / `failed_l2` | ✅ `NOT_YET_CREATED` / `CREATION_FAILED` / `FUNDS_DEPOSITED_ON_L2` / `REDEEMED` / `EXPIRED` | ❌ |
| Withdraw-side variants | ✅ `initiated_l2` / `confirming` / `executable` / `executed` | ✅ `UNCONFIRMED` / `CONFIRMED` / `EXECUTED` | ❌ |
| Exhaustive `switch` at the dapp | ✅ discriminated union — TS enforces exhaustiveness | ⚠️ TS enum on the class read | ❌ |
| Schema-validated at the boundary | ✅ `parse(ArbitrumBridgeStatusSchema, ...)` before return | ❌ TS-only | ❌ |
| Maturity-window timing helpers | ⚠️ surfaced as union variants (`confirming` / `executable`) — no separate ETA helper | ✅ `getFirstExecutableBlock` returns an estimated L1 block | ❌ |

---

## 4. Error Taxonomy

| Dimension | Ethernauta | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| Typed revert decoding from Outbox + ArbRetryableTx | ✅ `try_decode_arbitrum_bridge_failure(error)` matches `ArbRetryableTx.NoTicketWithID` + `Outbox.UnknownRoot` + `Outbox.OutboxEntryDoesntExist` + `Outbox.AlreadySpent` | ❌ raw RPC error string | ⚠️ generic `ContractFunctionRevertedError` with `data.errorName` if the ABI is in scope |
| Carrier shape | ✅ `ArbitrumBridgeFailure extends Error` with parsed variant on `.data: { kind, ... }` | ❌ raw `Error` | ⚠️ generic viem error |
| Variant union | ✅ `variant("kind", [ProofUnavailable, RetryableExpired, AlreadyExecuted])` | ❌ | ❌ |
| Fallback when selector unrecognized | ✅ plain RPC error rethrown | ✅ generic revert error | ✅ generic revert error |

---

## 5. Proof Bundle

| Dimension | Ethernauta `MessageProof` | `@arbitrum/sdk` | viem (generic) |
|---|---|---|---|
| Public Valibot schema | ✅ `WithdrawalTransactionSchema`, `MessageProofSchema` exported from `@ethernauta/arbitrum/bridge` | ❌ TS types only on the class | ❌ TS types only |
| Reconstructable from primitives | ✅ uses `@ethernauta/abi` + the vendored `NodeInterface` + `ArbSys` precompile bindings — no SDK-private codec | ✅ uses ethers + sdk-private helpers | ✅ uses viem primitives |
| Send-root confirmation policy | ✅ documented: `Outbox.roots(sendRoot)` non-zero ⇒ assertion confirmed; zero ⇒ throws (and `get_status` reports `confirming`) | ✅ wraps the same check | ⚠️ user composes |
| Outbox-proof source | ✅ `NodeInterface.constructOutboxProof(size, leaf)` via `eth_call` against the L2 precompile at `0x…00C8` | ✅ same | ✅ same |
| Tree-size source | ✅ `ArbSys.sendMerkleTreeState()` via `eth_call` against `0x…0064` | ✅ same | ✅ same |
| Position decoding from L2 receipt | ❌ dapp provides the `L2ToL1Tx` fields directly (paste-from-Arbiscan in the playground demo); a future helper will decode the receipt event | ✅ `L2TransactionReceipt.getL2ToL1Messages` | ⚠️ user decodes via `decodeEventLog` |

---

## 6. Hosted-Infrastructure Dependence (M4)

| Dependency | Ethernauta | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| Vendor-run indexer / API | ❌ none required | ❌ none required | ❌ none required |
| Required RPC endpoints | L1 public RPC + L2 public RPC | same | same |
| Optional paid services anywhere in the surface | ❌ | ❌ | ❌ |

All three honor M4 for the Arbitrum rollup family. The
differentiator is what each does on top of public RPCs —
taxonomy, validation, call shape — not what they depend on.

---

## 7. Bundle / Tree-Shaking

| Dimension | Ethernauta | `@arbitrum/sdk` | `viem` (generic) |
|---|---|---|---|
| Per-verb import | ✅ `@ethernauta/arbitrum` re-exports each verb individually | ⚠️ class import pulls the bridger surface | ✅ named-export shaking |
| Per-contract import for thin ABI bindings | ✅ `@ethernauta/arbitrum/bridge/<contract>` per `Inbox` / `Outbox` / `L1GatewayRouter` / `L2GatewayRouter` (+ precompiles `ArbSys` / `ArbRetryableTx` / `NodeInterface`) | ⚠️ ABIs wrapped inside class methods | ⚠️ user supplies ABI constants |
| Runtime dependencies | `valibot` | `ethers` v6 + tslib | viem core |
| Class-based handle | ❌ (by design — `Bridgeable<T>` per M1) | ✅ `EthBridger` / `Erc20Bridger` / `L2ToL1Message` | ❌ |

---

## 8. Where Ethernauta Wins (Arbitrum)

1. **Typed error taxonomy.** `variant("kind", [ProofUnavailable, RetryableExpired, AlreadyExecuted])` over the Outbox and ArbRetryableTx custom errors gives dapps an exhaustive `switch` at the call site. Neither `@arbitrum/sdk` nor viem surfaces an Arbitrum-specific taxonomy today — both rethrow raw RPC errors.
2. **Discriminated `ArbitrumBridgeStatus` union covering both
   directions.** One verb, one input shape, two lifecycles — exhaustive at compile time. `@arbitrum/sdk` splits the same information across two enums on two reader classes.
3. **Path-2 sign-then-broadcast as the default** for every payable verb. The wallet's only job is signing; the dapp chooses where to broadcast. `@arbitrum/sdk`'s class methods default to wallet-broadcast.
4. **Schema-validated boundaries** on every input + every returned bundle (`WithdrawalTransactionSchema`, `MessageProofSchema`, `ArbitrumBridgeStatusSchema`, `ArbitrumBridgeErrorSchema`).
5. **Send-root confirmation enforced inside `fetch_message_proof`.** The verb throws `ProofUnavailable` rather than silently returning a proof that L1 would reject — the dapp learns the difference between "no proof yet" and "transient RPC failure" without parsing strings.
6. **Per-contract subpath imports.** Thin ABI bindings for `Inbox` / `Outbox` / `L1GatewayRouter` / `L2GatewayRouter` / the precompiles are reachable at `@ethernauta/arbitrum/bridge/<contract>` for dapps that want to compose the surface themselves without pulling the verb layer.

## 9. Where `@arbitrum/sdk` Still Wins

1. **`L1TransactionReceipt.getL1ToL2Messages` + `L2TransactionReceipt.getL2ToL1Messages`.** Deriving the L1→L2 retryable hash (or the L2→L1 message fields) from a receipt is a one-call helper. Ethernauta requires the dapp to either decode the receipt event itself or paste the fields from Arbiscan — a follow-up helper will close this on both sides.
2. **`waitForStatus`.** A UX helper that blocks until the message reaches a target status. Ethernauta deliberately leaves polling to the dapp (M3-aligned: the lifecycle spans hours-to-days and a blocking helper fits awkwardly in `Bridgeable<T>`).
3. **`getFirstExecutableBlock`.** Estimates the L1 block at which a withdrawal becomes executable. Ethernauta surfaces the same information as the union state (`confirming` vs `executable`) without a numeric ETA.
4. **Custom-gateway sizing helpers.** `Erc20Bridger.deposit` accepts a `gasEstimateOptions` block that internally estimates `max_submission_cost`, `max_gas`, and `gas_price_bid`. Ethernauta's `send_erc20` takes those three as explicit caller parameters; an estimator wrapper is a follow-up.
5. **Ecosystem maturity.** `@arbitrum/sdk` is years older and embedded in dapp templates, tutorials, and dev tooling.

## 10. Where `viem` Still Wins

1. **No-bridge-module bundle cost.** A dapp that needs one bridge call can avoid an entire bridge SDK and compose viem primitives directly. Ethernauta's `@ethernauta/arbitrum/bridge/<contract>` subpath imports cover the same use case, but viem's named-export shape is the more familiar idiom.
2. **First-party chain definitions** for `arbitrum`, `arbitrumNova`, `arbitrumSepolia`. Ethernauta's chain entries cover the same set under `@ethernauta/chain/eip155-<id>`, but viem's exports are the de-facto reference inside the broader EVM ecosystem.

---

## Gap Reading

- The receipt-derivation gap (§9.1) is the largest single
  ergonomic gap for both the retryable and the withdraw flow.
  The L1→L2 retryable hash derivation also blocks
  `get_status`'s deposit-side `succeeded_l2` / `failed_l2`
  states; both follow-ups likely land in the same change.
- The wait helper gap (§9.2) is intentional under M3 — dapps
  drive their own polling cadence because the lifecycle spans
  hours-to-days and a blocking helper is the wrong abstraction
  in a per-call resolver shape.
- The custom-gateway sizing gap (§9.4) is purely additive —
  the explicit-parameter surface stays, an estimator wrapper
  layers on top when a dapp asks.
- The position-decoding gap (§5 row 6) costs the withdraw
  playground its smoothness — pasting from Arbiscan beats
  rewriting `decodeEventLog` for every demo, but a
  one-line helper that runs `decode_logs` against the L2
  receipt and returns a `WithdrawalTransaction` directly is
  the natural next slice.

## Suggested Order of Operations

1. **Ship the L1-receipt `InboxMessageDelivered` decoder.**
   Closes the deposit-side `get_status` derivation gap and the
   retryable demo's manual ticket-id paste in one change.
2. **Ship the L2-receipt `L2ToL1Tx` decoder.** Closes the
   withdraw demo's manual message paste and makes the withdraw
   flow zero-paste end-to-end.
3. **Hold the wait helper and the ETA helper** until at least
   one dapp asks. Both are minor surface additions, not
   architectural commitments.
4. **Add an `estimate_retryable` wrapper** that composes
   `NodeInterface.estimateRetryableTicket` (already vendored)
   and returns a fully-sized `send_erc20` / `send_message`
   parameter set. Closes §9.4 without changing the existing
   explicit-parameter surface.
5. **Resurvey this file when `packages/zksync/COMPARISON.md`
   lands** (slice 4c). Comparator versions drift; the rule is
   "the comparator column reflects the comparator's currently
   published version at resurvey time, not a cached
   impression."
