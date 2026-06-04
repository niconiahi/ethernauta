# `@ethernauta/op` — completeness pass

> ## 🛑 BEFORE ANY `git commit` IN THIS PHASE
>
> Read `.claude/skills/git/SKILL.md`. The commit message is
> **one lowercase line, no body, no trailers, no
> `Co-Authored-By`**, formatted as
> `type(scope): description` (≤72 chars). Anything else fails
> the closing protocol and gets amended. See R0 in *Operating
> rules* below — this is the most-violated rule in this
> phase, which is why it sits at the top of the document.

**Status: 🔵 Designed, awaiting implementation.** Follow-up to
phase 02 (`@ethernauta/op`, landed 2026-05-31). Extends the
package across nine sub-surfaces that the original phase didn't
cover and refreshes `COMPARISON.md` to score the full package
(originally bridge-only).

Driven by a chat-mode interview against `packages/op/COMPARISON.md`.
The original doc was honest about gaps (§9.1 / §9.2 / §9.3) but
only scored the bridge slice. Probing the rest of the package
surfaced several real gaps the doc didn't flag — most notably a
silent under-counting bug in `estimate_op_fees` on Isthmus+ chains
(operator fee omitted).

Nine sub-surfaces (+ one docs sub-surface):

1. **Predeploy sourcing migration → foundry + GitHub `.sol`.**
   Today's `pull-contracts.ts` consumes pre-compiled ABI JSON from
   upstream's `snapshots/abi/` folder. That limits us to contracts
   the OP team chose to snapshot. Migrate to the
   `forge inspect` + GitHub `.sol` pattern that
   `@ethernauta/arbitrum` and `@ethernauta/zksync` already use,
   with OZ remapping support. Unlocks sub-surface 2.
2. **Full predeploy sweep.** Add 12 missing predeploys — WETH9,
   OptimismMintableERC20/721 factories, L1BlockNumber,
   L2ERC721Bridge, ProxyAdmin, BaseFeeVault, SchemaRegistry,
   EAS, GovernanceToken, LegacyMessagePasser, DeployerWhitelist.
3. **Chain coverage expansion.** Add 9 OP-stack chains to the
   superchain-registry pull script: Base (8453), Base Sepolia
   (84532), Lisk, Fraxtal, Ink, Unichain, Cyber, Redstone, BOB.
   All 9 already present in `@ethernauta/chain` — pure script
   edit.
4. **op-node RPC: `optimism_safeHeadAtL1Block`.** The one missing
   public op-node method with clear dapp value. Full audit of the
   `optimism_*` namespace folded into the slice for the
   COMPARISON refresh.
5. **Deposit-tx (type 0x7E) encoder + decoder + source-hash
   helper.** Primitives needed by sub-surface 6 (and useful
   standalone for explorers / indexer-less dapps that need to
   reconstruct a deposit tx from its constituent fields).
6. **`derive_l2_tx_hashes_from_l1_receipt`.** Closes
   `COMPARISON.md` §9.1 with a real implementation rather than a
   doc note. Returns the L2 tx hashes of every deposit tx
   triggered by an L1 transaction.
7. **OP-aware `eth_getBlockByNumber` + `eth_getTransactionReceipt`.**
   Standard op-geth returns extra fields on deposit txs
   (`sourceHash`, `mint`, `l1BlockNumber`, `l1Timestamp`,
   `depositNonce`, `depositReceiptVersion`); base `@ethernauta/eth`
   parsers strip them. Ship OP-aware variants under
   `@ethernauta/op/methods/` with extended schemas.
8. **Operator-fee inclusion in `estimate_op_fees`.** Bug fix.
   Today's estimator silently under-counts on Isthmus+ chains.
   Fork-detect via `GasPriceOracle.isIsthmus()` (binding already
   ships) and conditionally compose
   `getOperatorFee` into the total. Breaking schema change
   (`operator_fee: UintSchema` added to `OpFeesSchema`) —
   acceptable per CLAUDE.md hard rule 12.
9. **`estimate_op_fees_upper_bound`.** New 1-RPC helper for
   pre-sign UX. Pessimistic (guaranteed-not-exceeded), composes
   `getL1FeeUpperBound(byteLength)` — different semantic contract
   from `estimate_op_fees`. Independent of `estimate_op_fees`; no
   shared cache.
10. **`COMPARISON.md` refresh.** Rewrite §9.1 (closed), reframe
    §9.2 as intentionally-absent under M3, document §9.3's
    information-equivalence with `get_status` variants. Add a new
    §10 scoring the rest of the package (op-node RPC, predeploys,
    per-chain deploys, gas estimation).

**Out of scope: bridge verb additions.** No new bridge verbs in
this pass; the §9.2 wait helper and the `game_invalidated` split
are intentionally deferred. See *Out of scope* below for the
full list with reasons.

## Why this is a follow-up phase

Phase 02 set the architectural pattern (one package, four
sub-surfaces, foundry-driven autogen, `require_deploy_addresses`
gating). This pass doesn't change that pattern — it fills it in.

The triggers, in order of weight:

1. **A silent bug.** `estimate_op_fees` under-counts on Isthmus+
   chains (sub-surface 8). Every other item could plausibly wait
   "until a dapp asks"; this one can't because the existing API is
   wrong today. Once the fix is in flight, the rest of the surface
   work is cheap to bundle.
