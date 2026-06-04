# Notes — useful for the other rollups' plans

Cross-cutting observations from PR2's `forge-from-github` work
that should carry into any future Arbitrum / zkSync plan that
considers a sourcing migration or contract sweep.

## 1. Where each rollup keeps its ABIs (and sources)

Two axes matter when picking a vendoring strategy: is the
**pre-compiled ABI JSON** in git at a stable path, and are the
**`.sol` sources** in git?

| Repo | Pinned ref (probed) | `.abi.json` committed? | `.sol` committed? |
|---|---|---|---|
| `ethereum-optimism/optimism` | `op-contracts/v6.0.0` | **Yes** — 98 files at `packages/contracts-bedrock/snapshots/abi/<Pascal>.json` | 526 total, 499 under `contracts-bedrock/` |
| `OffchainLabs/nitro-contracts` | `v3.2.0` | **No** (0 in tree, 378 entries scanned) | 190 (under `src/**`) |
| `OffchainLabs/nitro-precompile-interfaces` | `f49a4889…` | **No** | 17 (flat repo root) |
| `OffchainLabs/token-bridge-contracts` | `v1.2.5` | **No** (0 in tree, 297 entries scanned) | 104 (under `contracts/**`) |
| `matter-labs/era-contracts` | `v0.29.2` | **Effectively no** — only 2 one-off snapshots (`l1-contracts/snapshots/Executor.json`, `l1-contracts/scripts/abi/TestnetProtocolUpgradeHandler.json`); not a comprehensive surface | 620 across 5 workspaces (`l1-contracts/`, `l2-contracts/`, `system-contracts/`, `da-contracts/`, `gas-bound-caller/`) |

### Pattern

- **Pre-compiled ABI in git → OP-only.** Nobody else snapshots
  ABIs in-tree at a comprehensive, stable path.
- **`.sol` source in git → universal.** All three rollups make
  their full source tree available. Whatever the distribution
  story for ABIs (npm, release tarballs), the underlying source
  is reachable through the standard `git` interface and the
  GitHub tarball endpoint
  (`https://codeload.github.com/<repo>/tar.gz/<ref>`).

### Implication

The `forge-from-github` mode we built in
`packages/op/scripts/pull-contracts.ts` is conceptually portable
to all three rollups — it just needs the right `OP_WORKSPACE` /
`EAS_WORKSPACE`-shaped config (libs + remappings + `src_dir`)
per workspace.

Arbitrum already does this for the 17 precompiles via
`packages/arbitrum/scripts/pull-contracts.ts` (the
`forge inspect` + flat `nitro-precompile-interfaces/<Pascal>.sol`
pattern). For Arbitrum bridge contracts and zkSync workspaces we
currently take the **tarball-of-published-artifacts shortcut**
purely as an efficiency choice — not because the sources aren't
available. Promoting them to forge-from-github would work; we
just don't gain anything until/unless those publishers stop
shipping pre-compiled artifacts.

## 2. Distribution paths we currently consume

When `.abi.json` isn't in git, we either reach for the upstream
publisher's compiled artifacts, or we compile from source
ourselves. Today:

| Package script | Source mode | Distribution mechanism | Artifact path inside |
|---|---|---|---|
| `packages/op/scripts/pull-contracts.ts` | `snapshot-json` | Raw GitHub | `packages/contracts-bedrock/snapshots/abi/<Pascal>.json` |
| `packages/op/scripts/pull-contracts.ts` | `forge-from-github` (PR2) | GitHub tarball + foundry workspace + `forge inspect` | n/a (compiled in temp workspace) |
| `packages/arbitrum/scripts/pull-contracts.ts` | precompile flat `.sol` | Raw GitHub + foundry temp workspace | `nitro-precompile-interfaces/<Pascal>.sol` |
| `packages/arbitrum/scripts/pull-contracts.ts` | bridge npm tarballs | `https://registry.npmjs.org/<pkg>/-/<pkg>-<v>.tgz` | `package/build/contracts/<path>/<Contract>.json` (hardhat artifact, `abi` field) |
| `packages/zksync/scripts/pull-contracts.ts` | GitHub release tarballs | GitHub release assets (`l1-contracts.tar.gz`, `l2-contracts.tar.gz`, `system-contracts.tar.gz`) | `<workspace>/out/<Contract>.sol/<Contract>.json` (foundry artifact, `abi` field) |

