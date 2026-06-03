# `@ethernauta/op` vs `viem/op-stack` vs `@eth-optimism/sdk` — Feature Comparison

Per-package companion to the repo-root `../../BRIDGE.md` (bridge
mental model) and `../../COMPARISON.md` (library-wide feature
comparison). Same legend:

- ✅ first-class / built-in
- ⚠️ partial / via add-on / awkward
- ❌ not provided
- 📦 separate package (same vendor)

**Scope.** This file scores the OP rollup family only —
`@ethernauta/op/bridge` against `viem/op-stack` and
`@eth-optimism/sdk`. Sibling packages will carry their own
`COMPARISON.md` files (`packages/arbitrum/COMPARISON.md`,
`packages/zksync/COMPARISON.md`) when their bridge slices land.
Every Ethernauta verb cell below maps 1:1 to a shipped export
from `packages/op/src/bridge/index.ts` — no aspirational
entries.

The two comparators:

- **`viem/op-stack`** — a chain-extending module of viem v2,
  shipped under the `viem` package. Currently the
  Optimism-recommended SDK for new dapps.
- **`@eth-optimism/sdk`** — Optimism Labs' original class-based
  ethers-v5 SDK, centered on `CrossChainMessenger`. Marked
  deprecated; new work should migrate to `viem/op-stack` (or
  the companion `@eth-optimism/viem`). Included here because it
  remains the de-facto reference for what a "complete" OP
  bridge SDK exposes.

---

## 1. Architecture & Philosophy

| Dimension | Ethernauta `@ethernauta/op/bridge` | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| Call shape | ✅ Curried `verb(args)(bridge)` — same `Bridgeable<T>` shape across all 10 OP verbs | ⚠️ Per-action `wallet.writeContract` / `public.readContract` calls, action-name-per-method | ⚠️ Class methods on `CrossChainMessenger` instance |
| Validation at boundaries | ✅ Valibot `parse` on every input + envelope | ⚠️ TS-only types, internal asserts | ⚠️ runtime checks, no schemas |
| Sign-then-broadcast (M3 path 2) | ✅ default — verbs compose `eth_signTransaction` + `eth_sendRawTransaction` so the wallet only signs | ⚠️ possible via raw tx but uncommon; default is wallet-broadcast | ⚠️ possible via raw tx but uncommon; default is wallet-broadcast |
| Reads work with **no** wallet attached | ✅ `Bridgeable<T>` resolvers split per-side; reads run through `origin.reader` / `destination.reader` | ✅ public-action subset | ⚠️ class wants both signers + providers; reads work with providers only |
| Fault-proof awareness (post-Bedrock) | ✅ all withdraw verbs reason about `DisputeGameFactory` + `AnchorStateRegistry`; no defunct `L2OutputOracle` references | ✅ `getGame` / `getGames` / fault-proof-aware status | ⚠️ patched in maintenance mode; original API predates fault proofs |
| Hosted-infrastructure dependence (M4) | ✅ public RPC only — no indexer, bundler, paymaster, or rollup-vendor service required | ✅ public RPC only | ✅ public RPC only |
| Tree-shake granularity | ✅ per-verb subpath via `@ethernauta/op/bridge` re-exports + per-contract `@ethernauta/op/bridge/<contract>` for thin bindings | ✅ named-export shaking on viem chain extensions | ⚠️ class-based; whole `CrossChainMessenger` lands together |
| Typed error taxonomy from portal reverts | ✅ `variant("kind", [ProofUnavailable, GameUnresolved, GameInvalidated, ProofNotMature])` + `OpBridgeFailure.data` | ⚠️ raw RPC error string surfaces | ⚠️ raw RPC error string surfaces |
| Library status | ✅ active (this slice) | ✅ active, Optimism-recommended | ⚠️ deprecated; maintenance mode |

---

## 2. OP-Stack Verb Coverage

Verb names below are the Ethernauta-side intent verbs; the
comparator columns describe the equivalent surface in each
SDK's vocabulary.

### Deposit (L1 → L2)