2. **A sourcing limitation.** `pull-contracts.ts`'s
   `snapshots/abi/` mode locks us out of WETH9 and EAS (neither
   is in upstream's snapshot folder). The sibling rollup packages
   already use `forge inspect` against GitHub `.sol`; OP is the
   outlier. Migrating sourcing unlocks the predeploy sweep.
3. **A scoring blindspot.** `COMPARISON.md` originally only
   scored the bridge slice — but the package is much larger and
   we win in those areas too (op-node RPC: comparators ship zero;
   gas estimation: comparator parity is pure sugar with zero new
   information). The doc refresh isn't pedantic completionism —
   it's surfacing actual differentiation that wasn't documented.

Lessons from phase 02 baked into this pass:

- **Probe upstream before locking decisions.** Phase 02 D2/D6/D8
  were locked against a stale snapshot. This pass's D-decisions
  reference current files (interview verified
  `pull-contracts.ts`, `pull-superchain-registry.ts`,
  `estimate-op-fees.ts`, and sibling-rollup script patterns at
  design time).
- **Mirror sibling-rollup patterns.** Where Arbitrum and zkSync
  already solved a problem (foundry+GitHub sourcing,
  `RpcNumberSchema` for wire-format tolerance, …), OP adopts the
  same approach rather than inventing parallel scaffolding.

## Operating rules

> ### ⚠️ R0 — COMMIT MESSAGES MUST FOLLOW `/git` SKILL. NON-NEGOTIABLE.
>
> **Before EVERY `git commit`**, the message MUST match the
> conventions in `.claude/skills/git/SKILL.md` — read it if
> you haven't, re-read it if it's been more than one commit
> ago. The rules that get violated most often:
>
> - **ONE LINE. NO BODY. NO MULTI-LINE MESSAGES. EVER.** Not
>   one paragraph. Not two. One single line.
> - **ALL LOWERCASE.** No capital letters anywhere — not at
>   the start, not for proper nouns, not for component names,
>   not for "Isthmus". `isthmus`, lowercase.
> - **NO PERIOD AT THE END.**
> - **NO TRAILERS.** No `Co-Authored-By`. No `Signed-off-by`.
>   Nothing after the one-line subject.
> - **`type(scope): description`** — `feat` / `fix` /
>   `refactor` / `chore` / `docs` / `style` / `test` / `ci` /
>   `deploy`. Scope is the domain (`op`, `bridge`,
>   `notifications`) — never a file path.
> - **Under 72 characters.**
>
> Use `git log --oneline -10` to confirm the house style
> before writing the message. If a commit you just made
> violates these, **amend the message** (this is the one case
> in this repo where amending is the right move — the user
> has pre-authorised it for commit-message fixes within the
> closing protocol). Don't add a follow-up "fix the commit
> message" commit.
>
> Failures to comply are not minor — they're the leading
> cause of cleanup work in this repo. R0 is listed before
> R1-R4 because it bites earlier and more often.

The four rules in
[`tmp/plans/05_bridge_package/04-rules.md`](../05_bridge_package/04-rules.md)
bind every session in this phase. Per the bridge phase's own
03-tracking.md closing note ("Carries forward into any future
phase that touches `@ethernauta/op` / `arbitrum` / `zksync`"),
they apply here without restatement. Summarised for fast
recall — read the source doc for the full rationale:

- **R1 — per-package `test:unit`, never workspace-wide.** Filter
  to the touched packages. The exception is cross-package
  refactors, which list consumers explicitly rather than running
  `-r`.
- **R2 — per-package `typecheck`, never workspace-wide.** Same
  shape as R1.
- **R3 — `CHANGELOG.md` is the session-to-session baton.** Append
  an entry to `tmp/plans/op_completeness_pass/CHANGELOG.md`
  **before** each `git commit` so the changelog lands in the same
  commit it describes. One entry per commit; 2-3 sentences on the
  *why*. Grouped under per-PR headers (`## PR1 — S8 operator-fee
  fix`).
- **R4 — `git log --oneline -20` at session start.** Read the
  most recent commit subjects before reading any plan file. Run
  `git show <sha>` on anything that looks relevant. Diffs are
  canonical; prose drifts.

The closing protocol below (Step A + Step B) is the surface
through which R3 lands per commit.

## Closing protocol — every PR ends with these two steps

Imported verbatim from
[`tmp/plans/05_bridge_package/02-phases.md`](../05_bridge_package/02-phases.md)
"Closing protocol" section, retuned to per-PR rather than
per-sub-slice. The Canonical PR plan above chunks the work so
that every PR can land cleanly in a single session and hand off
to a fresh session without losing context.

### Step A — Commit

> ### 🛑 STOP. Re-read R0 (Operating rules section) BEFORE writing the commit message.
>
> The `/git` skill (`.claude/skills/git/SKILL.md`) is the
> binding spec for every commit in this repo. One line,
> lowercase, no body, no trailers, `type(scope): description`.
> Do **not** put a multi-paragraph rationale in the commit
> message — the rationale belongs in the CHANGELOG entry,
> not the commit subject. Do **not** append a
> `Co-Authored-By` trailer.

Once all per-PR gates pass (per-package `test:unit` + `typecheck`
per R1+R2, `biome check`, `scripts/no-escape-hatches.sh` at
baseline, plus any PR-specific verification listed under
*Verification* below), commit the work. Use one commit per
logical unit if the diff naturally splits (e.g. PR2:
sourcing-rewrite → predeploy-recipes → bindings-regen); otherwise
one commit is fine.

**The commit message itself** is just the conventional one-liner
per R0 / `/git`. Cross-reference to the plan goes in the
CHANGELOG entry, NOT the commit message.

**Before each `git commit`**, append the matching entry to
`tmp/plans/op_completeness_pass/CHANGELOG.md` per R3. This is
where the multi-sentence "why" rationale lives — keep the
commit subject lean.

Do **not** ship uncommitted working-tree state into the handoff.
Fresh sessions inherit the branch, not the working tree.

### Step B — Handoff prompt

After the commit, produce a **session handoff prompt** as the
final chat output. The prompt is what the user pastes verbatim
into a fresh session to pick up where this one ended. It is
**not** documentation — it reads like a brief to the next
assistant. Keep it under ~400 words.

The handoff prompt includes, in order:

1. **What just landed** — one or two sentences naming the PR /
   sub-surface(s) + commit hash(es).
2. **Decisions made** — every choice the closing session made
   that affects the next PR (param shapes, schema field names,
   naming conventions). One line each; rationale belongs in the
   Resume pointer + CHANGELOG, not the handoff prompt.
3. **What's next** — the next PR ID + the specific sub-surface
   D-decision numbers to start with (per the *Sub-surface N*
   sections of this README).
4. **Where to read first** — the file paths the next session
   should read before doing anything else. Typically:
   `tmp/plans/op_completeness_pass/README.md` (Resume pointer
   first, then the matching sub-surface), then
   `tmp/plans/op_completeness_pass/CHANGELOG.md`, then the
   *Critical files to read at start of fresh session* list.
5. **Known deferred items** — anything the closing session
   intentionally left out of the commit (manual smoke tests,
   follow-up cleanups, items deferred per plan note). One line
   each + a cross-reference to the *Out of scope* list or a
   tracking-line in the Resume pointer.
6. **Suggested first action** — the literal first tool call or
   first chunk of work the new session should do (e.g. "Read
   `packages/op/scripts/pull-contracts.ts` end-to-end then
   `git show <PR1-sha>` to confirm S8 is settled before
   starting S1").

Update this README's **Resume pointer** section (added below
the Implementation log) to mirror the handoff prompt's "What's
next" + "Suggested first action" sections **before** committing,
so the breadcrumb lives in git history alongside the work
itself. The handoff prompt in chat is the polished
paste-into-a-new-session mirror; the README's Resume pointer is
the canonical version.

If a PR can't finish in one session, do not skip the closing
protocol — commit whatever's complete, update the Resume
pointer to reflect the partial state, and emit a handoff prompt
that names the partial state explicitly. The next session picks
up against committed state, never against the previous
session's working tree.

## Scope

```
packages/op/
  scripts/
    pull-contracts.ts                          # REWRITTEN — sub-surface 1
                                               # discriminated source-mode recipe
                                               # snapshot-json (existing) + forge-from-github (new)
    pull-superchain-registry.ts                # UPDATED — sub-surface 3 (CHAIN_IDS append)

  src/
    bridge/
      compute-deposit-source-hash.ts           # NEW — sub-surface 5
      decode-deposit-tx.ts                     # NEW — sub-surface 5
      encode-deposit-tx.ts                     # POSSIBLY EXTENDED — sub-surface 5
      derive-l2-tx-hash.ts                     # NEW — sub-surface 6
      index.ts                                 # UPDATED — re-export new symbols

    core/
      deposit-tx.ts                            # NEW — sub-surface 5 (DepositTxSchema)
      safe-head-at-l1-block.ts                 # NEW — sub-surface 4
      op-block.ts                              # NEW — sub-surface 7 (OpBlockSchema)
      op-transaction.ts                        # NEW — sub-surface 7 (OpTransactionSchema)
      op-receipt.ts                            # NEW — sub-surface 7 (OpTransactionReceiptSchema)
      index.ts                                 # UPDATED

    deploys/                                   # +9 generated files from sub-surface 3
      eip155-8453.ts                           # NEW — Base
      eip155-84532.ts                          # NEW — Base Sepolia
      eip155-1135.ts                           # NEW — Lisk
      eip155-252.ts                            # NEW — Fraxtal
      eip155-57073.ts                          # NEW — Ink
      eip155-130.ts                            # NEW — Unichain
      eip155-7560.ts                           # NEW — Cyber
      eip155-690.ts                            # NEW — Redstone
      eip155-60808.ts                          # NEW — BOB
      SOURCES.md                               # UPDATED

    gas/
      estimate-op-fees.ts                      # UPDATED — sub-surface 8 (operator-fee composition)
      estimate-op-fees.test.ts                 # UPDATED — Isthmus fixture
      estimate-op-fees-upper-bound.ts          # NEW — sub-surface 9
      estimate-op-fees-upper-bound.test.ts     # NEW
      index.ts                                 # UPDATED

    methods/
      optimism-safe-head-at-l1-block.ts        # NEW — sub-surface 4
      optimism-safe-head-at-l1-block.test.ts   # NEW
      eth-get-block-by-number.ts               # NEW — sub-surface 7
      eth-get-block-by-number.test.ts          # NEW
      eth-get-transaction-receipt.ts           # NEW — sub-surface 7
      eth-get-transaction-receipt.test.ts      # NEW
      index.ts                                 # UPDATED

    predeploys/                                # +12 folders from sub-surface 2
      weth9/                                   # NEW — 0x4200…0006
      optimism-mintable-erc20-factory/         # NEW — 0x4200…0012
      l1-block-number/                         # NEW — 0x4200…0013
      l2-erc721-bridge/                        # NEW — 0x4200…0014
      optimism-mintable-erc721-factory/        # NEW — 0x4200…0017
      proxy-admin/                             # NEW — 0x4200…0018
      base-fee-vault/                          # NEW — 0x4200…0019
      schema-registry/                         # NEW — 0x4200…0020 (EAS upstream)
      eas/                                     # NEW — 0x4200…0021 (EAS upstream)
      governance-token/                        # NEW — 0x4200…0042 (Optimism only)
      legacy-message-passer/                   # NEW — 0x4200…0000
      deployer-whitelist/                      # NEW — 0x4200…0002
      index.ts                                 # UPDATED — address-only barrel
      SOURCES.md                               # UPDATED — pin SHAs per-recipe

  COMPARISON.md                                # REWRITTEN — sub-surface 10
  README.md                                    # MAYBE — note OP-aware eth_* import pattern
```

## Chain entries — typing model

Identical to phase 02 — `@ethernauta/chain` is the canonical
chain-definition surface. All 9 chains added in sub-surface 3
(8453, 84532, 1135, 252, 57073, 130, 7560, 690, 60808) verified
present in `packages/chain/src/chain/eip155/` at design time. No
changes to `@ethernauta/chain` required.

---

## Sub-surface 1 — Predeploy sourcing migration (design)

**D1-1 — Replace `snapshots/abi/` sourcing with two source modes,
discriminated per recipe.** Today's `pull-contracts.ts` fetches
JSON ABIs from `ethereum-optimism/optimism/.../snapshots/abi/`.
Three limitations: (a) only contracts the OP team chose to
snapshot are reachable; (b) no path for non-OP contracts (EAS
upstream, future OZ-only contracts); (c) no per-recipe solc pin.
The fix is to mirror the
`packages/arbitrum/scripts/pull-contracts.ts` pattern: a temp
foundry workspace with vendored `.sol` sources and
`forge inspect <Pascal> abi --json`.

We keep the existing JSON mode as a fallback so the 6 already-
shipped recipes don't have to re-vendor sources. Recipe schema:

```ts
const RecipeSchema = variant("source", [
  object({
    source: literal("snapshot-json"),
    pascal: string(),
    kebab: string(),
    function_allowlist: optional(array(string())),
  }),
  object({
    source: literal("forge-from-github"),
    pascal: string(),
    kebab: string(),
    repo: string(),                              // e.g. "ethereum-optimism/optimism"
    ref: string(),                               // SHA or tag
    src_path: string(),                          // e.g. "packages/contracts-bedrock/src/legacy/WETH9.sol"
    solc: optional(string()),                    // default "0.8.25"
    oz_pin: optional(string()),                  // OZ git ref for forge install; default repo's own pin
    function_allowlist: optional(array(string())),
  }),
])
```

**D1-2 — Foundry workspace lifecycle mirrors Arbitrum's.** Per
`packages/arbitrum/scripts/pull-contracts.ts:315-340`
(`write_foundry_toml`, `inspect_abi`): create temp dir,
`mkdir src/`, vendor every required `.sol` (recursively
following imports inside the OP repo), `forge install OpenZeppelin/openzeppelin-contracts@<pin>`,
write `foundry.toml` with `solc = "<pin>"` and
`remappings = ["@openzeppelin/=lib/openzeppelin-contracts/"]`,
`forge inspect <Pascal> abi --json`, parse into
`DescriptionSchema[]`, write to
`packages/op/src/predeploys/<kebab>/<Pascal>.abi.json`. Tear
down the temp dir.

**D1-3 — Solc pin default `0.8.25`.** Matches
`contracts-bedrock`'s own `foundry.toml` at `op-contracts/v6.0.0`
(the existing pin in `pull-contracts.ts` line 33). Per-recipe
override available for EAS-sourced recipes (EAS uses its own
solc pin).

**D1-4 — OZ pin discovery.** The default `oz_pin` is whatever
`ethereum-optimism/optimism` itself pins in
`packages/contracts-bedrock/lib/openzeppelin-contracts` at the
recipe's `ref`. The pull script reads upstream's
`.gitmodules` (or `lib/openzeppelin-contracts` submodule SHA via
GitHub's tree API) at the recipe's `ref` and uses that as the
default. EAS-sourced recipes set `oz_pin` explicitly to EAS's
own choice.

**D1-5 — Reachability sanity check before sub-surface 2 lands.**
Re-run the rewritten `pull-contracts.ts` against the existing 6
recipes in `snapshot-json` mode and `git diff
packages/op/src/predeploys/` — expect zero changes (byte-
identical ABIs). This guards against accidental drift introduced
by the rewrite.

### Reference

- `packages/arbitrum/scripts/pull-contracts.ts:315-340` —
  `write_foundry_toml`, `inspect_abi` shape.
- `packages/zksync/scripts/pull-contracts.ts:1-70` — alt pattern
  (tarball extraction) for context; not used here.

---

## Sub-surface 2 — Full predeploy sweep (design)

**D2-1 — Recipes added.** 12 new recipes, all
`source: "forge-from-github"`. Predeploy addresses are
structurally constant across every OP-stack chain (same byte on
OP Mainnet, Base, Mode, every Orbit-of-OP chain) and live as
named constants colocated with the binding — *not* duplicated
per chain. (Same D1 logic phase 02 used for L2 predeploys.)

| Pascal | kebab | Address | Upstream `src_path` |
|---|---|---|---|
| `WETH9` | `weth9` | 0x4200…0006 | `packages/contracts-bedrock/src/legacy/WETH9.sol` |
| `OptimismMintableERC20Factory` | `optimism-mintable-erc20-factory` | 0x4200…0012 | `packages/contracts-bedrock/src/universal/OptimismMintableERC20Factory.sol` |
| `L1BlockNumber` | `l1-block-number` | 0x4200…0013 | `packages/contracts-bedrock/src/legacy/L1BlockNumber.sol` |
| `L2ERC721Bridge` | `l2-erc721-bridge` | 0x4200…0014 | `packages/contracts-bedrock/src/L2/L2ERC721Bridge.sol` |
| `OptimismMintableERC721Factory` | `optimism-mintable-erc721-factory` | 0x4200…0017 | `packages/contracts-bedrock/src/L2/OptimismMintableERC721Factory.sol` |
| `ProxyAdmin` | `proxy-admin` | 0x4200…0018 | `packages/contracts-bedrock/src/universal/ProxyAdmin.sol` |
| `BaseFeeVault` | `base-fee-vault` | 0x4200…0019 | `packages/contracts-bedrock/src/L2/BaseFeeVault.sol` |
| `SchemaRegistry` | `schema-registry` | 0x4200…0020 | EAS — `contracts/SchemaRegistry.sol` |
| `EAS` | `eas` | 0x4200…0021 | EAS — `contracts/EAS.sol` |
| `GovernanceToken` | `governance-token` | 0x4200…0042 | `packages/contracts-bedrock/src/governance/GovernanceToken.sol` |
| `LegacyMessagePasser` | `legacy-message-passer` | 0x4200…0000 | `packages/contracts-bedrock/src/legacy/LegacyMessagePasser.sol` |
| `DeployerWhitelist` | `deployer-whitelist` | 0x4200…0002 | `packages/contracts-bedrock/src/legacy/DeployerWhitelist.sol` |

EAS-sourced recipes (`SchemaRegistry`, `EAS`) set
`repo: "ethereum-attestation-service/eas-contracts"` and pin to
EAS's most recent stable tag (probe at impl time). All other
recipes share the `ethereum-optimism/optimism` repo at the
existing pin (`OP_CONTRACTS_SHA` already in
`pull-contracts.ts`).

**D2-2 — `GovernanceToken` is Optimism-only.** Deployed at
0x4200…0042 on Optimism Mainnet and OP Sepolia; absent on Base,
Mode, Zora, and every other OP-stack chain. The binding ships
because the address is canonical (anyone reading the predeploy
slot on a chain where it isn't deployed gets a clear revert),
but the per-folder `README.md` notes the deployment-set
restriction. Mirrors phase 02's general philosophy of
"bindings ship even when not all chains deploy them — failure
at call time is the honest answer."

**D2-3 — `L2ToL1MessagePasser` is NOT migrated.** Already
vendored under `packages/op/src/bridge/l2-to-l1-message-passer/`
because it's bridge-tightly-coupled. Moving it to `predeploys/`
would split the bridge's own primitives across two folders for
zero gain. Note documented in `bridge/SOURCES.md`.

**D2-4 — Method-binding regen.** After
`pnpm --filter @ethernauta/op pull-contracts`, run
`pnpm exec ethernauta abi` to walk the new ABI files and emit
method bindings per `packages/cli/src/abi/`'s walker. Each
predeploy gets a `<kebab>/methods/` folder per phase 02's
convention. The root `predeploys/index.ts` is an address-only
barrel (method names collide across predeploys — every contract
ships a `version()` — so methods import via subpath
`@ethernauta/op/predeploys/<kebab>`).

**D2-5 — Sub-surface count math.** 6 existing + 12 new = 18
total predeploys vendored. One canonical OP-stack predeploy
intentionally excluded (`L2ToL1MessagePasser`, see D2-3).
`predeploys/SOURCES.md` lists all 18 with their pin sources.

---

## Sub-surface 3 — Chain coverage expansion (design)

**D3-1 — Append-only edit to `CHAIN_IDS`.** Single change in
`packages/op/scripts/pull-superchain-registry.ts:30`:

```ts
const CHAIN_IDS = [
  // existing (phase 02)
  10, 11155420, 480, 1868, 34443, 7777777,
  // op_completeness_pass additions
  8453,    // Base
  84532,   // Base Sepolia
  1135,    // Lisk
  252,     // Fraxtal
  57073,   // Ink
  130,     // Unichain
  7560,    // Cyber
  690,     // Redstone
  60808,   // BOB
] as const
```

**D3-2 — All 9 chains verified present** at design time:
- In `@ethernauta/chain` (`packages/chain/src/chain/eip155/eip155-<id>.ts`).
- In upstream `superchain-registry` at the existing pin
  `8b1e9dbca4dd2021a4239651ef645fbe9bc725d2` — verified via
  `curl -s https://raw.githubusercontent.com/ethereum-optimism/superchain-registry/8b1e9dbca4dd…/superchain/extra/addresses/addresses.json | jq 'keys'`
  at impl time. If any of the 9 is missing, bump
  `REGISTRY_SHA` (line 22) to a more recent commit.

**D3-3 — No new `require_deploy_addresses` wiring needed.** The
phase 02 access-layer (`packages/op/src/lib/deploy.ts`) already
keys by CAIP-2 string and resolves any chain whose deploys file
exists. The pull script regenerates `src/deploys/eip155-*.ts`
files; the wiring lookup picks them up automatically. **Sanity
check** at impl time: read `src/lib/deploy.ts` and confirm the
import set updates (may need to extend `DEPLOYS` map with the
9 new chains if explicit map entries are used).

**D3-4 — Coverage delta.** Before: 6 chains (~99% by OP-stack
TVL, but missing Base which is the largest OP-stack chain by
audience). After: 15 chains, ~100% by audience-weight for the
top-tier OP-stack rollups. Aligned with the
`03_arbitrum_package` slice 7 lesson (TVL is the wrong metric
for a dev-facing library; audience coverage is).

---

## Sub-surface 4 — op-node RPC: `optimism_safeHeadAtL1Block` (design)

**D4-1 — Ship the one missing public method.** Full audit of
op-node's `optimism_*` namespace at HEAD (probe at impl time
against
`ethereum-optimism/optimism/op-node/node/api.go`):

| Method | Status |
|---|---|
| `optimism_outputAtBlock` | ✅ shipped phase 02 |
| `optimism_syncStatus` | ✅ shipped phase 02 |
| `optimism_rollupConfig` | ✅ shipped phase 02 |
| `optimism_version` | ✅ shipped phase 02 |
| `optimism_safeHeadAtL1Block` | 🔵 this slice |
| `optimism_outputWithProofAtBlock` | ❌ out of scope (see D4-3) |

`opp2p_*`, `admin_*`, `opnode_*` namespaces are operator/admin
surface, not dapp-facing — out of scope, will not ship.

**D4-2 — Shape.** Mirrors existing methods exactly:

```ts
// packages/op/src/methods/optimism-safe-head-at-l1-block.ts
// https://docs.optimism.io/operators/node-operators/json-rpc#optimism_safeheadatl1block
export function optimism_safeHeadAtL1Block(_params: {
  l1_block_number: Uint
}): Readable<SafeHeadAtL1Block> { … }
```

Schema lives in `packages/op/src/core/safe-head-at-l1-block.ts`:
`object({ l1_block: BlockRefSchema, safe_head: L2BlockRefSchema })`.
Reuses existing `BlockRefSchema` from
`packages/op/src/core/block-ref.ts` — both fields are `BlockRef`
shape (`hash` + `number` + `parentHash` + `timestamp`).

**D4-3 — `optimism_outputWithProofAtBlock` is out of scope.**
Superset of `optimism_outputAtBlock` returning the storage proof
inline. Same information reachable today by combining
`optimism_outputAtBlock` + a manual `eth_getProof` against
`L2ToL1MessagePasser`. Promote if a dapp asks; not speculative.

**D4-4 — Test template.** Copy
`packages/op/src/methods/optimism-sync-status.test.ts` shape —
stub dispatcher, assert wire-format call, assert parsed return.

---

## Sub-surface 5 — Deposit-tx (type 0x7E) primitives (design)

**D5-1 — Why now.** Sub-surface 6 needs the encoder + source-hash
helper. Also genuinely useful standalone for explorers and
indexer-less dapps that want to reconstruct a deposit tx from
its constituent fields (without round-tripping through an L2
node).

**D5-2 — Envelope shape (per
https://specs.optimism.io/protocol/deposits.html#the-deposited-transaction-type).**

```
deposit_tx_envelope = 0x7E || rlp([
  sourceHash,    // bytes32
  from,          // address
  to,            // address | "" (creation)
  mint,          // uint256
  value,         // uint256
  gas,           // uint64
  isSystemTx,    // bool
  data           // bytes
])
```

Source hash for user deposits:

```
sourceHash = keccak256(abi.encode(
  uint256(0),                // depositSourceDomain — 0 for user deposits, 1 for L1 attributes
  keccak256(abi.encode(
    l1BlockHash,
    uint256(l1LogIndex)
  ))
))
```

**D5-3 — Three files.**

- `packages/op/src/bridge/encode-deposit-tx.ts` —
  **already exists** as of phase 02 (the bridge verbs need a
  partial encoder). At impl time, read first and assess
  extend-vs-replace. The full eight-field envelope encoder
  may already be there.
- `packages/op/src/bridge/decode-deposit-tx.ts` — NEW. Strips
  the 0x7E prefix, RLP-decodes the eight-field array, returns
  a typed `DepositTx` (Valibot schema).
- `packages/op/src/bridge/compute-deposit-source-hash.ts` — NEW.
  Uses `@noble/hashes` keccak (already a dep) +
  `@ethernauta/abi`'s `encode_parameters` for the two-`uint256`
  inner / `(uint256, bytes32)` outer abi.encode. If a usable
  `encode_parameters` doesn't exist, hand-roll two 32-byte
  word packing (it's two `Bytes32` concatenations and a
  keccak).

**D5-4 — Schema.**

```ts
// packages/op/src/core/deposit-tx.ts
export const DepositTxSchema = object({
  source_hash: Hash32Schema,
  from: AddressSchema,
  to: nullable(AddressSchema),         // null for contract creation
  mint: UintSchema,
  value: UintSchema,
  gas: UintSchema,
  is_system_tx: boolean(),
  data: BytesSchema,
})
export type DepositTx = InferOutput<typeof DepositTxSchema>
```

**D5-5 — Tests use real mainnet fixtures.** Pick a known
mainnet deposit tx (use
`cast tx --rpc-url <optimism-mainnet> <l2-deposit-tx-hash>` to
grab fields), encode → decode → expect identity. Compute
`keccak256(encode_deposit_tx(tx))` → expect the known L2 tx
hash.

---

## Sub-surface 6 — `derive_l2_tx_hashes_from_l1_receipt` (design)

**D6-1 — Closes `COMPARISON.md` §9.1.** Originally documented
as a follow-up; this slice implements it. viem's
`getL2TransactionHashes` and `@eth-optimism/sdk`'s
`getMessagesByTransaction` are the equivalents.

**D6-2 — Plural return.** Function name is
`derive_l2_tx_hashes_from_l1_receipt` (plural). A single L1
transaction can emit multiple `TransactionDeposited` events —
for example a multicall fanning into multiple
`OptimismPortal.depositTransaction` calls — and each event
becomes one L2 deposit tx with its own hash. Plural is the
honest shape; singular would be a footgun for multicall users.

**D6-3 — Pure function, not a `Bridgeable<T>`.** All inputs
already live in the L1 receipt; no transport needed. Plain
function export from `packages/op/src/bridge/index.ts`.

```ts
function derive_l2_tx_hashes_from_l1_receipt({
  l1_receipt: TransactionReceipt,
}): Hash32[]
```

**D6-4 — Algorithm.**

1. Filter `l1_receipt.logs` for `TransactionDeposited` events
   from the `OptimismPortal` address. Event signature from
   `packages/op/src/bridge/optimism-portal/OptimismPortal2.abi.json`.
   Decode via `@ethernauta/abi`'s `decode_logs`.
2. For each `TransactionDeposited(from, to, version, opaqueData)`:
   - Decode `opaqueData` per version (currently version 0):
     `mint(32) || value(32) || gas(8) || isCreation(1) || data(...)`.
     Slice manually — straight byte-position decoding.
   - Compute `source_hash` via
     `compute_deposit_source_hash({ l1_block_hash: log.blockHash, l1_log_index: log.logIndex })`.
   - Build a `DepositTx`, encode via `encode_deposit_tx`,
     `keccak256` the result → L2 tx hash.
3. Return all hashes in log order.

**D6-5 — Three fixture cases for the test suite.** ETH
deposit, ERC20 deposit, contract-creation deposit. Each fixture
records the real L1 receipt + the expected L2 tx hash (from
`cast tx` against OP mainnet). The test passes iff all three
derived hashes match.

**D6-6 — Boundary read.** At impl time, confirm
`@ethernauta/eth`'s receipt schema name and shape (likely
`TransactionReceiptSchema`). If the schema doesn't include
`blockHash` and `logIndex` on logs (both required by
`compute_deposit_source_hash`), extend it — those fields are
standard in every Ethereum JSON-RPC receipt.

---

## Sub-surface 7 — OP-aware `eth_getBlockByNumber` + `eth_getTransactionReceipt` (design)

**D7-1 — Why these two methods exist in `@ethernauta/op/methods/`.**
op-geth returns extra fields on every deposit tx and its
receipt. The base `@ethernauta/eth` parsers strip them. The
clean architectural answer is per-L2 method variants that
parse with extended schemas — *not* widening the base eth
schema (would bleed L2-specific knowledge into the foundation;
Arbitrum and zkSync return their own extras too).

**D7-2 — Same exported names as the base.** Functions are
named `eth_getBlockByNumber` and `eth_getTransactionReceipt`
(identical to the base) and live in `@ethernauta/op/methods/`.
Package subpath disambiguates:

```ts
// On OP chains, dapps import the OP-aware versions:
import { eth_getBlockByNumber } from "@ethernauta/op/methods"

// On non-OP chains, dapps use the base versions:
import { eth_getBlockByNumber } from "@ethernauta/eth"
```

A dapp importing both versions in different files will see
different inferred return types per import path. That is
correct behavior (the OP one returns more fields) and is
documented in `packages/op/README.md`.

**D7-3 — Extra fields on op-geth (per
op-geth `core/types/deposit_tx.go` + `core/types/receipt.go`).**

On a deposit-tx entry inside `block.transactions`:
- `sourceHash` (bytes32) — the deposit's source hash
- `mint` (uint256) — ETH minted on L2
- `l1BlockNumber` (uint64) — L1 block this deposit was
  sourced from
- `l1Timestamp` (uint64) — L1 block timestamp
- `depositNonce` (uint64, post-Canyon)
- `depositReceiptVersion` (uint64, post-Canyon)

On the receipt for a deposit tx:
- `depositNonce` (uint64, post-Canyon)
- `depositReceiptVersion` (uint64, post-Canyon)

Regular L2 txs and their receipts carry no extras.

**D7-4 — Schema shape.** Three new schemas in
`packages/op/src/core/`:

- `op-block.ts` — `OpBlockSchema` extends the base block
  schema with `transactions: array(OpTransactionSchema)`.
  Read `@ethernauta/eth`'s base block schema first to know
  what to extend.
- `op-transaction.ts` — `OpTransactionSchema` is a
  discriminated union: `variant("type", [LegacyTx,
  AccessListTx, Tx1559, Tx4844, DepositTx])` where
  `DepositTx` carries the OP fields. Type prefix `0x7E`
  discriminates deposit txs.
- `op-receipt.ts` — `OpTransactionReceiptSchema` extends
  the base receipt with optional `depositNonce` +
  `depositReceiptVersion` (only present on deposit-tx
  receipts).

**D7-5 — Fixture-based tests.** Record one real op-mainnet
block containing at least one deposit tx + its receipt;
replay through the schemas; assert `sourceHash`,
`l1BlockNumber`, `mint`, `depositNonce` are all surfaced on
the deposit-tx entry.

**D7-6 — Out of scope for this slice.** Other OP RPC methods
that return block/receipt shapes (`eth_getBlockByHash`,
`eth_getBlockReceipts`, `eth_getTransactionByHash`, …). Same
pattern would apply but we ship only the two highest-leverage
methods here. Promote if a dapp asks.

---

## Sub-surface 8 — Operator-fee fix in `estimate_op_fees` (design)

**D8-1 — This is a bug fix, not a feature add.** Today's
`estimate_op_fees` (in
`packages/op/src/gas/estimate-op-fees.ts`) silently
under-counts on Isthmus+ chains because the operator-fee
component is omitted. The fix composes
`GasPriceOracle.getOperatorFee` into the total, gated by
`GasPriceOracle.isIsthmus()`.

Both bindings already ship:
- `packages/op/src/predeploys/gas-price-oracle/methods/is-isthmus.ts`
- `packages/op/src/predeploys/gas-price-oracle/methods/get-operator-fee.ts`

**D8-2 — Fork detection at runtime, not via hardcoded chain
lists.** `isIsthmus()` is a view function on the
`GasPriceOracle` predeploy; the boolean it returns is the
authoritative answer per chain. No hardcoded "Isthmus chains
list" — it would go stale as more chains upgrade.

**D8-3 — Conditional composition.** Pseudocode (final shape at
impl time confirms the `getOperatorFee` ABI signature — it
may take gas-used as a parameter; read the binding first):

```ts
// inside estimate_op_fees, alongside the existing parallel reads:
const [fees_1559, nonce, gas, is_isthmus] = await Promise.all([
  estimate_1559_fees(…)(resolved),
  eth_getTransactionCount(…)(resolved),
  eth_estimateGas(…)(resolved),
  isIsthmus()({ chain_id: resolved[1].chain_id, to: GAS_PRICE_ORACLE_ADDRESS })(resolved),
])

// after computing l1_fee:
const operator_fee = is_isthmus
  ? await getOperatorFee({ … })({
      chain_id: resolved[1].chain_id,
      to: GAS_PRICE_ORACLE_ADDRESS,
    })(resolved)
  : ZERO_UINT
```

**D8-4 — Schema change is breaking.** `OpFeesSchema` gains
`operator_fee: UintSchema` as a required field. Per
CLAUDE.md hard rule 12, no back-compat shims. Existing
consumers fail at parse time with a clear Valibot error
pointing at the missing field — better than silently
under-counting.

**D8-5 — Test fixture.** Two cases:
- Isthmus-active fixture (Optimism Mainnet post-Holocene, or
  any chain where `isIsthmus()` returns `true`): assert
  `operator_fee > 0` (or `>= 0` depending on chain config).
- Pre-Isthmus fixture: assert `operator_fee === ZERO_UINT`
  and no second RPC was made.

**D8-6 — Future-proofing note.** Same pattern (read the
`is<Fork>()` flag, conditionally compose) extends to future
forks (`isJovian()` already ships as a binding). When a future
fork adds another fee component, add it the same way. The
estimator stays fork-aware via runtime detection, not version
strings.

---

## Sub-surface 9 — `estimate_op_fees_upper_bound` (design)

**D9-1 — 1-RPC pre-sign UX helper.** `getL1FeeUpperBound`
takes just the byte length of the unsigned tx (not the full
RLP) and returns a pessimistic-by-design L1 fee estimate.
Useful for wallets to show users a "max fee" *before* the full
tx envelope is known (no nonce yet, no gas limit yet). 1 RPC
vs `estimate_op_fees`'s 4 — meaningful on mobile / poor RPC
contexts, and the "guaranteed not to be exceeded" semantic is
the right contract for a max-fee UI promise.

**D9-2 — Independent of `estimate_op_fees`.** They compute
different things: the upper bound is intentionally pessimistic
(padded above the real fee for safety); the accurate path
returns the exact current fee. Reusing upper-bound data inside
`estimate_op_fees` would corrupt the accurate number with the
upper-bound's safety margin. The two helpers stay separate by
design — no shared cache, no shared state.

A bootstrap-scalars / sync-computation design (cache
`{ l1BaseFee, blobBaseFee, scalars }` from one batched read,
then both helpers become local arithmetic) was considered and
rejected for this pass as speculative. Promote if a bulk-
pricing use case appears.

**D9-3 — Shape.**

```ts
// packages/op/src/gas/estimate-op-fees-upper-bound.ts
export function estimate_op_fees_upper_bound(_parameters: {
  tx: { to: Address, value?: Uint, input?: Bytes }
  base_fee_multiplier: number
  priority_percentile: number
}): Readable<OpFeesUpperBound>

export const OpFeesUpperBoundSchema = object({
  base_fee_per_gas: UintSchema,
  max_priority_fee_per_gas: UintSchema,
  max_fee_per_gas: UintSchema,
  l1_fee_upper_bound: UintSchema,
})
```

**D9-4 — Byte-length computation.** Build the unsigned RLP
with placeholder nonce/gas/maxFee (since
`getL1FeeUpperBound`'s formula only cares about byte count).
Same `encode_transaction_unsigned` call as `estimate_l1_fee`
uses today; the placeholder values are throwaway. Pass
`byte_length = unsigned_bytes.length` to
`getL1FeeUpperBound(uint256)`.

**D9-5 — Parallel reads.** Two reads in parallel:
- `estimate_1559_fees(…)` for L2-side fees (same as
  `estimate_op_fees`)
- `getL1FeeUpperBound(byte_length)(…)` for the L1 component

**D9-6 — Test assertion.** On any tx,
`estimate_op_fees_upper_bound(tx).l1_fee_upper_bound >
estimate_op_fees({ tx, … }).l1_fee` — the upper bound by
definition exceeds the accurate value. That inequality IS the
helper's semantic contract; the test pins it.

---

## Sub-surface 10 — `COMPARISON.md` refresh (design)

**D10-1 — Scope expansion.** Today's `COMPARISON.md` scores
only the bridge slice. The "Scope" paragraph at the top is
rewritten to reflect that the doc now scores the full package:
bridge, op-node RPC, predeploys, per-chain deploys, gas
estimation. Comparator columns remain `viem/op-stack` and
`@eth-optimism/sdk` (resurveyed against their currently
published versions at impl time).

**D10-2 — §2 verb table delta.** Flip the ❌ in the
"Derive L2 tx hash from L1 receipt" row to ✅ for Ethernauta
(closed by sub-surface 6).

**D10-3 — §9 reframe.**
- **§9.1.** Remove. Replaced by sub-surface 6's shipped verb.
- **§9.2.** Rewrite as "Intentionally absent under M3." The
  withdrawal lifecycle spans hours to days; a blocking
  `waitForMessageStatus` helper imposes a polling cadence and
  cancellation policy on the dapp. Dapps own that under path
  2. The playground demonstrates the poll-`get_status` pattern
  at 15s. Stays in the §9 list, but reframed as a design choice
  with reasoning — not a gap.
- **§9.3.** Rewrite as "Information equivalent, call shape
  different." The timing fields already ride on `get_status`
  variants (`proof_pending_maturity.unlock_at`,
  `ready_to_finalize`). Comparators expose them as standalone
  reads; we ride them on the discriminated union. Promote to
  standalone `get_time_to_prove` / `get_time_to_finalize` if a
  dapp asks.

**D10-4 — New §10 "Beyond-bridge coverage".** Add a
top-level section scoring the rest of the package, since the
doc previously only covered bridge. Sub-tables:

- **op-node RPC** — list the 5 methods we ship
  (`outputAtBlock`, `syncStatus`, `rollupConfig`, `version`,
  `safeHeadAtL1Block`). viem ships none; sdk ships none.
  Ethernauta wins by default; comparators don't compete on
  this axis.
- **Predeploys** — list all 18 vendored predeploys (6 from
  phase 02 + 12 from sub-surface 2) with addresses. viem
  ships ❌ for most; sdk ships ❌. Note `L2ToL1MessagePasser`
  is under bridge/, not predeploys/.
- **Per-chain deploys** — list all 15 chains (6 from phase 02
  + 9 from sub-surface 3). viem ships chain definitions for
  many but not the OP deploy addresses.
- **Gas estimation** — `estimate_op_fees` (now operator-fee
  aware), `estimate_op_fees_upper_bound`, `estimate_l1_fee`.
  viem ships `estimateContract*` variants which are pure
  encoding sugar — same numbers from the same primitives,
  pre-encoded calldata. **Note this explicitly** so future
  readers don't re-litigate the "shouldn't we add
  estimateContract*" question.

**D10-5 — §11 "Suggested Order of Operations" update.** Mark
bullet 1 ("hold OP UX-helper additions until a dapp asks") as
partially closed:
- §9.1 closed (sub-surface 6)
- Operator-fee fix shipped (sub-surface 8) — bug not feature,
  not gated on dapp ask
- Upper-bound shipped (sub-surface 9) — pre-sign UX value
  established generically; one new file is cheap
- Standalone timing helpers, polling helper for playground,
  game_invalidated variant split — still on hold.

---

## Sequencing

| # | Sub-surface | Depends on | Independent? |
|---|---|---|---|
| 1 | Predeploy sourcing migration | — | starts the chain |
| 2 | Full predeploy sweep | 1 | sequential after 1 |
| 3 | Chain coverage expansion | — | independent |
| 4 | `optimism_safeHeadAtL1Block` | — | independent |
| 5 | Deposit-tx primitives | — | independent (needed by 6) |
| 6 | `derive_l2_tx_hashes_from_l1_receipt` | 5 | sequential after 5 |
| 7 | OP-aware eth_* methods | — | independent |
| 8 | Operator-fee fix | — | independent |
| 9 | `estimate_op_fees_upper_bound` | — | independent |
| 10 | COMPARISON.md refresh | 1-9 | last |

S1→S2 and S5→S6 are sequential. S3, S4, S7, S8, S9 are fully
independent — can land in any order or in parallel. S10 lands
last to incorporate all surface changes.

### Canonical PR plan (5 PRs)

Resolved from first principles; this is the order to follow
unless something concrete shifts at impl time. The constraint
graph allows many orderings — these five PRs are the one that
maximises early bug containment, contains the biggest mechanical
change in a single dedicated PR, and lets documentation absorb
the final delta last.

| PR | Sub-surfaces | Why this PR exists |
|---|---|---|
| **PR1** | **S8** (operator-fee fix) | **Urgency-first.** S8 fixes a silent under-count on Isthmus+ chains — every build shipped before PR1 is wrong on that surface. Also a breaking `OpFeesSchema` change; landing it alone means PR2-PR5 build against the final shape rather than mid-flight. Smallest possible surface (one file modified, one fixture added). |
| **PR2** | **S1 + S2** (sourcing migration → predeploy sweep) | **Biggest mechanical change, locked pair.** S1→S2 is sequential by definition (the sweep needs the new sourcing). Doing it second clears the heaviest slice while the pattern is fresh from designing it. The D1-5 round-trip diff check sits at the S1/S2 boundary, so both halves want to land together. |
| **PR3** | **S3 + S4** (chain coverage + `optimism_safeHeadAtL1Block`) | **Small wins, independent.** S3 is a 1-line `CHAIN_IDS` edit + regen; S4 is one new method mirroring an existing template. Both verify in minutes. Pairs naturally as the "quick stuff" PR. |
| **PR4** | **S5 + S6 + S7 + S9** (deposit-tx primitives → derive, OP-aware eth_*, upper-bound) | **Remaining feature surface.** S5→S6 sequential inside the batch; S7 and S9 independent. S9 explicitly belongs after S8 (PR1 already done) — both live in `packages/op/src/gas/` and the design assumes S8's `OpFeesSchema` shape is settled. S5+S6 close COMPARISON §9.1 in time for PR5 to document it as resolved. |
| **PR5** | **S10** (COMPARISON refresh) | **Documentation absorbs final delta.** Must run after PR1-PR4 so every flipped row reflects landed code, not aspirational state. |

**Why not the plan's example batch `{1,2}, {3,4,5,6}, {7}, {8,9}, {10}`?** That ordering buries the bug fix behind seven other slices. Containment principle says ship the fix first. The example is a valid grouping by *plan-graph topology* (sequential constraints + independence), but PR plans optimise for landed-cost and risk reduction, not just dependency-graph minimality. PR1=S8 is the override.

**Why not 10 PRs (one per sub-surface)?** Per the user's chosen cadence ("parallel-safe batches, 5 PRs"). 10 PRs would also force S1 to merge to main on its own, where it has no observable effect until S2 lands — that's a churn cost without a review-isolation benefit.

**Inside each PR.** Follow the slice-shaped structure used by `02_op_package/README.md` — one slice = one cohesive change with its own tests + verification command. PR2 contains two slices (S1 then S2 sequential); PR3 contains two parallel slices; PR4 contains four (S5→S6 sequential, S7 and S9 parallel-safe).

---

## Verification (end-to-end)

After all sub-surfaces land:

```bash
# Sub-surface 1 — predeploy sourcing rewrite
pnpm --filter @ethernauta/op pull-contracts
git diff packages/op/src/predeploys/        # round-trip diff on existing 6 = zero

# Sub-surface 2 — full sweep
ls packages/op/src/predeploys/              # expect 18 folders

# Sub-surface 3 — chains
pnpm --filter @ethernauta/op pull-superchain-registry
ls packages/op/src/deploys/                 # expect 15 eip155-*.ts files

# Method-binding regen across new ABIs
pnpm regen                                  # or: pnpm exec ethernauta abi

# Full build + tests
pnpm --filter @ethernauta/op build
pnpm --filter @ethernauta/op test

# Cross-package fallout
pnpm build
pnpm test
biome check
scripts/no-escape-hatches.sh                # 10 hard-zero counters at zero

# Manual smoke on the playground
pnpm dev                                    # wallet extension + playground watch
# Exercise:
#  - bridge-withdraw-eth flow on OP Sepolia (phase 02 regression check)
#  - estimate_op_fees on a Base mainnet RPC (operator_fee in result)
#  - estimate_op_fees_upper_bound on the same tx (l1_fee_upper_bound > l1_fee)
#  - eth_getBlockByNumber from @ethernauta/op/methods on a recent OP block
#    containing a deposit tx (l1BlockNumber + sourceHash present)
```

**Sanity reads** before marking done:
- `packages/op/COMPARISON.md` — refreshed per sub-surface 10.
- `packages/op/src/predeploys/SOURCES.md` — all 18 contracts
  listed with per-recipe pin sources.
- `packages/op/src/deploys/SOURCES.md` — 15 chains listed.
- `scripts/no-escape-hatches.sh` baseline — preserved.

---

## Out of scope (intentionally, with reason)

- **`optimism_outputWithProofAtBlock`** — superset of
  `outputAtBlock`; same information reachable via existing
  bindings + `eth_getProof`. Promote if a dapp asks.
- **viem's `estimateContract*` sugar variants** — pure
  encoding ergonomics over our existing primitives. Zero new
  numbers. Skip until a dapp asks.
- **Bootstrap-scalars / sync `compute_op_fees`** — speculative
  optimization over the per-call RPCs. Ship if a bulk-pricing
  use case appears.
- **`waitForMessageStatus`** — M3 violation. Will not ship.
  Documented in §9.2 of the refreshed COMPARISON.
- **Standalone `get_time_to_prove` / `get_time_to_finalize`** —
  information already on `get_status` variants. Promote if a
  dapp asks.
- **`game_invalidated` variant split** — speculative; wait for
  a dapp shipping recovery UX against it.
- **`L2ToL1MessagePasser` migration from `bridge/` to
  `predeploys/`** — bridge-tightly-coupled; leave where it is.
- **Other OP RPC method variants** (`eth_getBlockByHash`,
  `eth_getBlockReceipts`, `eth_getTransactionByHash`) — same
  pattern as sub-surface 7 would apply. Ship the two
  highest-leverage methods; promote others if a dapp asks.

---

## Verified-current upstream sources (probe at impl time)

For every D-decision, the source file / commit / repo to
probe at implementation time (versions drift; the rule is the
comparator column reflects the comparator's currently published
version at impl time, not a cached impression):

- **OP contracts source tree.** `ethereum-optimism/optimism`
  at the existing `OP_CONTRACTS_SHA` pin in
  `packages/op/scripts/pull-contracts.ts:34`
  (`018f5ae926ec3277746b56a1c4ddb715c568603d`, matching
  `op-contracts/v6.0.0`). Bump only if a recipe needs a
  newer Solidity feature.
- **OpenZeppelin pin (default).** Whatever
  `ethereum-optimism/optimism` itself pins as the
  `lib/openzeppelin-contracts` submodule at the same SHA.
  Read via GitHub's tree API at impl time.
- **EAS contracts.** `ethereum-attestation-service/eas-contracts`
  — pin to most recent stable tag at impl time.
- **Superchain-registry.** Already pinned at
  `8b1e9dbca4dd2021a4239651ef645fbe9bc725d2` in
  `pull-superchain-registry.ts:22`. Bump only if any of the
  9 new chains is missing at this SHA.
- **op-node RPC namespace audit.**
  `ethereum-optimism/optimism/op-node/node/api.go` at HEAD.
- **Deposit-tx spec.**
  https://specs.optimism.io/protocol/deposits.html#the-deposited-transaction-type
  — pin the version of the spec you read against.
- **op-geth deposit-tx + receipt field set.** op-geth source
  `core/types/deposit_tx.go` + `core/types/receipt.go` at HEAD.
- **viem op-stack module + `@eth-optimism/sdk`** — for the
  COMPARISON.md refresh, resurvey at impl time. Note both
  versions in the refreshed doc header.

---

## Critical files to read at start of fresh session

The plan references these by line number; shapes may have
drifted since planning. Read these first:

1. `packages/arbitrum/scripts/pull-contracts.ts` — reference
   pattern for sub-surface 1 (foundry + GitHub `.sol` +
   `forge inspect`).
2. `packages/op/scripts/pull-contracts.ts` — what sub-surface
   1 replaces.
3. `packages/op/src/gas/estimate-op-fees.ts` — modified by
   sub-surface 8.
4. `packages/op/src/bridge/encode-deposit-tx.ts` — assessed
   by sub-surface 5 (may already cover the full envelope).
5. `packages/op/src/predeploys/gas-price-oracle/methods/get-operator-fee.ts`
   — confirm ABI signature before sub-surface 8 composes it.
6. `packages/op/src/predeploys/gas-price-oracle/methods/get-l1-fee-upper-bound.ts`
   — confirm ABI signature before sub-surface 9 composes it.
7. `packages/op/src/methods/optimism-sync-status.ts` — template
   for sub-surface 4.
8. `packages/eth/src/` — locate the block / receipt schemas
   that `OpBlockSchema` will extend in sub-surface 7.
9. `packages/op/COMPARISON.md` — rewritten by sub-surface 10.

---

## Resume pointer

**Status:** 🟢 PR1 + PR2 + PR3 + PR4 + PR5 landed. Plan
complete. The `op_completeness_pass` phase closes here.

**What landed in PR5 (S10).** `packages/op/COMPARISON.md`
refreshed end-to-end:
- §Scope rewritten — full-package scoring (bridge + op-node
  RPC + predeploys + per-chain deploys + gas).
- §2 "Derive L2 tx hash from L1 receipt" flipped to ✅
  naming `derive_l2_tx_hashes_from_l1_receipt`.
- §9 renamed to "Comparator surfaces Ethernauta
  intentionally omits"; former §9.1 removed (closed by S6),
  former §9.2 / §9.3 reframed as design choices with
  explicit reasoning.
- New §10 added: 10.1 op-node RPC (5 methods), 10.2
  predeploys (18 vendored, addresses listed,
  L2ToL1MessagePasser bridge-resident note), 10.3 per-chain
  deploys (11 chains, 4 deferred per NOTES §7), 10.4 gas
  estimation (with explicit `estimateContract*`
  sugar-over-sugar note).
- §11 "Suggested Order of Operations" — bullet 1 split into
  ✅/⏸️ items reflecting S6 + S8 + S9 closure.
- §Gap Reading shortened to the two remaining entries.

**Historical context preserved below** — the original
"What's next" notes from before PR5 landed:

- Start PR5 — S10 (`COMPARISON.md` refresh).
The whole feature pipeline is done; PR5 documents the final
delta. Per D10-1..D10-5:
- **§Scope.** Rewrite to reflect the doc now scores the full
  package (bridge + op-node RPC + predeploys + per-chain
  deploys + gas), not just bridge.
- **§2.** Flip "Derive L2 tx hash from L1 receipt" to ✅ —
  closed by PR4 / S6 / `derive_l2_tx_hashes_from_l1_receipt`.
- **§9.1.** Remove. (Closed by S6.)
- **§9.2 / §9.3.** Reframe as design choices, not gaps.
- **§10 new.** "Beyond-bridge coverage" — op-node RPC (5
  methods), predeploys (18 vendored), per-chain deploys (11
  chains — 6 from phase 02 + 5 from PR3, not 15 — see PR3
  decisions), gas estimation (`estimate_op_fees` +
  `estimate_op_fees_upper_bound` + `estimate_l1_fee`).
- **§11 Suggested Order of Operations.** Mark bullet 1
  ("hold OP UX-helper additions") partially closed (§9.1 +
  S8 operator-fee + S9 upper-bound).
- **Deferred chains tracking.** PR3 deferred Base / Base
  Sepolia (registry-membership work, Deferral A in
  `NOTES.md` §7) and Fraxtal / Redstone
  (`OpDeploysSchema` loosening, Deferral B). PR5's §10
  should note these as tracked-but-not-landed so the
  "chain coverage expansion" sub-surface doesn't read as
  finished.
**PR4 decisions made (carry into PR5).**
- **DepositTx field naming is snake_case.** Schema fields
  (`source_hash`, `is_system_tx`) match the rest of
  `@ethernauta/op`'s internal-value schemas. Wire-shape
  schemas (`OpBlockSchema`, `OpReceiptInfoSchema`,
  `OpDepositTxInfoSchema`) stay camelCase to mirror the
  JSON-RPC payload op-geth emits.
- **`compute_l2_deposit_tx_hash` survived the refactor.**
  It's now a thin wrapper composing the new primitives
  (`compute_deposit_source_hash` + opaque-data slice +
  `encode_deposit_tx` + keccak). Existing call sites in
  `bridge/get-status.ts` and `get-status.test.ts` were not
  touched.
- **`derive_l2_tx_hashes_from_l1_receipt({ l1_receipt }) →
  Hash32[]`** takes the receipt only — no portal-address
  filter. Topic0 of `TransactionDeposited` is the
  discriminator. Matches viem's `getL2TransactionHashes`
  shape. Callers that need address-scoping pre-filter
  `l1_receipt.logs` before invoking.
- **`OpTransactionInfoSchema = union([OpDepositTxInfoSchema,
  TransactionInfoSchema])` is order-sensitive.** The
  deposit-tx branch is tried first; `sourceHash` + `mint`
  are required fields on it so non-deposit txs reject and
  fall through to the base.
- **`OpBlockSchema` duplicates the base block field list.**
  valibot `intersect` would collapse the deposit-tx branch
  of the `transactions` union (the OP union is a superset
  of the base info schema). When `BlockSchema` drifts in
  `@ethernauta/eth`, `op-block.ts` needs the same drift
  applied — replay tests catch it indirectly.
- **`OpReceiptInfoSchema = intersect([ReceiptInfoSchema,
  object({ depositNonce, depositReceiptVersion })])`.** Both
  OP extras stay optional — regular-tx receipts don't carry
  them.
- **`estimate_op_fees_upper_bound` is 2-call (1559 fees + L1
  upper bound), not 4.** Operator-fee is intentionally
  omitted — Isthmus detection is a separate eth_call that
  would defeat the 1-RPC pre-sign semantic, and the
  upper-bound contract only covers L1 data.
- **D5-5 / D6-5 / D7-5 "real mainnet fixture" suggestions
  deferred.** Synthetic fixtures cover the same surface
  cheaply and reproducibly without RPC access. Promote if
  needed.
- **The two methods in `@ethernauta/op/methods` share names
  with `@ethernauta/eth`.** `eth_getBlockByNumber` and
  `eth_getTransactionReceipt`. Per D7-2 the package subpath
  is the discriminator; a dapp importing both versions in
  different files sees different inferred return types,
  which is the documented behavior. `packages/op/README.md`
  should call this out in a future doc pass.

**PR3 decisions made (carry into PR4-PR5).**
- **S3 ships 5 of the originally-scoped 9 chains.** Lisk
  (1135), Ink (57073), Unichain (130), Cyber (7560), BOB
  (60808). Total per-chain deploys after PR3 = 11 (6 from
  phase 02 + 5 from PR3). `COMPARISON.md` §10 in PR5 should
  reflect 11, not 15.
- **4 chains deferred to a follow-up.** Base (8453) + Base
  Sepolia (84532) need a second source path because they
  aren't Superchain-Registry members. Fraxtal (252) +
  Redstone (690) need an `OpDeploysSchema` loosening pass
  because they run pre-fault-proof OP stack with
  `L2OutputOracleProxy` in place of the modern fault-proof
  contract set. Full deferred-design tracking in
  `tmp/plans/op_completeness_pass/NOTES.md` §7 (Deferral A /
  Deferral B / tracking table).
- **The deferral splits naturally into its own future
  sub-surface.** PR5's COMPARISON refresh should note that
  the 4 deferred chains are tracked but not landed; the
  "Chain coverage expansion" sub-surface stays open with a
  clear scope until that follow-up lands.
- **S4 shape.** `SafeHeadAtL1Block = { l1Block, safeHead }`
  where each is `BlockID = { hash, number }` (NOT `BlockRef`
  — the README's D4-2 said `BlockRef` but the Go source is
  `BlockID`; corrected at impl time). Method binding
  positional-or-object parameter form matches
  `optimism_outputAtBlock` exactly. Schema reuses
  `L1OriginSchema` (structurally identical to `BlockID` per
  `op-service/eth/id.go`).

**PR2 decisions made (carry into PR3-PR5).**
- `forge-from-github` mode validated end-to-end against 10 OP
  predeploys + 2 EAS contracts in PR2. The recipe schema gained
  `libs` (per-recipe lib tarballs into `<project>/lib/<dest>/`)
  and `remappings` (verbatim foundry remap list); the throwaway
  `oz_pin` scalar from S1 is gone.
- GitHub repo tarballs ship empty submodule placeholders under
  `lib/`. The script rms each placeholder before extracting the
  pinned lib tarball — easy to miss if a future recipe adds a
  lib that needs a different layout.
- OP's `src/libraries/Predeploys.sol` imports from
  `scripts/libraries/Config.sol`, so the scripts/ tree can't be
  trimmed before `forge inspect`. test/ is trimmed.
- WETH9 was renamed `WETH` at `op-contracts/v6.0.0`. Folder is
  `predeploys/weth/`, constant is `WETH_ADDRESS`. Documented in
  `predeploys/SOURCES.md`.
- `EAS.eip712Domain` is skipped by the codegen (`bytes1` type
  unhandled). Same skip as the snapshot path. Out of scope to
  fix until a consumer needs the binding.
- `predeploys/index.ts` is an 18-entry address-only barrel.
  Methods import via subpath: `@ethernauta/op/predeploys/<kebab>`.

**Suggested first action for a fresh session.** Per R4:
`git log --oneline -20` to confirm PR4 landed. Then open
`packages/op/COMPARISON.md` and read §2 + §9 end-to-end —
those are the sections PR5 / S10 mutates. Cross-check
against D10-2 (flip §2 deposit-row), D10-3 (rewrite §9.1/
§9.2/§9.3), D10-4 (new §10 covering op-node RPC, predeploys,
per-chain deploys, gas estimation), D10-5 (Suggested Order
of Operations partial-close). Then survey the freshly
landed PR4 surface — `git diff main..HEAD --
packages/op/src` — so the COMPARISON entries describe the
real call shapes that shipped, not the design-doc
abstractions.

## Implementation log

Filled in as PRs land. Mirrors the
`02_op_package/README.md` and `03_arbitrum_package/README.md`
"Slice X — what landed" / "Verified" structure, retuned to
per-PR rather than per-slice.

Entry template:

```markdown
### PR<N> — <one-line summary> (<commit-sha>)

**What landed.** 2-3 sentences.

**Decisions made.** Bulleted list; each is one line.

**Verified.**
- `pnpm --filter @ethernauta/op test:unit` — N tests passing.
- `pnpm --filter @ethernauta/op typecheck` — clean.
- `biome check packages/op` — clean.
- `scripts/no-escape-hatches.sh` — at baseline.
- (Any manual smoke run.)

**Deferred.** Anything carried into a later PR.
```
