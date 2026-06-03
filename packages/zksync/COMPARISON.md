# `@ethernauta/zksync` vs `zksync-ethers` vs `viem/zksync` — Feature Comparison

Per-package companion to the sibling `../op/COMPARISON.md` and
`../arbitrum/COMPARISON.md`. Same legend:

- ✅ first-class / built-in
- ⚠️ partial / via add-on / awkward
- ❌ not provided
- 📦 separate package (same vendor)

**Scope.** This file scores the zkSync Era rollup family only —
`@ethernauta/zksync/bridge` against `zksync-ethers` and viem's
zkSync action surface. Every Ethernauta verb cell below maps 1:1
to a shipped export from
`packages/zksync/src/bridge/index.ts` — no aspirational entries.

The two comparators:

- **`zksync-ethers`** — Matter Labs' official TypeScript SDK
  (`zksync-ethers@^6`). Centered on the `Wallet` / `L1Signer` /
  `L2Signer` / `L1Bridge` / `L2Bridge` classes plus the
  `Provider` lifecycle helpers (`Provider.getTransferTx`,
  `Provider.estimateL1ToL2`, `Provider.getMessageProof`,
  `Provider.finalizeWithdrawalParams`). Wraps ethers v6.
- **`viem`** — viem v2's first-party zkSync chain definitions
  (`viem/chains` → `zksync`, `zksyncSepoliaTestnet`) and the
  `viem/zksync` action surface (`getL2HashFromPriorityOp`,
  `getL1Allowance`, `getL1Balance`, plus deposit-side actions
  inside the broader `@wagmi/viem-extra` ecosystem). The
  withdraw side is light at the time of writing; dapps compose
  `writeContract`/`readContract` against the L2BaseToken /
  L2AssetRouter predeploys directly.

---

## 1. Architecture & Philosophy

| Dimension | Ethernauta `@ethernauta/zksync/bridge` | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| Call shape | ✅ Curried `verb(args)(bridge)` — same `Bridgeable<T>` shape across all 10 zkSync verbs | ⚠️ Class methods on `Wallet` / `L1Bridge` / `L2Bridge` instances; per-direction class hierarchy | ⚠️ Mixed: action functions for the indexed helpers, user-composed `writeContract`/`readContract` for the asset-bridge surface |
| Validation at boundaries | ✅ Valibot `parse` on every input + envelope (`MessageProofSchema`, `FailedDepositProofSchema`, `ZksyncBridgeStatusSchema`, `ZksyncBridgeErrorSchema`) | ⚠️ TS-only types, internal asserts | ⚠️ TS-only types |
| Sign-then-broadcast (M3 path 2) | ✅ default — verbs compose `eth_signTransaction` + `eth_sendRawTransaction` so the wallet only signs | ⚠️ possible via `Wallet.signTransaction` + `Provider.broadcastTransaction` but the class default is wallet-broadcast | ⚠️ possible but uncommon; default is `walletClient.writeContract` |
| Reads work with **no** wallet attached | ✅ `Bridgeable<T>` resolvers split per-side; reads run through `l1.reader` / `l2.reader` | ⚠️ wants both L1 + L2 providers; reads work without a signer | ✅ `publicClient` subset |
| Failed-deposit recovery (zkSync-only) | ✅ `claim_failed_deposit` against `L1Nullifier.claimFailedDeposit` with typed `FailedDepositProof` | ✅ `Wallet.claimFailedDeposit` | ❌ user composes against `L1Nullifier` |
| L2→L1 log proof construction | ✅ `fetch_message_proof` composes `zks_getL2ToL1LogProof` + dapp-supplied receipt fields → `MessageProofSchema` | ✅ `Provider.getMessageProof` / `Provider.finalizeWithdrawalParams` | ⚠️ user composes `zks_getL2ToL1LogProof` by hand |
| Hosted-infrastructure dependence (M4) | ✅ public RPC only — no indexer, vendor service required | ✅ public RPC only | ✅ public RPC only |
| Tree-shake granularity | ✅ per-verb subpath via `@ethernauta/zksync` re-exports + per-contract `@ethernauta/zksync/bridge/<contract>` for thin bindings | ⚠️ class-based; importing `Wallet` pulls the bridger surface | ✅ named-export shaking on viem |
| Typed error taxonomy from L1Nullifier / Bridgehub reverts | ✅ `variant("kind", [ProofUnavailable, AlreadyExecuted])` + `ZksyncBridgeFailure.data` | ⚠️ raw RPC error string surfaces | ⚠️ generic `ContractFunctionRevertedError` |
| Library status | ✅ active (this slice) | ✅ active, Matter-Labs-recommended | ✅ active (community + viem core) |

