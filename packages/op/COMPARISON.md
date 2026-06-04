# `@ethernauta/op` vs `viem/op-stack` vs `@eth-optimism/sdk` — Feature Comparison

Per-package companion to the repo-root `../../BRIDGE.md` (bridge
mental model) and `../../COMPARISON.md` (library-wide feature
comparison). Same legend:

- ✅ first-class / built-in
- ⚠️ partial / via add-on / awkward
- ❌ not provided
- 📦 separate package (same vendor)

**Scope.** This file scores the full `@ethernauta/op` package
against `viem/op-stack` and `@eth-optimism/sdk`: the bridge
slice (§§1–9), op-node RPC methods, vendored L2 predeploys,
per-chain L1 deploy registries, and gas estimation (§10).
Sibling packages carry their own `COMPARISON.md` files
(`packages/arbitrum/COMPARISON.md`,
`packages/zksync/COMPARISON.md`). Every Ethernauta cell below
maps 1:1 to a shipped export from `packages/op/src/` — no
aspirational entries.

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
| Derive L2 tx hash from L1 receipt | ✅ `derive_l2_tx_hashes_from_l1_receipt({ l1_receipt }) → Hash32[]` — topic-filtered, plural return shape handles multicall fan-out | ✅ `getL2TransactionHashes` | ✅ `getMessagesByTransaction` |
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

## 9. Comparator surfaces Ethernauta intentionally omits

The three entries below are design choices, not gaps. Each one
maps to a comparator API that Ethernauta could expose, with a
deliberate reason for the absent (or differently-shaped) export.

1. **`waitForMessageStatus` (sdk).** A UX helper that blocks
   until the message reaches a target status. **Intentionally
   absent under M3.** The withdraw lifecycle spans hours to
   days; a blocking helper imposes a polling cadence and a
   cancellation policy on the dapp, which under path 2 owns
   both. The playground `bridge-withdraw-eth` demo shows the
   pattern (poll `get_status` every 15 s). Will not ship.
2. **Per-side timing helpers (`getTimeToProve` /
   `getTimeToFinalize`, viem).** **Information equivalent,
   call shape different.** The timing fields already ride on
   `get_status` variants:
   `proof_pending_maturity.unlock_at` /
   `ready_to_finalize` carry the maturity timestamp directly.
   Comparators expose them as standalone reads;
   Ethernauta rides them on the discriminated union so a
   dapp doing an exhaustive `switch` already has the data.
   Promote-to-standalone is a one-file follow-up if a dapp
   asks.
3. **Ecosystem maturity.** Both comparators are years older
   and embedded in dapp templates, tutorials, and dev tooling.

---

## 10. Beyond-bridge coverage

§§1–9 scored the bridge slice. The rest of `@ethernauta/op`
extends beyond that surface — op-node RPC bindings, vendored
L2 predeploys, per-chain L1 deploy registries, and OP-aware
gas estimation. Neither comparator competes on most of these
axes; the sub-tables below score what each ships against
Ethernauta's exports.

### 10.1 op-node RPC methods

| Method | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| `optimism_outputAtBlock` | ✅ from `@ethernauta/op/methods` | ❌ | ❌ |
| `optimism_syncStatus` | ✅ from `@ethernauta/op/methods` | ❌ | ❌ |
| `optimism_rollupConfig` | ✅ from `@ethernauta/op/methods` | ❌ | ❌ |
| `optimism_version` | ✅ from `@ethernauta/op/methods` | ❌ | ❌ |
| `optimism_safeHeadAtL1Block` | ✅ from `@ethernauta/op/methods` | ❌ | ❌ |
| OP-aware `eth_getBlockByNumber` (deposit-tx + L1 fields) | ✅ from `@ethernauta/op/methods` — `OpBlockSchema` recognises 0x7e deposit-tx envelopes and surfaces `l1BlockNumber` | ❌ (base viem block schema only) | ❌ |
| OP-aware `eth_getTransactionReceipt` (deposit-receipt extras) | ✅ from `@ethernauta/op/methods` — `OpReceiptInfoSchema` extends with optional `depositNonce` / `depositReceiptVersion` | ❌ (base viem receipt schema only) | ❌ |

The op-node JSON-RPC surface is unique to Ethernauta among
the three libraries. Both `eth_*` overrides share names with
their base `@ethernauta/eth` siblings — the package subpath
(`@ethernauta/op/methods`) is the discriminator.

