# OP Stack bridge ABI sources

Bridge ABIs in this directory are vendored from
[`ethereum-optimism/optimism`](https://github.com/ethereum-optimism/optimism)
at a pinned commit. Do not edit the `*.abi.json` files by hand —
re-run the vendoring script to bump.

## Pinned upstream

| Field   | Value |
|---------|-------|
| Tag     | `op-contracts/v6.0.0` |
| SHA     | `018f5ae926ec3277746b56a1c4ddb715c568603d` |
| Path    | `packages/contracts-bedrock/snapshots/abi/<Name>.json` |

The pin lives at the top of
[`packages/op/scripts/pull-contracts.ts`](../../scripts/pull-contracts.ts).
Keep this file in lockstep with the constants there and with
`packages/op/src/predeploys/SOURCES.md` (same upstream).

## Per-file mapping

| Folder | Upstream snapshot |
|---|---|
| `l1-standard-bridge/L1StandardBridge.abi.json` | `snapshots/abi/L1StandardBridge.json` |

## What lives here

L1-side contracts that bridge verbs in
`packages/op/src/bridge/*.ts` compose. The L2-side counterparts
(`L2StandardBridge`, `L2CrossDomainMessenger`, …) live under
`packages/op/src/predeploys/` since they are predeployed at
canonical L2 addresses.

Slice 1 ships `L1StandardBridge` only — the `send_eth` verb's
single dependency. Slice 2 extends the recipe list with
`OptimismPortal`, `L2OutputOracle`, and `L2ToL1MessagePasser`
to cover the rest of the deposit family + the full withdraw
flow.

## Bump cadence

- Refresh on every new `op-contracts/vN.0.0` **stable** release (release
  candidates do not qualify). Typically quarterly.
- Refresh on demand when a consumer needs a method that only
  exists past the current pin.
- Never track a branch (e.g. `develop`). The pin is always a commit SHA.

## How to bump

1. Pick the new target tag from
   [`ethereum-optimism/optimism` releases](https://github.com/ethereum-optimism/optimism/tags)
   (`op-contracts/vN.0.0` form, stable only).
2. Resolve the tag to a commit SHA:
   `gh api repos/ethereum-optimism/optimism/git/refs/tags/op-contracts/vN.0.0`
   (annotated tags need one more hop through `git/tags/<sha>`).
3. Update `OP_CONTRACTS_VERSION` + `OP_CONTRACTS_SHA` at the top of
   `packages/op/scripts/pull-contracts.ts`.
4. Update the **Pinned upstream** table in this file **and** in
   `packages/op/src/predeploys/SOURCES.md` — they share the pin.
5. Run `pnpm --filter @ethernauta/op pull-contracts` to rewrite the
   `*.abi.json` files.
6. Run `pnpm regen` to regenerate the `methods/` folders.
7. Run the verification chain
   (`pnpm --filter @ethernauta/op typecheck build test:unit lint`,
   plus `pnpm lint:ratchet`).

## Links of interest

- [`contracts-bedrock/snapshots/abi/`](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock/snapshots/abi) (latest)
- [`contracts-bedrock/src/L1/`](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock/src/L1) — Solidity source
- [OP Stack bridge spec](https://specs.optimism.io/protocol/bridges.html)
