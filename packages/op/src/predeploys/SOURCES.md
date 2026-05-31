# OP Stack predeploy ABI sources

Predeploy ABIs in this directory are vendored from
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
Keep this file in lockstep with the constants there.

## Per-file mapping

| Folder | Upstream snapshot |
|---|---|
| `gas-price-oracle/GasPriceOracle.abi.json` | `snapshots/abi/GasPriceOracle.json` |
| `l1-block/L1Block.abi.json` | `snapshots/abi/L1Block.json` |
| `l1-fee-vault/L1FeeVault.abi.json` | `snapshots/abi/L1FeeVault.json` |
| `l2-cross-domain-messenger/L2CrossDomainMessenger.abi.json` | `snapshots/abi/L2CrossDomainMessenger.json` |
| `l2-standard-bridge/L2StandardBridge.abi.json` | `snapshots/abi/L2StandardBridge.json` — **subset** |
| `sequencer-fee-vault/SequencerFeeVault.abi.json` | `snapshots/abi/SequencerFeeVault.json` |

## L2StandardBridge — subset rationale

The vendored `L2StandardBridge.abi.json` only contains view-binding
functions. The bridge-state-mutating surface
(`bridgeERC20`, `bridgeERC20To`, `bridgeETH`, `bridgeETHTo`, `withdraw`,
`withdrawTo`, `finalizeBridgeERC20`, `finalizeBridgeETH`, `initialize`)
is filtered out by the allowlist in `pull-contracts.ts`.

**Why.** Issuing a withdrawal is not a single contract call — it kicks
off a multi-day, multi-step lifecycle (L2 initiate → 7-day fault
window → L1 prove → L1 finalize). We don't want to expose bare
`encode_function_call` bindings for those methods until we have the
`Bridgable<T>` shape designed: a lifecycle tracker that owns the
state machine rather than handing it to the dapp as a raw write.

**Status.** Bridge methods land with the bridge phase (originally
phase 05). When that ships, drop the `function_allowlist` entry for
`L2StandardBridge` in `pull-contracts.ts` and re-run the vendoring
script — the autogen will then emit the full ABI surface.

Kept (8 view functions):
`MESSENGER`, `OTHER_BRIDGE`, `deposits`, `l1TokenBridge`, `messenger`,
`otherBridge`, `paused`, `version`.

## Bump cadence

- Refresh on every new `op-contracts/vN.0.0` **stable** release (release
  candidates do not qualify). Typically quarterly.
- Refresh on demand when a consumer (the wallet, a dapp, a downstream
  package) needs a method that only exists past the current pin.
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
4. Update the **Pinned upstream** table in this file.
5. Run `pnpm --filter @ethernauta/op pull-contracts` to rewrite the
   `*.abi.json` files.
6. Run `pnpm regen` to regenerate the `methods/` folders.
7. Run the verification chain
   (`pnpm --filter @ethernauta/op typecheck build test:unit lint`,
   plus `pnpm lint:ratchet`).
8. If new methods appeared, surface them in `docs/op/predeploys.md`.

## Links of interest

- [Predeploys — OP Stack specs](https://specs.optimism.io/protocol/predeploys.html)
- [`contracts-bedrock/snapshots/abi/`](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock/snapshots/abi) (latest)
- [`predeploys.go`](https://github.com/ethereum-optimism/optimism/blob/develop/op-bindings/predeploys/predeploys.go) — canonical address list
- [`contracts-bedrock/src/L2/`](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock/src/L2) — Solidity source
- [Bedrock release notes](https://docs.optimism.io/builders/notices/upgrade-7-isthmus) — fork-by-fork surface changes
