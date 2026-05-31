# Arbitrum precompile + virtual-contract sources

Interface `.sol` files in this directory are vendored from
OffchainLabs upstream at pinned SHA / tag and compiled to
canonical ABI JSON via `forge inspect`. Do not edit the
`*.abi.json` files by hand — re-run the vendoring script to bump.

## Pinned upstream

| Source | Pin |
|---|---|
| [`OffchainLabs/nitro-precompile-interfaces`](https://github.com/OffchainLabs/nitro-precompile-interfaces) | SHA `f49a4889b486fd804a7901203f5f663cfd1581c8` (matches `nitro-contracts v3.2.0`) |
| [`OffchainLabs/nitro-contracts`](https://github.com/OffchainLabs/nitro-contracts) | Tag `v3.2.0` |

Solc version: `0.8.24` (matches `nitro-contracts`'s own
`foundry.toml` at this tag).

The pin lives at the top of
[`packages/arbitrum/scripts/pull-contracts.ts`](../../scripts/pull-contracts.ts).
Keep this file in lockstep with the constants there.

## Per-folder mapping

| Folder | Upstream `.sol` | Precompile address |
|---|---|---|
| `arb-sys/ArbSys.abi.json` | `ArbSys.sol` | `0x0000000000000000000000000000000000000064` |
| `arb-info/ArbInfo.abi.json` | `ArbInfo.sol` | `0x0000000000000000000000000000000000000065` |
| `arb-address-table/ArbAddressTable.abi.json` | `ArbAddressTable.sol` | `0x0000000000000000000000000000000000000066` |
| `arb-bls/ArbBLS.abi.json` | `ArbBLS.sol` | `0x0000000000000000000000000000000000000067` |
| `arb-function-table/ArbFunctionTable.abi.json` | `ArbFunctionTable.sol` | `0x0000000000000000000000000000000000000068` |
| `arb-owner-public/ArbOwnerPublic.abi.json` | `ArbOwnerPublic.sol` | `0x000000000000000000000000000000000000006B` |
| `arb-gas-info/ArbGasInfo.abi.json` | `ArbGasInfo.sol` | `0x000000000000000000000000000000000000006C` |
| `arb-retryable-tx/ArbRetryableTx.abi.json` | `ArbRetryableTx.sol` | `0x000000000000000000000000000000000000006E` |
| `arb-statistics/ArbStatistics.abi.json` | `ArbStatistics.sol` | `0x000000000000000000000000000000000000006F` |
| `arb-owner/ArbOwner.abi.json` | `ArbOwner.sol` | `0x0000000000000000000000000000000000000070` |
| `arb-wasm/ArbWasm.abi.json` | `ArbWasm.sol` | `0x0000000000000000000000000000000000000071` |
| `arb-wasm-cache/ArbWasmCache.abi.json` | `ArbWasmCache.sol` | `0x0000000000000000000000000000000000000072` |
| `arb-native-token-manager/ArbNativeTokenManager.abi.json` | `ArbNativeTokenManager.sol` | `0x0000000000000000000000000000000000000073` |
| `arb-aggregator/ArbAggregator.abi.json` | `ArbAggregator.sol` | `0x0000000000000000000000000000000000000079` |
| `arb-debug/ArbDebug.abi.json` | `ArbDebug.sol` | `0x00000000000000000000000000000000000000FF` |
| `node-interface/NodeInterface.abi.json` | `src/node-interface/NodeInterface.sol` | `0x00000000000000000000000000000000000000C8` |
| `arbos-acts/ArbosActs.sol` | `ArbosActs.sol` | n/a — system-internal; uncallable by dapps |

## Skipped bindings

- **`ArbosActs`** — vendored as `.sol` for documentation only.
  The dispatcher requires `msg.sender == ArbosAddress`, so any
  dapp call reverts unconditionally regardless of permission.
  See D2-3 in `tmp/plans/03_arbitrum_package/README.md`.
- **`ArbosTest`** — out of scope; devnet test contract not enumerated
  in the slice 4 plan.