---

## 2. zkSync Verb Coverage

Verb names below are the Ethernauta-side intent verbs; the
comparator columns describe the equivalent surface in each
SDK's vocabulary.

### Deposit (L1 → L2)

| Verb | Ethernauta | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| `send_eth` — lock ETH on L1, credit `to` on L2 | ✅ `Bridgehub.requestL2TransactionDirect` + inline `l2TransactionBaseCost` read | ✅ `Wallet.deposit({ token: ETH_ADDRESS, amount, to })` | ⚠️ user composes against Bridgehub |
| `send_erc20` — lock ERC-20 on L1 via the asset router, mint canonical L2 representation | ✅ `Bridgehub.requestL2TransactionTwoBridges` with L1AssetRouter as `secondBridgeAddress` + inline asset-router payload | ✅ `Wallet.deposit({ token, amount, to })` (handles router selection + approvals) | ⚠️ user composes against Bridgehub + L1AssetRouter |
| `send_message` — arbitrary L1→L2 priority transaction | ✅ `Bridgehub.requestL2TransactionDirect` with full `(l2_value, l2_calldata, l2_gas_limit, refund_recipient)` surface | ✅ `Wallet.requestExecute({ contractAddress, calldata, l2Value, ... })` | ⚠️ user composes against Bridgehub |

### Failed-deposit recovery (L1)

| Verb | Ethernauta | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| `claim_failed_deposit` — replay the proof of L2 failure on L1 and refund the depositor | ✅ `L1Nullifier.claimFailedDeposit` with typed `FailedDepositProof` (9 fields) | ✅ `Wallet.claimFailedDeposit(depositHash)` (assembles the proof internally) | ❌ user composes against L1Nullifier |

### Withdraw initiation (L2 → emits log)

| Verb | Ethernauta | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| `start_withdraw_eth` | ✅ `L2BaseToken.withdraw(_l1Receiver)` payable at the `0x800a` predeploy | ✅ `Wallet.withdraw({ token: ETH_ADDRESS, amount, to })` | ⚠️ user composes against L2BaseToken |
| `start_withdraw_erc20` | ✅ `L2AssetRouter.withdraw(assetId, assetData)` at the `0x10003` predeploy with inline `assetId = keccak256(abi.encode(L1_CHAIN_ID, L2_NTV, l1_token))` derivation | ✅ `Wallet.withdraw({ token, amount, to })` | ⚠️ user composes against L2AssetRouter |
| `start_withdraw_message` | ✅ `L1Messenger.sendToL1(_message)` at the `0x8008` predeploy — raw escape hatch reusing the phase-04 binding | ⚠️ available via `Provider.sendL2ToL1Message` but not first-class on `Wallet` | ⚠️ user composes against L1Messenger |

### Withdraw redemption (L1 execute)

| Verb | Ethernauta | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| `fetch_message_proof` — `zks_getL2ToL1LogProof` → `MessageProof` bundle (chainId + batch + index + tx_number + message + merkleProof) | ✅ `Bridgeable<MessageProof>` returning typed bundle | ✅ `Provider.finalizeWithdrawalParams(withdrawalHash, index)` returns the full struct | ⚠️ user composes `zks_getL2ToL1LogProof` by hand |
| `execute_withdraw` — `L1Nullifier.finalizeDeposit` replay (no separate prove step) | ✅ `Bridgeable<Hash32>` + reader-layer typed-error decoding (`AlreadyExecuted`) | ✅ `Wallet.finalizeWithdrawal(withdrawalHash, index)` | ⚠️ user composes against L1Nullifier |

### Status + helpers

