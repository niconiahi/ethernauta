# Plan `op_completeness_pass` — CHANGELOG

Source of truth for what landed in each commit of this phase.
Per **rule R3** in `tmp/plans/05_bridge_package/04-rules.md`
(which binds this phase per `README.md` *Operating rules*):
the CHANGELOG is the session-to-session baton, updated as part
of the closing protocol's commit step.

## Entry format

```markdown
## <short-SHA> — `<full commit subject>`

<2-3 sentence rationale: what landed and why it matters in the
PR context. Cross-link to the sub-surface number / D-decision
from README.md when relevant.>
```

Entries are grouped under per-PR headers
(`## PR1 — S8 operator-fee fix`). Within a PR, newest commit
at the top. PRs ordered oldest→newest (PR1 above PR2 above PR3).

---

## PR5 — S10 COMPARISON.md refresh

## f56aaf2f — `docs(op): refresh comparison for full-package scope`

S10, the last sub-surface in the canonical PR plan. Closes the
plan by documenting the final delta from PR1-PR4. Per
D10-1..D10-5:

- **D10-1 §Scope rewrite.** Now covers the full package, not
  just bridge — bridge slice (§§1–9), op-node RPC, predeploys,
  per-chain deploys, gas estimation (§10).
- **D10-2 §2 row flip.** "Derive L2 tx hash from L1 receipt"
  flipped from ❌ to ✅ with `derive_l2_tx_hashes_from_l1_receipt`
  named. Closed by PR4 / S6.
- **D10-3 §9 reframe.** Former §9.1 (L1-receipt L2-hash gap)
  removed — closed by S6. Former §9.2 (`waitForMessageStatus`)
  rewritten as "intentionally absent under M3" with the
  lifecycle-spans-hours-to-days reasoning made explicit. Former
  §9.3 (timing helpers) rewritten as "information equivalent,
  call shape different" — the maturity fields already ride on
  `get_status` variants. The §9 heading also renamed from
  "Where … Still Win" to "Comparator surfaces Ethernauta
  intentionally omits" to reflect that the entries are design
  choices, not gaps. §Gap Reading shortened to the two
  remaining entries.
- **D10-4 new §10 "Beyond-bridge coverage".** Four sub-tables:
  10.1 op-node RPC (5 methods, comparators ship none); 10.2
  predeploys (18 vendored with addresses, L2ToL1MessagePasser
  noted as bridge-resident); 10.3 per-chain deploys (11 chains
  — 6 phase 02 + 5 PR3; Base/Base-Sepolia/Fraxtal/Redstone
  deferred per NOTES §7); 10.4 gas estimation (`estimate_op_fees`
  operator-fee-aware + `estimate_op_fees_upper_bound` 1-RPC +
  `estimate_l1_fee`, with the explicit `estimateContract*`
  sugar-over-sugar note).
- **D10-5 §11 update.** Renumbered from un-numbered "Suggested
  Order of Operations" to §11. Bullet 1 split into ✅/⏸️ items:
  S6 derive verb + S8 operator-fee + S9 upper-bound closed;
  standalone timing helpers + playground polling helper +
  `game_invalidated` split still on hold. Bullet 2 picks up the
  4-chain deferral.

No source changes — markdown-only. `scripts/no-escape-hatches.sh`
unaffected. Closes the `op_completeness_pass` plan.

---

## PR4 — S5 deposit-tx primitives + S6 derive verb + S7 op-aware eth methods + S9 upper-bound fees

## 95d7ab00 — `feat(op): add deposit-tx primitives + op-aware eth + upper-bound fees`

S5 + S6 + S7 + S9 in one commit per the canonical PR plan.
The four sub-surfaces share `core/index.ts` + the bridge
exports so the diff doesn't split cleanly per-commit without
HEAD validity drift between commits — one commit per the
README closing protocol's "otherwise one commit is fine".

**S5 — deposit-tx primitives.** Pulled the fused
`compute_l2_deposit_tx_hash(DepositLog) → Hash32` apart per
D5-3 / D5-4. New `DepositTxSchema` at
`packages/op/src/core/deposit-tx.ts` carrying the eight-field
envelope shape (snake_case fields, hex on the wire,
`to: nullable(AddressSchema)` for creation deposits). New
`compute_deposit_source_hash` and `decode_deposit_tx` files
in `packages/op/src/bridge/` and the existing
`encode-deposit-tx.ts` refactored so `encode_deposit_tx(tx)`
is the clean primitive (just `0x7e || rlp(envelope)`, no
hashing). `compute_l2_deposit_tx_hash` stays — now a thin
wrapper composing source-hash + opaque-data slice + encode +
keccak — so the existing bridge `get_status` flow keeps
working with zero churn. Round-trip + fused-equivalence
tests in `encode-deposit-tx.test.ts` pin the behavior.
D5-5's "real mainnet fixture" suggestion is deferred — the
synthetic fixtures + the existing `get-status` test
(unchanged after the refactor) cover the same surface
cheaply.