| Verb | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| `send_eth` — lock ETH on L1, credit `to` on L2 | ✅ `L1StandardBridge.bridgeETHTo` | ⚠️ via `depositTransaction` against portal (not a first-class action targeting the standard bridge) | ✅ `CrossChainMessenger.depositETH` |
| `send_erc20` — lock token on L1, mint canonical L2 representation | ✅ `L1StandardBridge.bridgeERC20To` | ⚠️ via `depositTransaction` / user composes `writeContract` on the standard bridge | ✅ `depositERC20` |
| `send_message` — arbitrary calldata on L2 from L1 | ✅ `OptimismPortal.depositTransaction` | ✅ `depositTransaction` | ✅ `sendMessage` |

### Withdraw initiation (L2 → emits log)

| Verb | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| `start_withdraw_eth` | ✅ `L2StandardBridge.withdrawTo` with the legacy ETH sentinel + `msg.value = amount` | ⚠️ user composes `writeContract` on the L2 predeploy | ✅ `withdrawETH` |
| `start_withdraw_erc20` | ✅ `L2StandardBridge.withdrawTo` | ⚠️ user composes `writeContract` on the L2 predeploy | ✅ `withdrawERC20` |
| `start_withdraw_message` | ✅ `L2ToL1MessagePasser.initiateWithdrawal` | ⚠️ user composes `writeContract` on the L2 predeploy | ✅ `sendMessage` (reverse direction) |

### Withdraw redemption (L1 prove + execute)

| Verb | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| `fetch_message_proof` — scan `DisputeGameFactory`, read L2 storage proof | ✅ `Bridgeable<OpMessageProof>` — returns `{ withdrawal_transaction, output_root_proof, withdrawal_proof, l2_output_index }` | ✅ `buildProveWithdrawal` produces the args struct | ✅ `getMessageProof` returns the proof bundle |
| `prove_withdraw` — record proof against a resolved dispute game | ✅ `OptimismPortal.proveWithdrawalTransaction` + typed-error decoding | ✅ `proveWithdrawal` action | ✅ `proveMessage` |
| `execute_withdraw` — replay message after maturity windows | ✅ `OptimismPortal.finalizeWithdrawalTransaction` + typed-error decoding | ✅ `finalizeWithdrawal` action | ✅ `finalizeMessage` |

### Status + helpers

| Verb | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| `get_status` — direction-discriminated read | ✅ `Bridgeable<OpBridgeStatus>` returning a discriminated union (see §3) | ✅ `getWithdrawalStatus` (withdraw side only) | ✅ `getMessageStatus` (`MessageStatus` enum) |
| Maturity-window timing helpers | ⚠️ surfaced as union variants on `get_status` (`proof_pending_maturity` / `ready_to_finalize`) | ✅ `getTimeToProve` / `getTimeToFinalize` actions | ✅ `estimateMessageWaitTimeSeconds` |
| Derive L2 tx hash from L1 receipt | ❌ deposit side stops at `included_l1` / `in_progress_l2` / `succeeded_l2` / `failed_l2` (derived from the L2 receipt of the system tx) | ✅ `getL2TransactionHashes` | ✅ `getMessagesByTransaction` |
| Wait helper (`waitForMessageStatus`) | ❌ — dapps poll `get_status` themselves (M3-aligned: the lifecycle is user-driven, not blocking) | ❌ | ✅ `waitForMessageStatus` |

---

## 3. Status / Lifecycle Comparison

| Dimension | Ethernauta `OpBridgeStatus` | viem `WithdrawalStatus` | sdk `MessageStatus` enum |
|---|---|---|---|
| Direction discriminator | ✅ `{ direction: "deposit" \| "withdraw" }` input + state union covering both | ⚠️ withdraw-only (`getWithdrawalStatus`) | ✅ infers direction from message |
| Deposit-side variants | ✅ `submitted_l1` / `included_l1` / `in_progress_l2` / `succeeded_l2` / `failed_l2` | ❌ no first-class deposit-status action | ✅ `UNCONFIRMED_L1_TO_L2_MESSAGE` / `FAILED_L1_TO_L2_MESSAGE` / `RELAYED` |
| Withdraw-side variants | ✅ `initiated_l2` / `awaiting_game_proposal` / `game_in_progress` / `ready_to_prove` / `proof_pending_maturity` / `ready_to_finalize` / `finalized` / `game_invalidated` | ✅ `waiting-to-prove` / `ready-to-prove` / `waiting-to-finalize` / `ready-to-finalize` / `finalized` | ✅ `STATE_ROOT_NOT_PUBLISHED` / `READY_TO_PROVE` / `IN_CHALLENGE_PERIOD` / `READY_FOR_RELAY` / `RELAYED` (patched for fault proofs) |
| Game-invalidated terminal state | ✅ explicit `game_invalidated` (covers `CHALLENGER_WINS` + blacklist + retired game type) | ⚠️ surfaces as error / retry-needed | ⚠️ same — not a first-class state |
| Exhaustive `switch` at the dapp | ✅ discriminated union — TS enforces exhaustiveness | ✅ string-literal union | ⚠️ TS enum + class method |
| Schema-validated at the boundary | ✅ `parse(OpBridgeStatusSchema, ...)` before return | ❌ TS-only | ❌ TS-only |