| Verb | Ethernauta | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| `get_status` — direction-discriminated read | ✅ `Bridgeable<ZksyncBridgeStatus>` returning a discriminated union (see §3) | ⚠️ split across `Provider.getTransactionStatus` (deposit) + `Wallet.isWithdrawalFinalized` (withdraw) | ⚠️ ad-hoc — user assembles from `getL2HashFromPriorityOp` + custom checks |
| Wait helper (`waitForStatus`) | ❌ — dapps poll `get_status` themselves (M3-aligned) | ⚠️ `Provider.waitForFinality(txHash)` covers commit/prove/execute readiness | ❌ |
| Derive L2 canonical hash from L1 deposit receipt | ❌ deposit side stops at `in_progress_l2`; deriving the L2 hash from `Bridgehub.NewPriorityRequest` is a follow-up | ✅ `Provider.getL2HashFromPriorityOp(l1Receipt, bridgehub)` | ✅ `getL2HashFromPriorityOp` (`viem/zksync` action) |

---

## 3. Status / Lifecycle Comparison

| Dimension | Ethernauta `ZksyncBridgeStatus` | `zksync-ethers` `TransactionStatus` + `Wallet.isWithdrawalFinalized` | viem (zkSync) |
|---|---|---|---|
| Direction discriminator | ✅ `{ direction: "deposit" \| "withdraw" }` input + state union covering both | ⚠️ split across two reader surfaces | ❌ none |
| Deposit-side variants | ✅ `submitted_l1` / `included_l1` / `in_progress_l2` / `succeeded_l2` / `failed_l2` | ✅ `Processing` / `Committed` / `Finalized` / `Failed` (on the L2 tx, not the L1 priority request) | ⚠️ raw enum strings |
| Withdraw-side variants | ✅ `initiated_l2` / `batch_pending` / `ready_to_finalize` / `finalized` | ⚠️ boolean `isWithdrawalFinalized` + dapp-side waiting on `Provider.waitForFinality` | ❌ |
| Exhaustive `switch` at the dapp | ✅ discriminated union — TS enforces exhaustiveness | ⚠️ TS enum on the class read | ❌ |
| Schema-validated at the boundary | ✅ `parse(ZksyncBridgeStatusSchema, ...)` before return | ❌ TS-only | ❌ |
| Maturity-window timing helpers | ⚠️ surfaced as union variants (`batch_pending` / `ready_to_finalize`) — no separate ETA helper | ⚠️ `Provider.getL1BatchDetails` exposes the underlying batch object | ❌ |

---

## 4. Error Taxonomy

| Dimension | Ethernauta | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| Typed revert decoding from L1Nullifier + Bridgehub | ✅ `try_decode_zksync_bridge_failure(error)` matches `L1Nullifier.WithdrawalAlreadyFinalized` → `AlreadyExecuted` | ❌ raw RPC error string | ⚠️ generic `ContractFunctionRevertedError` with `data.errorName` if the ABI is in scope |
| Carrier shape | ✅ `ZksyncBridgeFailure extends Error` with parsed variant on `.data: { kind, ... }` | ❌ raw `Error` | ⚠️ generic viem error |
| Variant union | ✅ `variant("kind", [ProofUnavailable, AlreadyExecuted])` | ❌ | ❌ |
| Fallback when selector unrecognized | ✅ plain RPC error rethrown | ✅ generic revert error | ✅ generic revert error |

The selector table is intentionally narrow at slice 4c —
`L1Nullifier`'s `Unauthorized`, `EmptyDeposit`,
`MerkleProofVerificationFailed`, `MalformedMessage`, etc. are
proof-malformation / validation-style failures the dapp can't
recover from inline and surface as plain RPC errors. The
cross-rollup-consistent variant `AlreadyExecuted` is the only
typed entry — it's the same kind Arbitrum 3c maps from
`Outbox.AlreadySpent`.

---

## 5. Proof Bundle

| Dimension | Ethernauta `MessageProof` | `zksync-ethers` | viem (zkSync) |
|---|---|---|---|
| Public Valibot schema | ✅ `MessageProofSchema` + `FailedDepositProofSchema` exported from `@ethernauta/zksync` | ❌ TS types only on the class | ❌ TS types only |
| Reconstructable from primitives | ✅ uses `@ethernauta/abi` + the existing `zks_getL2ToL1LogProof` binding — no SDK-private codec | ✅ uses ethers + sdk-private helpers | ✅ uses viem primitives |
| Batch-pending detection inside the builder | ✅ documented: `zks_getL2ToL1LogProof` returning `null` ⇒ `fetch_message_proof` throws (and `get_status` reports `batch_pending` for the same condition) | ⚠️ wraps the same check inside `finalizeWithdrawalParams`; throws a class-specific error | ⚠️ user composes |
| Receipt-field extraction (`l2_to_l1_log_index`, `l2_tx_number_in_batch`, `message`) | ❌ dapp provides them from the L2 receipt (paste-from-explorer in the playground demo); a future helper will decode the receipt directly | ✅ derives all three from the withdrawal hash automatically | ⚠️ user decodes by hand |
| Naming distinction from `FailedDepositProof` | ✅ separate schema (`FailedDepositProofSchema`) for `claim_failed_deposit` — extends with `(depositSender, l1Token, amount)` | ⚠️ same class used for both | ❌ |