**S6 — `derive_l2_tx_hashes_from_l1_receipt`.** Closes
`COMPARISON.md` §9.1 per D6-1. Plural return shape per D6-2
(multicall fan-out). Pure function (D6-3) — takes an L1
`ReceiptInfo` and returns `Hash32[]`. Filters by
`TransactionDeposited` topic0 alone, not by portal address
— matches viem's `getL2TransactionHashes` shape and keeps
the function chain-config-free per M4. Composes S5's
`compute_l2_deposit_tx_hash` per log. Five test cases:
one-deposit, multicall, no-deposit, mixed, contract-creation.
D6-5's "three mainnet fixtures" deferred — same rationale as
S5.

**S7 — OP-aware `eth_getBlockByNumber` +
`eth_getTransactionReceipt`.** Per D7-2 these expose the
same exported names as their `@ethernauta/eth` siblings; the
package subpath (`@ethernauta/op/methods`) is the
discriminator. Three new schemas in `packages/op/src/core/`:
`op-transaction.ts` (`OpDepositTxInfoSchema` for the
0x7e-tagged deposit-tx entries + `OpTransactionInfoSchema`
as the `union([OpDepositTxInfoSchema, TransactionInfoSchema])`
that block hydrations parse against), `op-block.ts`
(`OpBlockSchema` — field list duplicated from the base
`BlockSchema` because valibot intersect would collapse the
deposit-tx branch of the transactions union), `op-receipt.ts`
(`OpReceiptInfoSchema = intersect([ReceiptInfoSchema,
object({ depositNonce, depositReceiptVersion })])` — clean
extension since the OP extras only add fields). The two
methods are thin clones of their base siblings with the
return schema swapped. Synthetic op-mainnet-shaped fixtures
in the tests prove `sourceHash` / `mint` / `l1BlockNumber` /
`depositNonce` / `depositReceiptVersion` are all surfaced.
D7-5's "real op-mainnet block fixture" deferred — synthetic
fixtures exercise the schema correctly and are reproducible
without RPC access.

**S9 — `estimate_op_fees_upper_bound`.** Per D9-3 / D9-5. 1
parallel-`Promise.all`-of-2 reads (1559 fees + L1 upper
bound) instead of `estimate_op_fees`'s 4. Independent of
`estimate_op_fees` per D9-2 — no shared cache, no shared
state. Operator-fee component intentionally omitted: the
upper-bound contract covers L1 data only, and Isthmus
detection is a separate eth_call that would defeat the
"1-RPC pre-sign" semantic. The unsigned RLP is built with
throwaway nonce/gas/fee placeholders since
`getL1FeeUpperBound`'s formula only reads byte length per
D9-4. D9-6 inequality assertion holds on a synthetic
transport where the same call inputs return a larger upper
bound than `getL1Fee`.

**Decisions made (carry into PR5).**
- DepositTxSchema field names are snake_case (`source_hash`,
  `is_system_tx`) — matches the rest of `@ethernauta/op`'s
  internal-value schemas. Wire-shape schemas (OpBlock,
  OpReceipt, OpDepositTxInfo) stay camelCase to mirror the
  JSON-RPC payload.
- `compute_deposit_source_hash` takes
  `{ l1_block_hash, l1_log_index: Uint }` (wire-shape hex
  string), not bigint — same convention as `DepositLog`.
- `OpDepositTxInfoSchema` requires `sourceHash` + `mint` as
  the discriminator. The union with `TransactionInfoSchema`
  is order-sensitive: deposit branch tried first, falls
  through to base.
- `OpBlockSchema`'s field list mirrors `BlockSchema` exactly
  — when base block fields drift, this file needs the same
  drift applied. Tracked by replay tests at runtime.
- `derive_l2_tx_hashes_from_l1_receipt` does NOT take a
  portal address parameter. Filtering is by event topic
  alone. If a caller needs address-scoping they pre-filter
  `l1_receipt.logs` before invoking.



## fbabd678 — `feat(op): add safeHeadAtL1Block + 5 superchain chains`

S3 + S4 bundled, per the canonical PR plan's "quick wins" PR.
S3 appends Lisk (1135), Ink (57073), Unichain (130), Cyber
(7560), BOB (60808) to `CHAIN_IDS` in
`pull-superchain-registry.ts` — 5 of the originally-scoped 9.
Four chains fell out at impl time and are tracked in
`NOTES.md` §7 for a follow-up: Base / Base Sepolia (not
Superchain-Registry members, addresses live outside
`addresses.json`); Fraxtal / Redstone (pre-fault-proof OP
stack, ship `L2OutputOracleProxy` in place of the modern
fault-proof contract set, would crash `OpDeploysSchema` parse).
`src/lib/deploy.ts` extended with 5 new imports + 5 `DEPLOYS`
entries; `src/deploys/SOURCES.md` per-chain table updated and
"Why Base is absent" reframed as "Chains intentionally absent"
covering all 4 deferred chains.

