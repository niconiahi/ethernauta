# zkSync bridge ABI sources

Bridge ABIs in this directory are vendored from matter-labs
GitHub release tarballs at a pinned tag. Do not edit the
`*.abi.json` files by hand — re-run the vendoring script to
bump.

## Pinned upstream

| Source | Tag |
|---|---|
| [`matter-labs/era-contracts`](https://github.com/matter-labs/era-contracts) | `v0.29.2` |

The pin lives at the top of
[`packages/zksync/scripts/pull-contracts.ts`](../../scripts/pull-contracts.ts)
as `ZKSYNC_ERA_CONTRACTS_TAG`. Keep this file in lockstep with
the constant there.

`v0.29.2` is the latest non-`zkos-*` matter-labs tag matching
the era-contracts core protocol stream that Era mainnet
(`eip155:324`) and Era Sepolia (`eip155:300`) currently run.
The `zkos-*` tags are a separate experimental track (zkOS) and
are not the canonical production stream — they are deliberately
avoided here.

## Per-file mapping

Every release ships pre-compiled foundry artifacts as the asset
`l1-contracts.tar.gz` (plus `system-contracts.tar.gz` /
`l2-contracts.tar.gz` for L2 contracts not consumed by this
slice). Each tarball contains
`./<workspace>/out/<Pascal>.sol/<Pascal>.json` hardhat-shape
artifacts whose `abi` field matches Ethernauta's
`DescriptionSchema`.

| Folder | Tarball | Path inside tarball |
|---|---|---|
| `bridgehub/Bridgehub.abi.json` | `l1-contracts.tar.gz` | `./l1-contracts/out/Bridgehub.sol/Bridgehub.json` |
| `l1-nullifier/L1Nullifier.abi.json` | `l1-contracts.tar.gz` | `./l1-contracts/out/L1Nullifier.sol/L1Nullifier.json` |
| `l1-asset-router/L1AssetRouter.abi.json` | `l1-contracts.tar.gz` | `./l1-contracts/out/L1AssetRouter.sol/L1AssetRouter.json` |

Tarball URL template:
`https://github.com/matter-labs/era-contracts/releases/download/${TAG}/${workspace}.tar.gz`.

## What lives here

L1 contracts that bridge verbs in
`packages/zksync/src/bridge/*.ts` compose:

- **`Bridgehub`** — L1 entrypoint for cross-chain transactions
  on every hyperchain that registers with the chain-type
  manager (`requestL2TransactionDirect`,
  `requestL2TransactionTwoBridges`, `l2TransactionBaseCost`).
- **`L1Nullifier`** — withdrawal + failed-deposit redemption
  on L1 post-v26 (`finalizeDeposit`, `claimFailedDeposit`,
  `isWithdrawalFinalized`). Naming convention is preserved
  upstream: post-v26 era-contracts treats every L2→L1 unlock
  as the L1-side completion of a prior deposit/withdrawal
  pair, so the redemption entrypoint is `finalizeDeposit`
  even for withdrawals.
- **`L1AssetRouter`** — deposit-routing for ERC-20 tokens
  (`bridgehubDeposit`, `bridgehubDepositBaseToken`,
  `getDepositCalldata`). Consumed by slice 4b's `send_erc20`
  for composing the `secondBridgeCalldata` payload of the
  "two bridges" pattern.

Slice 4a ships `send_eth` (`Bridgehub.requestL2TransactionDirect`)
only. Slices 4b / 4c extend the verb surface against the
remaining contracts.

### Why a GitHub release tarball (not the npm registry)

matter-labs does not publish a unified npm package that bundles
the L1 bridge ABIs in a single tarball — the npm-published
`@matterlabs/era-contracts` ecosystem is split across many
packages with separate cadences. GitHub releases ship every
workspace tarball (`l1-contracts.tar.gz`,
`system-contracts.tar.gz`, `l2-contracts.tar.gz`) atomically
per release tag, which gives a cleaner pin and avoids npm
publishing cadence questions.

The npm-package vs GitHub-release decision is also why slice
4a's `pull-contracts.ts` uses `vendor_github_artifact`
(streaming tar extraction over an HTTPS download) instead of
the `vendor_npm_artifact` shape arbitrum 3a established. The
core mechanic — fetch tarball, `tar -xzO` the named entry,
parse as hardhat artifact, write the bare ABI array — is
identical; only the URL template differs.

## Bump cadence

- Refresh on every new non-`zkos-*` matter-labs release that
  ships a Bridgehub / L1Nullifier / L1AssetRouter surface
  change.
- Never track a `zkos-*` tag — those are the experimental
  zkOS track and do not match what production Era runs.
- Never track an unreleased SHA — the pin must be a release
  tag whose asset tarballs exist on the GitHub releases page.

## How to bump

1. Pick the new target tag from the [releases page](https://github.com/matter-labs/era-contracts/releases)
   (non-`zkos-*` only).
2. Update `ZKSYNC_ERA_CONTRACTS_TAG` at the top of
   [`packages/zksync/scripts/pull-contracts.ts`](../../scripts/pull-contracts.ts).
3. Update the **Pinned upstream** table in this file.
4. Run `pnpm --filter @ethernauta/zksync pull-contracts` to
   rewrite the `*.abi.json` files (the cached `/tmp` tarball
   key includes the tag, so the bump force-refetches).
5. Run `pnpm regen` to regenerate the `methods/` folders.
6. Run the verification chain
   (`pnpm --filter @ethernauta/zksync typecheck build test:unit lint`,
   plus `pnpm lint:ratchet`).

## Links of interest

- [zkSync L1 ↔ L2 messaging](https://docs.zksync.io/zksync-protocol/contracts/handling-l1-l2-ops)
- [`Bridgehub.sol`](https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridgehub/Bridgehub.sol)
- [`L1Nullifier.sol`](https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/L1Nullifier.sol)
- [`L1AssetRouter.sol`](https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/asset-router/L1AssetRouter.sol)