Sizes (so a future plan can budget bandwidth):
- zkSync release assets at `v0.29.2`: `l1-contracts.tar.gz` 48
  MB, `l2-contracts.tar.gz` 8 MB, `system-contracts.tar.gz` 71
  MB.
- OP `forge-from-github` workspace (PR2): one OP repo tarball
  (~20 MB) + 10 lib tarballs (OZ x3, solady x2, solmate,
  forge-std, lib-keccak, safe, kontrol). One workspace shared
  across all OP recipes via `(repo, ref)` memoization.

## 3. ABI vs bytecode — only ABI matters

Ethernauta consumes the ABI exclusively (description of the
contract's interface — enough to encode a call, decode a return,
decode an event). Bytecode would be needed for: deploying the
contract ourselves, verifying on-chain bytecode at a known
address against source, or predicting a CREATE2 address. None of
these are in scope for the library today.

Consequence: **ABI is compile-target-independent.** The same
`.sol` file produces the same ABI whether compiled by stock
solc, by `zksolc` (matter-labs), or anything else — the type
information is identical. Bytecode is compile-target-specific.

This means `forge inspect <ContractRef> abi --json` is the
universal extractor, even for zkSync system contracts that
ultimately ship as zkEVM bytecode. We don't need
`era-compiler-solidity` / `zksolc` for any of our work as long
as we stay in ABI-land. The one caveat that would force a
different tool is bytecode work, which is out of scope.

## 4. Gotchas surfaced during PR2 (apply to any forge-from-github)

These bit us during the OP sweep; bake them into any future
recipe-driven sourcing script.

- **GitHub tarballs ship empty submodule placeholders.** A
  repo with git submodules under `lib/` will tarball the
  *placeholder dirs* (empty), not the submodule contents.
  Code that `existsSync(lib_path)` skips re-extracting will
  silently leave libs empty and produce confusing "file not
  found" errors downstream. Fix: `rmSync` the placeholder
  before extracting the pinned lib tarball.
- **Trimming script/test dirs can break the build.** OP's
  `src/libraries/Predeploys.sol` imports from
  `scripts/libraries/Config.sol`, so trimming `scripts/` to
  speed compile breaks the graph. `test/` is safe to drop.
  Other rollups likely have analogous one-way cross-tree
  imports; default to "keep everything except `test/`" until
  proven otherwise.
- **Foundry's `solc` setting is optional.** When omitted,
  foundry auto-resolves per-file pragma. OP mixes `0.8.15`
  (legacy + L2) and `0.8.25` (newer FeeVault, etc.) across
  the predeploy set; setting a single `solc` would fail one
  side or the other. Recipes only set `solc` when the
  upstream's own `foundry.toml` does (EAS pins `0.8.28`).
- **Lib install via tarball, not `forge install`.** `forge
  install` requires a git repo (or `--no-git`) and is slow per
  lib. Fetching the lib's GitHub archive tarball
  (`https://codeload.github.com/<repo>/tar.gz/<ref>`) and
  extracting it into `<project>/lib/<dest>/` is faster,
  dependency-free, and works the same way foundry expects.
- **Two pins of the same upstream repo coexist via `dest`.**
  OP's foundry config has `openzeppelin-contracts` AND
  `openzeppelin-contracts-v5` (both pointing at
  `OpenZeppelin/openzeppelin-contracts` at different SHAs). The
  recipe schema's `lib.dest` field handles this — the folder
  under `lib/` is named by `dest`, not by the last segment of
  `repo`.
- **`contract_ref` over bare name.** `forge inspect <Pascal>`
  errors on collisions (e.g. OZ also has `ProxyAdmin`).
  Path-qualified `forge inspect <path>:<Pascal>` is safer and
  is what the recipe's `contract_ref` field is for.
