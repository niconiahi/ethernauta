# OP Stack L1 deploy sources

Per-chain deployment data in this directory is vendored from
[`ethereum-optimism/superchain-registry`](https://github.com/ethereum-optimism/superchain-registry)
at a pinned commit. Do not edit the `eip155-*.ts` files by hand —
re-run the vendoring script to bump.

## Pinned upstream

| Field   | Value |
|---------|-------|
| SHA     | `8b1e9dbca4dd2021a4239651ef645fbe9bc725d2` |
| Date    | 2026-05-29 |
| Path    | `superchain/extra/addresses/addresses.json` |

The pin lives at the top of
[`packages/op/scripts/pull-superchain-registry.ts`](../../scripts/pull-superchain-registry.ts).
Keep this file in lockstep with the constant there.

## Per-chain mapping

| File | Chain | chain_id | Field count |
|---|---|---|---|
| `eip155-10.ts` | OP Mainnet | 10 | 24 |
| `eip155-11155420.ts` | OP Sepolia | 11155420 | 24 |
| `eip155-480.ts` | Worldchain | 480 | 22 |
| `eip155-1868.ts` | Soneium | 1868 | 23 |
| `eip155-34443.ts` | Mode | 34443 | 22 |
| `eip155-7777777.ts` | Zora | 7777777 | 22 |

Each file is the union of two upstream-derived groupings:

- `contracts.*` — proxied implementations + singleton contracts
  on L1. Per the [Standard Rollup Charter](https://gov.optimism.io/t/season-6-draft-standard-rollup-charter/8135)
  via the registry's
  [`validation/standard/standard-versions-mainnet.toml`](https://github.com/ethereum-optimism/superchain-registry/blob/main/validation/standard/standard-versions-mainnet.toml).
- `roles.*` — EOAs / multisigs holding privileged roles. Per
  [`validation/standard/standard-config-roles-{mainnet,sepolia}.toml`](https://github.com/ethereum-optimism/superchain-registry/tree/main/validation/standard).

The split is done client-side by the pull script; upstream
`addresses.json` is a single flat record per chain.

## Two fields are optional in the schema

[`packages/op/src/core/deploys.ts`](../core/deploys.ts)
marks two contracts `optional()` with normative backing:

- **`EthLockboxProxy`** — added in `op-contracts/v6.0.0` per
  `standard-versions-mainnet.toml`. Pre-v6 chains do not deploy
  it. Currently absent on Worldchain (480), Mode (34443),
  Zora (7777777).
- **`FaultDisputeGame`** — required by the Standard Rollup
  Charter for a "standard chain" but absent on chains still
  running permissioned-only dispute games (pre-graduation from
  `PermissionedDisputeGame`). Currently present only on OP
  Mainnet (10) and OP Sepolia (11155420).

Every other field in the schema is required for every chain we
ship and the `parse(OpDeploysSchema, …)` call at the top of
each `eip155-*.ts` enforces it.

## Why Base is absent

Base (8453) and Base Sepolia (84532) are not Superchain members
in the registry's strict sense and do not appear in
`addresses.json`. They will land in a future bump once a
secondary source is wired in.

## Bump cadence

- On demand. The superchain-registry doesn't follow a tagged
  release cadence — pin to a `main` commit chosen at refresh
  time.
- Refresh when:
  - Adding a new chain to `CHAIN_IDS` in the pull script.
  - An upstream deployment changes for a chain we already ship
    (e.g. a contract gets re-upgraded).
  - A new contract field appears in upstream that the schema
    needs to surface (requires both `OpDeploysSchema` and
    `ROLE_FIELDS` updates).

## How to bump

1. Pick a recent commit from
   [`ethereum-optimism/superchain-registry`](https://github.com/ethereum-optimism/superchain-registry).
   `gh api repos/ethereum-optimism/superchain-registry/commits/main --jq '.sha'`
   gives the current tip.
2. Update `REGISTRY_SHA` at the top of
   `packages/op/scripts/pull-superchain-registry.ts`.
3. Update the **Pinned upstream** table in this file.
4. Run
   `pnpm --filter @ethernauta/op pull-superchain-registry`
   to rewrite the `eip155-*.ts` files.
5. Run the verification chain
   (`pnpm --filter @ethernauta/op typecheck build test:unit lint`,
   plus `pnpm lint:ratchet`).
6. If upstream surfaces a new field, update
   `packages/op/src/core/deploys.ts` (and `ROLE_FIELDS` in
   the script if it's a role).

## Links of interest

- [Standard Rollup Charter (Season 6)](https://gov.optimism.io/t/season-6-draft-standard-rollup-charter/8135)
- [`validation/standard/standard-versions-mainnet.toml`](https://github.com/ethereum-optimism/superchain-registry/blob/main/validation/standard/standard-versions-mainnet.toml)
- [`validation/standard/standard-config-roles-mainnet.toml`](https://github.com/ethereum-optimism/superchain-registry/blob/main/validation/standard/standard-config-roles-mainnet.toml)
- [`superchain/extra/addresses/addresses.json`](https://github.com/ethereum-optimism/superchain-registry/blob/main/superchain/extra/addresses/addresses.json) — latest