---

## 6. Hosted-Infrastructure Dependence (M4)

| Dependency | Ethernauta | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| Vendor-run indexer / API | ❌ none required | ❌ none required | ❌ none required |
| Required RPC endpoints | L1 public RPC + L2 public RPC (`zks_*` namespace) | same | same |
| Optional paid services anywhere in the surface | ❌ | ❌ | ❌ |

All three honor M4 for the zkSync family. The differentiator is
what each does on top of public RPCs — taxonomy, validation,
call shape — not what they depend on.

---

## 7. Bundle / Tree-Shaking

| Dimension | Ethernauta | `zksync-ethers` | `viem/zksync` |
|---|---|---|---|
| Per-verb import | ✅ `@ethernauta/zksync` re-exports each verb individually | ⚠️ class import pulls the bridger surface | ✅ named-export shaking |
| Per-contract import for thin ABI bindings | ✅ `@ethernauta/zksync/bridge/<contract>` per `Bridgehub` / `L1Nullifier` / `L1AssetRouter` / `L2BaseToken` / `L2AssetRouter` (+ phase-04 `L1Messenger` predeploy) | ⚠️ ABIs wrapped inside class methods | ⚠️ user supplies ABI constants |
| Runtime dependencies | `valibot` + `@noble/hashes` | `ethers` v6 + tslib | viem core |
| Class-based handle | ❌ (by design — `Bridgeable<T>` per M1) | ✅ `Wallet` / `L1Bridge` / `L2Bridge` / `Provider` | ❌ |

---

## 8. Where Ethernauta Wins (zkSync)

1. **Typed error taxonomy.** `variant("kind", [ProofUnavailable, AlreadyExecuted])` over the L1Nullifier + Bridgehub custom errors gives dapps an exhaustive `switch` at the call site. Neither `zksync-ethers` nor `viem/zksync` surfaces a zkSync-specific taxonomy today — both rethrow raw RPC errors.
2. **Discriminated `ZksyncBridgeStatus` union covering both
   directions.** One verb, one input shape, two lifecycles —
   exhaustive at compile time. `zksync-ethers` splits the same
   information across two surfaces (`Provider.getTransactionStatus`
   for deposits, `Wallet.isWithdrawalFinalized` for withdraws);
   viem leaves the dapp to assemble it from primitives.
3. **Path-2 sign-then-broadcast as the default** for every payable verb. The wallet's only job is signing; the dapp chooses where to broadcast. `zksync-ethers`'s `Wallet` methods default to wallet-broadcast.
4. **Schema-validated boundaries** on every input + every returned bundle (`MessageProofSchema`, `FailedDepositProofSchema`, `ZksyncBridgeStatusSchema`, `ZksyncBridgeErrorSchema`).
5. **Failed-deposit `FailedDepositProof` is shape-distinct from the withdraw `MessageProof`.** Both wrap `zks_getL2ToL1LogProof` but the failed-deposit case also carries `(depositSender, l1Token, amount)` for the L1 refund. Keeping the schemas separate lets dapps `parse` against the right shape at the dispatch boundary instead of conflating two protocols.
6. **Per-contract subpath imports.** Thin ABI bindings for `Bridgehub` / `L1Nullifier` / `L1AssetRouter` / `L2BaseToken` / `L2AssetRouter` / the L1Messenger predeploy are reachable at `@ethernauta/zksync/bridge/<contract>` and `@ethernauta/zksync/system-contracts/<contract>` for dapps that want to compose the surface themselves.
7. **Post-v26 entrypoints by default.** `execute_withdraw` targets `L1Nullifier.finalizeDeposit` (the canonical forward path); the legacy `finalizeWithdrawal` shape is intentionally not surfaced even though the binding exists.