---

## 4. Error Taxonomy

| Dimension | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| Typed revert decoding from portal | ✅ `try_decode_op_bridge_failure(error)` matches five `OptimismPortal2` custom errors (`OptimismPortal_ProofNotOldEnough`, `_InvalidDisputeGame`, `_ImproperDisputeGame`, `_InvalidProofTimestamp`, `_InvalidRootClaim`) | ⚠️ viem's `ContractFunctionRevertedError` carries `data.errorName` if the ABI knows the error, but the op-stack module doesn't ship an OP-portal-specific taxonomy | ❌ raw RPC error string |
| Carrier shape | ✅ `OpBridgeFailure extends Error` with parsed variant on `.data: { kind, ... }` | ⚠️ generic `ContractFunctionRevertedError` | ❌ raw `Error` |
| Variant union | ✅ `variant("kind", [ProofUnavailable, GameUnresolved, GameInvalidated, ProofNotMature])` | ❌ | ❌ |
| Fallback when selector unrecognized | ✅ plain RPC error rethrown | ✅ generic revert error | ✅ generic revert error |

---

## 5. Proof Bundle

| Dimension | Ethernauta `OpMessageProof` | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| Public Valibot schema | ✅ `WithdrawalTransactionSchema`, `OutputRootProofSchema`, `OpMessageProofSchema` exported from `@ethernauta/op/bridge` | ❌ TS types only | ❌ TS types only |
| Reconstructable from primitives | ✅ uses `@ethernauta/abi`'s `decode_logs` + `@noble/hashes` keccak — no SDK-private codec | ✅ uses viem primitives | ⚠️ uses ethers + sdk-private helpers |
| Dispute-game scan policy | ✅ documented: backwards from `gameCount() - 1`, bounded to 256, filtered by `gameType == respectedGameType()`, `wasRespectedGameTypeWhenCreated`, `status == DEFENDER_WINS`, `l2BlockNumber >= withdrawal_l2_block_number`, `!isGameBlacklisted` | ✅ similar policy | ⚠️ patched into maintenance mode |
| Storage-slot helper exposed | ✅ `compute_withdrawal_hash` / `compute_sent_messages_storage_slot` / `OUTPUT_ROOT_VERSION_V0` — direct exports | ❌ internal | ❌ internal |
| Storage proof source | ✅ standard `eth_getProof` against `L2ToL1MessagePasser` at the picked game's L2 block | ✅ same | ✅ same |

---

## 6. Hosted-Infrastructure Dependence (M4)

| Dependency | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| Vendor-run indexer / API | ❌ none required | ❌ none required | ❌ none required |
| Required RPC endpoints | L1 public RPC + L2 public RPC | same | same |
| Optional paid services anywhere in the surface | ❌ | ❌ | ❌ |

All three honor M4 for the OP rollup family. The differentiator
is what each does on top of public RPCs — taxonomy, validation,
call shape — not what they depend on. The M4 row exists to make
that explicit, not to score one library above another on this
axis.

---

## 7. Bundle / Tree-Shaking

| Dimension | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| Per-verb import | ✅ `@ethernauta/op/bridge` re-exports each verb individually | ✅ named-export actions | ⚠️ class import pulls full surface |
| Per-contract import for thin ABI bindings | ✅ `@ethernauta/op/bridge/<contract>` per `OptimismPortal` / `L1StandardBridge` / `DisputeGameFactory` / `FaultDisputeGame` / `AnchorStateRegistry` / `L2ToL1MessagePasser` | ⚠️ ABI constants inline | ⚠️ wrapped in class |
| Runtime dependencies | `valibot`, `@noble/hashes` | viem core | ethers v5 |
| Class-based handle | ❌ (by design — `Bridgeable<T>` per M1) | ❌ | ✅ `CrossChainMessenger` |