- **Recipe schema uses Valibot per CLAUDE.md hard rule 1.**
  Sub-types like `ForgeLib` need their own
  `<Foo>Schema = object({...})` + `type Foo =
  InferOutput<typeof FooSchema>`. Hand-rolling
  `type Foo = { ... }` trips the `object_type` ratchet
  (hard-zero) and gets flagged by `scripts/no-escape-hatches.sh`.

## 5. Decision flowchart for a future plan ("what mode should
this rollup use?")

```
Does the upstream publish a comprehensive ABI snapshot in git?
  └─ YES → `snapshot-json` mode. Cheap, no foundry needed.
      (OP at v6.0.0 is the only known example.)

  └─ NO. Does the upstream publish compiled artifacts as
        release assets / npm packages?
      └─ YES → tarball-extract mode (zkSync GitHub releases,
                  Arbitrum npm tarballs). Fast; one HTTP fetch
                  per archive.

      └─ NO → `forge-from-github` mode. Pull the repo tarball,
                 install pinned libs into `lib/<dest>/`, mirror
                 their foundry config, `forge inspect
                 <path>:<Pascal>`.
```

The current ethernauta scripts already implement all three
modes — one per rollup. A future "make all three pull-contracts
scripts share a generic recipe runtime" plan would be the next
natural consolidation, but only worth it if a fourth rollup
joins.

## 6. Cross-rollup repo pin discovery (recipe-for-recipes)

When bumping any of the three rollups, the submodule / lib pin
set has to be re-harvested. Universal recipe:

```bash
SHA=<repo SHA>
curl -s \
  "https://api.github.com/repos/<owner>/<repo>/contents/<lib-dir>?ref=$SHA" \
  | python3 -c "
import sys,json
[print(e['name'], e['sha']) for e in json.load(sys.stdin) if e['type'] == 'submodule']
"
```

Used in PR2 to harvest OP's 10 submodule pins. Should work
identically against Arbitrum's `nitro-contracts/lib/` or
zkSync's per-workspace `lib/` folders.

## 7. Chain coverage — PR3 deferrals

PR3 originally scoped 9 new chains under sub-surface S3
(Base 8453, Base Sepolia 84532, Lisk 1135, Fraxtal 252,
Ink 57073, Unichain 130, Cyber 7560, Redstone 690, BOB 60808).
At impl time 4 of the 9 fell out for two distinct reasons.
PR3 shipped the 5 chains that work end-to-end against the
existing `OpDeploysSchema` (Lisk, Ink, Unichain, Cyber, BOB)
and deferred the other 4 with the breakdown below.

### Deferral A — Base + Base Sepolia (registry membership)

**What.** Base and Base Sepolia are not Superchain-Registry
members. They have no entries in
`superchain/configs/{mainnet,sepolia}/*.toml` and no entries
in the autogenerated `superchain/extra/addresses/addresses.json`
that our pull script reads. This is the upstream design — Base
publishes addresses through its own channels — and was already
called out in the original `packages/op/src/deploys/SOURCES.md`
"Why Base is absent" section before this phase.

**Where Base does publish.** `github.com/base/docs` at
`docs/base-chain/network-information/base-contracts.mdx` — a
markdown source-of-truth, machine-readable enough to scrape.
Lists L2 predeploys + L1 contracts for both mainnet and
sepolia + the admin roles.

**What's missing for a clean schema fit.** The Base markdown
covers 8 of the 15 `OpContractsSchema` required-field names
directly. Gaps:

- Schema field uses `Proxy`-suffixed names
  (`L1CrossDomainMessengerProxy`,
  `L1StandardBridgeProxy`, `OptimismPortalProxy`,
  `OptimismMintableERC20FactoryProxy`, `SystemConfigProxy`,
  `L1ERC721BridgeProxy`); Base docs strip the suffix. Plain
  name-normalization handles this.
- Schema requires `AnchorStateRegistryProxy` and
  `DelayedWETHProxy`; Base mainnet docs don't list them
  (Base Sepolia docs do). They'd need to be sourced from
  Etherscan or by reading the FaultDisputeGame state.