## 9. Where `zksync-ethers` Still Wins

1. **`Provider.finalizeWithdrawalParams(withdrawalHash, index)`.** Deriving the full proof + sender + message-bytes bundle from a withdrawal hash is a one-call helper. Ethernauta requires the dapp to either decode the receipt fields itself or paste them from the explorer — a follow-up helper will close this on both the deposit and withdraw sides.
2. **`Wallet.claimFailedDeposit(depositHash)` assembles the 9-field proof internally.** Ethernauta's `claim_failed_deposit` takes the assembled `FailedDepositProof` and the playground demo walks the user through assembling it manually. A `fetch_failed_deposit_proof` helper is tracked in `03-tracking.md` as a follow-up.
3. **`Wallet.withdraw({ token })` dispatches to the right L2 predeploy automatically.** Ethernauta surfaces `start_withdraw_eth` vs `start_withdraw_erc20` as separate verbs (clearer at the call site, but the dapp picks the right one); `zksync-ethers` picks based on `token === ETH_ADDRESS`.
4. **`Provider.waitForFinality(txHash)`.** A UX helper that blocks until the L2 tx reaches L1 finalization. Ethernauta deliberately leaves polling to the dapp (M3-aligned: the lifecycle spans minutes-to-hours and a blocking helper fits awkwardly in `Bridgeable<T>`).
5. **Ecosystem maturity.** `zksync-ethers` is years older and embedded in dapp templates, Matter Labs tutorials, and the official documentation.

## 10. Where `viem/zksync` Still Wins

1. **No-bridge-module bundle cost.** A dapp that needs one bridge call can avoid an entire bridge SDK and compose viem primitives directly. Ethernauta's `@ethernauta/zksync/bridge/<contract>` subpath imports cover the same use case, but viem's named-export shape is the more familiar idiom.
2. **First-party chain definitions** for `zksync` and `zksyncSepoliaTestnet`. Ethernauta's chain entries cover the same set under `@ethernauta/chain/eip155-<id>`, but viem's exports are the de-facto reference inside the broader EVM ecosystem.
3. **`getL2HashFromPriorityOp` action.** Decoding the L1 deposit receipt's `NewPriorityRequest` event into the canonical L2 hash is a one-line viem action. Ethernauta's `get_status` deposit side floors at `in_progress_l2` until the same derivation lands as a follow-up.

---

## Gap Reading

- The receipt-derivation gap (§9.1 + §9.2 + §10.3) is the
  largest single ergonomic gap for both the deposit and withdraw
  flows. The L1→L2 canonical-hash derivation also blocks
  `get_status`'s deposit-side `succeeded_l2` / `failed_l2`
  states; both follow-ups likely land in the same change.
- The wait helper gap (§9.4) is intentional under M3 — dapps
  drive their own polling cadence because the lifecycle spans
  minutes-to-hours and a blocking helper is the wrong abstraction
  in a per-call resolver shape.
- The proof-bundle paste idiom (§5 row 4) costs the withdraw
  playground its smoothness — pasting from the explorer beats
  rewriting receipt decoding for every demo, but a one-line
  helper that runs `decode_logs` against the L2 receipt's
  L1Messenger event and returns a complete `MessageProof`
  directly is the natural next slice.
- The failed-deposit equivalent (`fetch_failed_deposit_proof`)
  is tracked in `03-tracking.md` as a slice-4c follow-up —
  shape-twin of `fetch_message_proof` with the extra
  `(depositSender, l1Token, amount)` trio appended.

## Suggested Order of Operations

1. **Ship the L1-receipt `NewPriorityRequest` decoder.** Closes
   the deposit-side `get_status` derivation gap and aligns the
   surface with `zksync-ethers`'s `getL2HashFromPriorityOp`.
2. **Ship the L2-receipt `L1MessageSent` decoder.** Closes the
   withdraw demo's manual paste and makes the withdraw flow
   zero-paste end-to-end. The same helper feeds
   `fetch_failed_deposit_proof` for the deposit-recovery side.
3. **Hold the wait helper** until at least one dapp asks. It is
   a minor surface addition, not an architectural commitment.
4. **Resurvey this file when post-slice-4 work lands.**
   Comparator versions drift; the rule is "the comparator column
   reflects the comparator's currently published version at
   resurvey time, not a cached impression."