---

## 8. Where Ethernauta Wins (OP)

1. **Typed error taxonomy.** `variant("kind", [...])` on
   `OptimismPortal2`'s five canonical custom errors gives dapps
   an exhaustive `switch` at the call site instead of pattern-
   matching revert strings.
2. **Discriminated `OpBridgeStatus` union covering both
   directions.** One verb, one input shape, two lifecycles —
   exhaustive at compile time.
3. **Path-2 sign-then-broadcast as the default** for every
   payable verb. The wallet's only job is signing; the dapp
   chooses where to broadcast. Neither comparator defaults to
   this shape.
4. **Schema-validated boundaries** on every input + every
   returned bundle (`WithdrawalTransactionSchema`,
   `OutputRootProofSchema`, `OpBridgeStatusSchema`,
   `OpBridgeErrorSchema`).
5. **Storage-slot + withdrawal-hash helpers exposed as direct
   exports** — the proof bundle's internals are
   reconstructable by hand, not gated behind library-private
   functions.
6. **Game-scan policy documented in code, not a black box.**
   `fetch_message_proof`'s filter set is readable in one file;
   no rollup-vendor service is consulted.

## 9. Where viem/op-stack and @eth-optimism/sdk Still Win

1. **`getL2TransactionHashes` (viem) / `getMessagesByTransaction`
   (sdk).** Deriving the L2 tx hash from an L1 deposit receipt
   is a one-call helper in both comparators. Ethernauta's
   `get_status` stops short of this on the deposit side
   (`succeeded_l2` / `failed_l2` are derived from the L2 receipt
   the wallet/dapp already holds; reconstructing it from the L1
   `TransactionDeposited` event is a follow-up).
2. **`waitForMessageStatus` (sdk).** A UX helper that blocks
   until the message reaches a target status. Ethernauta
   deliberately leaves polling to the dapp (the playground
   `bridge-withdraw-eth` demo polls `get_status` every 15 s) —
   blocking helpers fit awkwardly in `Bridgeable<T>`.
3. **Per-side timing helpers (`getTimeToProve` /
   `getTimeToFinalize`, viem).** Ethernauta surfaces these as
   variant fields on `get_status` (`proof_pending_maturity` /
   `ready_to_finalize`) rather than as standalone reads. The
   information is equivalent; the call shape is less granular.
4. **Ecosystem maturity.** Both comparators are years older
   and embedded in dapp templates, tutorials, and dev tooling.

---

## Gap Reading

- The L1-receipt-derived L2 tx hash gap (§9.1) is the one
  honest deposit-side gap; the path is documented in
  `03-tracking.md` as a follow-up and the union already ships
  the `succeeded_l2` / `failed_l2` variants so dapps that hold
  the L2 receipt are not blocked.
- The wait helper gap (§9.2) is intentional under M3 — dapps
  drive their own polling cadence because the lifecycle spans
  hours-to-days and a blocking helper is the wrong abstraction
  in a per-call resolver shape.
- The timing-helper granularity gap (§9.3) costs zero
  information — the timing fields ride on the union — but
  costs a call-site idiom comparator users are familiar with.
  Promote-to-standalone is a one-file follow-up if a dapp
  asks.

## Suggested Order of Operations

1. **Hold OP UX-helper additions** (L1-receipt L2-hash
   derivation, standalone timing helpers, a polling helper for
   the playground) until at least one dapp asks. They are
   minor surface additions, not architectural commitments, and
   shipping them speculatively widens the surface without a
   user-validated shape.
2. **Revisit the `game_invalidated` collapse** once a dapp has
   shipped a recovery UX against it — the variant union may
   split back out into `challenger_won` / `blacklisted` /
   `retired_game_type` if the call site needs to discriminate.
3. **Resurvey this file when sibling rollup `COMPARISON.md`s
   land** (Arbitrum at slice 3, zkSync at slice 4). Comparator
   versions drift; the rule is "the comparator column reflects
   the comparator's currently published version at resurvey
   time, not a cached impression."