S4 ships `optimism_safeHeadAtL1Block` — the last remaining
public op-node method with clear dapp value. Schema at
`packages/op/src/core/safe-head-at-l1-block.ts`:
`{ l1Block: BlockID, safeHead: BlockID }` where `BlockID` is
the existing `L1OriginSchema` shape (`{ hash, number }`,
structurally identical per `op-service/eth/id.go`). README's
D4-2 said `BlockRef` — corrected to `BlockID` at impl time
after reading the Go source. Method binding at
`packages/op/src/methods/optimism-safe-head-at-l1-block.ts`
mirrors `optimism_outputAtBlock`'s positional-or-object
parameter form. Two test cases cover both parameter forms.
See README sub-surface 3 (D3-1…D3-4) + sub-surface 4
(D4-1…D4-4).

---

## PR2 — S1+S2 sourcing migration + 12-predeploy sweep

## ec15ca7e — `feat(op): vendor 12 predeploys via forge-from-github`

S2 lands the 12 new OP-stack predeploys per D2-1: WETH (0x420…0006),
OptimismMintableERC20Factory (0x420…0012), L1BlockNumber (0x420…0013),
L2ERC721Bridge (0x420…0014), OptimismMintableERC721Factory (0x420…0017),
ProxyAdmin (0x420…0018), BaseFeeVault (0x420…0019), SchemaRegistry
(0x420…0020), EAS (0x420…0021), GovernanceToken (0x420…0042),
LegacyMessagePasser (0x420…0000), DeployerWhitelist (0x420…0002). All 12
vendored via `forge-from-github` end-to-end — even though every contract
in the set is also reachable through `snapshots/abi/` at the same OP
SHA — to exercise the S1 plumbing end-to-end. Two surfaces went into
the recipe schema beyond what S1 shipped: `libs` (per-recipe tarball
extraction into `<project>/lib/<dest>/`, supersedes the throwaway
`oz_pin` scalar) and `remappings` (foundry remap list, written verbatim
to the generated `foundry.toml`). The whole OP submodule set is
vendored at OP's pins — OZ x3 (regular + upgradeable + v5), solady x2,
solmate, forge-std, lib-keccak, safe-contracts, kontrol-cheatcodes —
because OP's `src/libraries/Predeploys.sol` transitively imports from
`scripts/`, and the scripts tree pulls in most of the libs even when
the predeploys themselves don't. EAS sourced from
`ethereum-attestation-service/eas-contracts@v1.4.0` with `@openzeppelin/contracts@v5.2.0`.
WETH is named `weth` per upstream's `op-contracts/v6.0.0` rename from
`WETH9`. `pnpm regen` emits all 12 `methods/` folders; only
`EAS.eip712Domain` is skipped (`bytes1` type unhandled by the
generator — same skip as the snapshot path). `predeploys/index.ts`
stays an address-only barrel per D2-4 (now 18 entries). `predeploys/SOURCES.md`
rewritten with per-recipe pin table for the 11 vendored libs + 18
predeploys. `L2ToL1MessagePasser` (0x420…0016) intentionally stays
under `bridge/` per D2-3; `GovernanceToken` ships even though it's
Optimism-only per D2-2. See README sub-surface 2 (D2-1…D2-5).

## 35d8a0fd — `refactor(op): support forge-from-github mode in pull-contracts`

S1 plumbing only — no new recipes, no ABI changes. `RecipeSchema`
becomes a `variant("source", [...])` discriminated union with two
modes: the existing `snapshot-json` (fetch pre-compiled ABI JSON
from `ethereum-optimism/optimism`'s `snapshots/abi/` folder) and a
new `forge-from-github` (download a repo tarball at a pinned ref,
extract a source subtree into a temp foundry workspace, optionally
`forge install` OpenZeppelin, and `forge inspect <Pascal> abi
--json`). Tarball workspaces are memoized per `(repo, ref)` so the
sub-surface 2 sweep — ~10 contracts from the same OP repo at the
same SHA — downloads the tarball once. All 12 existing recipes
(6 predeploys + 6 bridge contracts) carry `source:
"snapshot-json"` and round-trip byte-identical (D1-5 verified:
`git diff packages/op/src/predeploys/ packages/op/src/bridge/` is
empty after re-running the script). Unlocks sub-surface 2's
predeploy sweep (next commit).

## PR1 — S8 operator-fee fix in `estimate_op_fees`

## 951f006f — `fix(op): include operator fee in estimate_op_fees on isthmus+ chains`

Closes the silent under-count on Isthmus-active chains. Adds
`isIsthmus()` to the phase-1 parallel batch and conditionally
composes `getOperatorFee(gasUsed)` into the result; pre-Isthmus
chains skip the fee call entirely and return zero. Breaking
schema change — `operator_fee: UintSchema` added to
`OpFeesSchema` per CLAUDE.md hard rule 12 (no back-compat
shims). Also installs the bridge-plan operating rules (R1-R4)
and closing protocol into this plan folder, plus this CHANGELOG.
See README.md sub-surface 8 (D8-1…D8-6).