- Schema requires `MIPS`, `PermissionedDisputeGame`,
  `PreimageOracle`; Base mainnet docs only list these for
  Sepolia, not mainnet. Mainnet uses a TEE-based proving
  system + ZK verifier + Multiproof contracts that aren't
  in the current schema at all.
- Schema requires `SuperchainConfig`; Base doesn't deploy
  one (consequence of not being a Superchain member).
- Schema requires `UnsafeBlockSigner` role; Base docs don't
  list it.

**Smallest implementation that ships Base.** Add a second
source mode to `pull-superchain-registry.ts` (or a sibling
script `pull-base-deploys.ts`), hand-write a mdx → schema
mapping table, source the missing addresses from on-chain
reads against the `DisputeGameFactoryProxy` state where
applicable, and loosen the schema's `SuperchainConfig` field
to `optional()`. Possibly add a `proving_kind: literal("zk" |
"fault-proof")` discriminator if we want Base's TEE/ZK
verifier addresses surfaced.

### Deferral B — Fraxtal + Redstone (pre-fault-proof)

**What.** Both chains are in upstream `addresses.json` and
both have entries the script wrote successfully — but the
resulting `eip155-252.ts` / `eip155-690.ts` files would
throw at parse time. Both run the pre-fault-proof OP stack
where the rollup is anchored by an `L2OutputOracle` instead
of a `DisputeGameFactory`.

Fraxtal (252) entry from upstream:

```
contracts: { AddressManager, L1CrossDomainMessengerProxy,
             L1ERC721BridgeProxy, L1StandardBridgeProxy,
             L2OutputOracleProxy,                              // legacy
             OptimismMintableERC20FactoryProxy,
             OptimismPortalProxy, ProxyAdmin,
             SuperchainConfig, SystemConfigProxy }
roles: { BatchSubmitter, Guardian, Proposer, ProxyAdminOwner,
         SystemConfigOwner, UnsafeBlockSigner }                // no Challenger
```

Missing required contracts: `AnchorStateRegistryProxy`,
`DelayedWETHProxy`, `DisputeGameFactoryProxy`, `MIPS`,
`PermissionedDisputeGame`, `PreimageOracle`. Missing role:
`Challenger`. Extra field the schema doesn't know about:
`L2OutputOracleProxy`.

**Smallest implementation that ships them.** Two changes:

1. Add `L2OutputOracleProxy` as `optional(AddressSchema)` to
   `OpContractsSchema`.
2. Mark all six fault-proof-era contracts as `optional()`:
   `AnchorStateRegistryProxy`, `DelayedWETHProxy`,
   `DisputeGameFactoryProxy`, `MIPS`,
   `PermissionedDisputeGame`, `PreimageOracle`. Same for
   the `Challenger` role.

That mirrors how `EthLockboxProxy` and `FaultDisputeGame` are
already optional. Once those are loose, the script's
existing pull writes both files correctly with no other
changes.

**Open design question for the follow-up.** Should every
consumer of `OpDeploys` add fault-proof-vs-output-oracle
branches at the call site (every read of
`DisputeGameFactoryProxy` becomes
`if (deploys.DisputeGameFactoryProxy) … else if (deploys.L2OutputOracleProxy) …`),
or should we instead introduce a discriminated
`OpDeploysSchema = variant("kind", [ FaultProofDeploys,
OutputOracleDeploys ])`? The variant approach is cleaner but
breaks every existing consumer. The optional-everywhere
approach keeps the existing 11 chains working unchanged but
spreads "is this a fault-proof chain?" checks across the
codebase. Resolve before landing.

### Tracking

| Chain | Reason | Smallest fix |
|---|---|---|
| Base (8453) | Not a Superchain-Registry member | Second source path + name-norm + schema loosening |
| Base Sepolia (84532) | Not a Superchain-Registry member | Same as Base mainnet |
| Fraxtal (252) | Pre-fault-proof OP stack | Schema loosening |
| Redstone (690) | Pre-fault-proof OP stack | Schema loosening |
