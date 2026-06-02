# Arbitrum bridge ABI sources

Bridge ABIs in this directory are vendored from npm-published
hardhat-artifact tarballs at pinned versions. Do not edit the
`*.abi.json` files by hand — re-run the vendoring script to
bump.

## Pinned upstream

| Package | Version | Source |
|---|---|---|
| [`@arbitrum/nitro-contracts`](https://www.npmjs.com/package/@arbitrum/nitro-contracts) | `3.2.0` | [`OffchainLabs/nitro-contracts`](https://github.com/OffchainLabs/nitro-contracts) |
| [`@arbitrum/token-bridge-contracts`](https://www.npmjs.com/package/@arbitrum/token-bridge-contracts) | `1.2.5` | [`OffchainLabs/token-bridge-contracts`](https://github.com/OffchainLabs/token-bridge-contracts) |

The pins live at the top of
[`packages/arbitrum/scripts/pull-contracts.ts`](../../scripts/pull-contracts.ts)
as `NITRO_CONTRACTS_NPM_VERSION` and
`TOKEN_BRIDGE_CONTRACTS_NPM_VERSION`. Keep this file in lockstep
with the constants there.

## Per-file mapping

| Folder | Upstream artifact (path inside `package/`) |
|---|---|
| `inbox/Inbox.abi.json` | `@arbitrum/nitro-contracts` → `build/contracts/src/bridge/Inbox.sol/Inbox.json` |
| `outbox/Outbox.abi.json` | `@arbitrum/nitro-contracts` → `build/contracts/src/bridge/Outbox.sol/Outbox.json` |
| `l1-gateway-router/L1GatewayRouter.abi.json` | `@arbitrum/token-bridge-contracts` → `build/contracts/contracts/tokenbridge/ethereum/gateway/L1GatewayRouter.sol/L1GatewayRouter.json` |
| `l2-gateway-router/L2GatewayRouter.abi.json` | `@arbitrum/token-bridge-contracts` → `build/contracts/contracts/tokenbridge/arbitrum/gateway/L2GatewayRouter.sol/L2GatewayRouter.json` |

## What lives here

L1 + L2 contracts that bridge verbs in
`packages/arbitrum/src/bridge/*.ts` compose:

- **`Inbox`** — L1 entrypoint for deposits / retryable tickets
  (`depositEth`, `createRetryableTicket`).
- **`Outbox`** — L1 redemption contract for confirmed L2→L1
  messages (`executeTransaction`).
- **`L1GatewayRouter`** — L1 routing layer for ERC-20 deposits
  (`outboundTransfer` + `getGateway` resolution).
- **`L2GatewayRouter`** — L2 routing layer for ERC-20 withdraws
  (`outboundTransfer` on the L2 side).

Slice 3a ships `send_eth` (`Inbox.depositEth`) only. Slices 3b /
3c extend the verb surface against the remaining contracts.

### Why npm tarballs (not `forge inspect`)

The bridge contracts in `nitro-contracts` and
`token-bridge-contracts` pull in transitive Solidity imports
(`@openzeppelin/contracts`, sibling files from the same repo).
The single-file `forge inspect`-against-a-temp-workspace path
used by the precompiles doesn't generalize without checking out
the full source tree. The npm packages ship pre-compiled hardhat
artifacts under `package/build/contracts/...`, each with an
`abi` field that matches Ethernauta's `DescriptionSchema` — same
data shape, no cloning, no build step.

## Bump cadence

- Refresh on every new `@arbitrum/nitro-contracts` stable npm
  version. Typically tracks `OffchainLabs/nitro-contracts`
  releases (quarterly).
- Refresh `@arbitrum/token-bridge-contracts` when a consumer
  needs a method that only exists past the current pin.
- Never track an unreleased SHA — both pins are npm semver tags
  that must exist on `registry.npmjs.org`.

## How to bump

1. Pick the new target version from npm (`npm view
   @arbitrum/nitro-contracts versions`) — stable only.
2. Update `NITRO_CONTRACTS_NPM_VERSION` and / or
   `TOKEN_BRIDGE_CONTRACTS_NPM_VERSION` at the top of
   `packages/arbitrum/scripts/pull-contracts.ts`.
3. Update the **Pinned upstream** table in this file.
4. Run `pnpm --filter @ethernauta/arbitrum pull-contracts` to
   rewrite the `*.abi.json` files.
5. Run `pnpm regen` to regenerate the `methods/` folders.
6. Run the verification chain
   (`pnpm --filter @ethernauta/arbitrum typecheck build test:unit lint`,
   plus `pnpm lint:ratchet`).

## Links of interest

- [Arbitrum bridge architecture](https://docs.arbitrum.io/build-decentralized-apps/cross-chain-messaging)
- [`Inbox.sol`](https://github.com/OffchainLabs/nitro-contracts/blob/main/src/bridge/Inbox.sol)
- [`L1GatewayRouter.sol`](https://github.com/OffchainLabs/token-bridge-contracts/blob/main/contracts/tokenbridge/ethereum/gateway/L1GatewayRouter.sol)
