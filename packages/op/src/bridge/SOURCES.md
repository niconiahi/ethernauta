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
| `optimism-portal/OptimismPortal2.abi.json` | `snapshots/abi/OptimismPortal2.json` |
| `dispute-game-factory/DisputeGameFactory.abi.json` | `snapshots/abi/DisputeGameFactory.json` |
| `fault-dispute-game/FaultDisputeGame.abi.json` | `snapshots/abi/FaultDisputeGame.json` |
| `anchor-state-registry/AnchorStateRegistry.abi.json` | `snapshots/abi/AnchorStateRegistry.json` |
| `l2-to-l1-message-passer/L2ToL1MessagePasser.abi.json` | `snapshots/abi/L2ToL1MessagePasser.json` |

## What lives here

L1-side contracts that bridge verbs in
`packages/op/src/bridge/*.ts` compose, plus the
`L2ToL1MessagePasser` L2 predeploy. The predeploy lives here
(rather than under `packages/op/src/predeploys/` alongside
`L2StandardBridge` / `L2CrossDomainMessenger`) because every
binding it exposes is bridge-scoped — `initiateWithdrawal`,
`sentMessages`, `messageNonce` — and the withdraw verbs
compose it directly with the L1 portal / dispute-game
contracts. Keeping the bridge subdir self-contained makes
the withdrawal flow auditable without cross-folder jumps.

Slice 1 ships `L1StandardBridge` only — the `send_eth` verb's
single dependency. Slice 2 extends the recipe list with the
fault-proofs L1 contract set (`OptimismPortal2`,
`DisputeGameFactory`, `FaultDisputeGame`,
`AnchorStateRegistry`) plus `L2ToL1MessagePasser` to cover
the rest of the deposit family + the full withdraw flow.

### Fault-proofs note

OP Sepolia and OP Mainnet are both live on fault proofs as
of `op-contracts/v3.0.0` and `v6.0.0` respectively. The
pre-fault-proofs `L2OutputOracle` is **no longer deployed**
— the dispute-game family
(`DisputeGameFactory` + `FaultDisputeGame` +
`AnchorStateRegistry`) replaces it. The canonical
`OptimismPortal` proxy address stays stable; what changes is
the impl behind it (`OptimismPortal2`) and the prove call
(`proveWithdrawalTransaction` now takes a
`_disputeGameIndex` instead of an `_l2OutputIndex`). We
vendor the impl ABI under `optimism-portal/` and refer to
the proxy by its canonical "OptimismPortal" name in
`address.ts` and docs.

`FaultDisputeGame` is vendored as the read-side shape for
the picked game proxy. Sibling game types
(`PermissionedDisputeGame`, the Succinct variants) expose
the same `status` / `createdAt` / `resolvedAt` / `rootClaim`
/ `l2BlockNumber` / `wasRespectedGameTypeWhenCreated`
selectors that the OP bridge verbs read, so the shared shape
is sufficient. We do not vendor each variant.

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