### 10.2 L2 predeploys (vendored ABIs + method bindings)

18 OP predeploys vendored under `packages/op/src/predeploys/`,
each as its own subfolder with `address.ts`, `<Name>.abi.json`,
and a generated `methods/` folder. Method bindings are reached
via `@ethernauta/op/predeploys/<kebab>`; `predeploys/index.ts`
is an address-only barrel because method names collide across
predeploys (`paused`, `version`, `initialize`).

| Predeploy | Address | Ethernauta | viem | sdk |
|---|---|---|---|---|
| `legacy-message-passer` | `0x42…0000` | ✅ | ❌ | ❌ |
| `deployer-whitelist` | `0x42…0002` | ✅ | ❌ | ❌ |
| `weth` | `0x42…0006` | ✅ | ❌ | ❌ |
| `l2-cross-domain-messenger` | `0x42…0007` | ✅ | ❌ | ❌ |
| `gas-price-oracle` | `0x42…000F` | ✅ | ⚠️ (inline ABI for fee math only) | ❌ |
| `l2-standard-bridge` | `0x42…0010` | ✅ | ⚠️ (inline ABI inside bridge actions) | ⚠️ |
| `sequencer-fee-vault` | `0x42…0011` | ✅ | ❌ | ❌ |
| `optimism-mintable-erc20-factory` | `0x42…0012` | ✅ | ❌ | ❌ |
| `l1-block-number` | `0x42…0013` | ✅ | ❌ | ❌ |
| `l2-erc721-bridge` | `0x42…0014` | ✅ | ❌ | ❌ |
| `l1-block` | `0x42…0015` | ✅ | ❌ | ❌ |
| `optimism-mintable-erc721-factory` | `0x42…0017` | ✅ | ❌ | ❌ |
| `proxy-admin` | `0x42…0018` | ✅ | ❌ | ❌ |
| `base-fee-vault` | `0x42…0019` | ✅ | ❌ | ❌ |
| `l1-fee-vault` | `0x42…001A` | ✅ | ❌ | ❌ |
| `schema-registry` | `0x42…0020` | ✅ | ❌ | ❌ |
| `eas` | `0x42…0021` | ✅ | ❌ | ❌ |
| `governance-token` | `0x42…0042` | ✅ | ❌ | ❌ |

`L2ToL1MessagePasser` (`0x42…0016`) is a 19th predeploy
logically, but lives under `packages/op/src/bridge/` because
its callers are bridge verbs — moving it would split the
withdrawal-initiation flow across two subpaths. Intentional
per D2-3.

### 10.3 Per-chain L1 deploy registries

11 OP-stack chains vendored under
`packages/op/src/deploys/eip155-<chain_id>.ts`, each parsed
against `OpDeploysSchema` at module load. Sourced from
`ethereum-optimism/superchain-registry` at the pin recorded
in `packages/op/src/deploys/SOURCES.md`. Consumers reach the
addresses via `require_deploy_addresses(chain_id)` from the
package root.

| Chain | chain_id | Ethernauta | viem chain def | sdk |
|---|---|---|---|---|
| OP Mainnet | 10 | ✅ | ✅ (chain def only) | ✅ |
| OP Sepolia | 11155420 | ✅ | ✅ | ✅ |
| Unichain | 130 | ✅ | ✅ | ❌ |
| Worldchain | 480 | ✅ | ✅ | ❌ |
| Lisk | 1135 | ✅ | ✅ | ❌ |
| Soneium | 1868 | ✅ | ✅ | ❌ |
| Mode | 34443 | ✅ | ✅ | ❌ |
| Ink | 57073 | ✅ | ✅ | ❌ |
| Cyber | 7560 | ✅ | ✅ | ❌ |
| BOB | 60808 | ✅ | ✅ | ❌ |
| Zora | 7777777 | ✅ | ✅ | ❌ |

viem ships chain definitions for many OP-stack chains but
not the deployment addresses — its op-stack actions take the
contract addresses as call-time parameters. Ethernauta ships
both the chain definition (`@ethernauta/chain`) and the L1
deploy bundle (`@ethernauta/op/deploys`) so verbs can resolve
addresses from `chain_id` alone.

**Deferred (tracked).** Four OP-stack chains are deferred
to a follow-up sub-surface — call sites resolve `❌` rather
than ✅ if invoked with these chain IDs:

- **Base (8453) + Base Sepolia (84532)** — not Superchain-
  Registry members. Addresses publish from `base-org/docs`
  with unproxied schema names (`OptimismPortal` vs the
  registry's `OptimismPortalProxy`). Needs a secondary
  source path plus schema-name normalisation. (Deferral A,
  `NOTES.md` §7.)
- **Fraxtal (252) + Redstone (690)** — pre-fault-proof OP
  stack. Ship `L2OutputOracleProxy` in place of
  `DisputeGameFactoryProxy` + `MIPS` + `PreimageOracle` +
  `PermissionedDisputeGame`, and no `Challenger` role.
  Adding them requires loosening `OpDeploysSchema` (more
  `optional()` fields) and recognising
  `L2OutputOracleProxy` as a valid pre-fault-proof field.
  (Deferral B, `NOTES.md` §7.)

### 10.4 Gas estimation

| Helper | Ethernauta | `viem/op-stack` | `@eth-optimism/sdk` |
|---|---|---|---|
| Aggregate OP fee estimate (1559 + L1 data + operator fee) | ✅ `estimate_op_fees` — 4-call parallel batch, operator-fee aware on Isthmus+ chains via `isIsthmus()` + `getOperatorFee(gasUsed)` | ⚠️ `estimateContract*` variants (encoding sugar over `getL1Fee`) | ⚠️ `estimateL2MessageGasLimit` / `estimateTotalGasCost` (partial) |
| Pre-sign upper-bound (no nonce, no gas limit) | ✅ `estimate_op_fees_upper_bound` — 2-call parallel batch (1559 fees + `getL1FeeUpperBound`); 1 OP-stack RPC instead of 4 | ❌ | ❌ |
| Direct L1-fee read against `GasPriceOracle` | ✅ `estimate_l1_fee` | ⚠️ via `estimateContract*` action chain | ⚠️ via SDK helper |

**Note on viem's `estimateContract*` variants.** These are
pure encoding sugar over the same primitives Ethernauta
exposes — they encode the calldata for the caller and then
call `GasPriceOracle.getL1Fee` on the result. Same numbers,
same RPCs, fewer keystrokes. We do not ship a parallel
variant because the encoding step is already a one-liner via
`@ethernauta/abi` codecs at the call site; adding sugar over
sugar widens the surface without adding capability. Promote
on dapp ask.

---

## Gap Reading

- The wait-helper omission (§9.1) is intentional under M3 —
  dapps drive their own polling cadence because the lifecycle
  spans hours-to-days and a blocking helper is the wrong
  abstraction in a per-call resolver shape.
- The timing-helper granularity choice (§9.2) costs zero
  information — the timing fields ride on the
  `get_status` union — but costs a call-site idiom comparator
  users are familiar with. Promote-to-standalone is a
  one-file follow-up if a dapp asks.

## 11. Suggested Order of Operations

1. **OP UX-helper additions — partially closed.** The
   original bullet read "hold every UX-helper addition until
   a dapp asks." Some of those landed because the cost-to-
   ship was below the cost-of-asking:
   - ✅ **L1-receipt L2-hash derivation** —
     `derive_l2_tx_hashes_from_l1_receipt` shipped (closes
     former §9.1).
   - ✅ **Operator-fee accounting in `estimate_op_fees`** —
     not a feature, a bug fix; every pre-Isthmus build was
     under-counting fees.
   - ✅ **Pre-sign upper-bound estimator
     (`estimate_op_fees_upper_bound`)** — one new file, a
     UX-validated wallet pattern (max-fee display before the
     full envelope is known).
   - ⏸️ **Standalone timing helpers** (`get_time_to_prove` /
     `get_time_to_finalize`) — still on hold; the
     information already rides on `get_status` variants.
   - ⏸️ **Polling helper for the playground** — still on
     hold; the playground polls inline.
   - ⏸️ **`game_invalidated` variant split** — still on
     hold; revisit once a dapp ships recovery UX against it.
2. **Chain coverage follow-up.** §10.3's four deferred
   chains (Base + Base Sepolia + Fraxtal + Redstone) land in
   a future sub-surface — Base needs a secondary source path
   + schema normalisation, Fraxtal/Redstone need an
   `OpDeploysSchema` loosening pass for the pre-fault-proof
   contract set.
3. **Resurvey this file when sibling rollup `COMPARISON.md`s
   land** (Arbitrum at slice 3, zkSync at slice 4 — both
   already shipped). Comparator versions drift; the rule is
   "the comparator column reflects the comparator's currently
   published version at resurvey time, not a cached
   impression."
