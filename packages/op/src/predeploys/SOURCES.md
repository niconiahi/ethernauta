# OP Stack predeploy ABI sources

Predeploy ABIs in this directory are vendored from upstream
repositories at pinned commits via two source modes (see
[`packages/op/scripts/pull-contracts.ts`](../../scripts/pull-contracts.ts)):

- `snapshot-json` — fetch the pre-compiled ABI JSON from
  `ethereum-optimism/optimism`'s
  `packages/contracts-bedrock/snapshots/abi/` folder.
- `forge-from-github` — download a repo tarball at a pinned ref,
  extract it into a temp foundry workspace, install pinned libs
  alongside, and `forge inspect <Pascal> abi --json`.

Do not edit the `*.abi.json` files by hand — re-run the vendoring
script to bump.

## Pinned upstream

| Source | Repo | Pin |
|---|---|---|
| OP (`snapshot-json` + `forge-from-github`) | [`ethereum-optimism/optimism`](https://github.com/ethereum-optimism/optimism) | `op-contracts/v6.0.0` (SHA `018f5ae926ec3277746b56a1c4ddb715c568603d`) |
| EAS (`forge-from-github`) | [`ethereum-attestation-service/eas-contracts`](https://github.com/ethereum-attestation-service/eas-contracts) | tag `v1.4.0` |

`forge-from-github` vendors a foundry workspace alongside the
contract sources. Lib pins applied per workspace:

| Workspace | Lib | Repo | Pin |
|---|---|---|---|
| OP | `openzeppelin-contracts` | [`OpenZeppelin/openzeppelin-contracts`](https://github.com/OpenZeppelin/openzeppelin-contracts) | `ecd2ca2cd7cac116f7a37d0e474bbb3d7d5e1c4d` |
| OP | `openzeppelin-contracts-upgradeable` | [`OpenZeppelin/openzeppelin-contracts-upgradeable`](https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable) | `0a2cb9a445c365870ed7a8ab461b12acf3e27d63` |
| OP | `openzeppelin-contracts-v5` | [`OpenZeppelin/openzeppelin-contracts`](https://github.com/OpenZeppelin/openzeppelin-contracts) | `dbb6104ce834628e473d2173bbc9d47f81a9eec3` |
| OP | `solmate` | [`transmissions11/solmate`](https://github.com/transmissions11/solmate) | `8f9b23f8838670afda0fd8983f2c41e8037ae6bc` |
| OP | `lib-keccak` | [`ethereum-optimism/lib-keccak`](https://github.com/ethereum-optimism/lib-keccak) | `3b1e7bbb4cc23e9228097cfebe42aedaf3b8f2b9` |
| OP | `solady` | [`Vectorized/solady`](https://github.com/Vectorized/solady) | `502cc1ea718e6fa73b380635ee0868b0740595f0` |
| OP | `solady-v0.0.245` | [`Vectorized/solady`](https://github.com/Vectorized/solady) | `e0ef35adb0ccd1032794731a995cb599bba7b537` |
| OP | `forge-std` | [`foundry-rs/forge-std`](https://github.com/foundry-rs/forge-std) | `6853b9ec7df5dc0c213b05ae67785ad4f4baa0ea` |
| OP | `safe-contracts` | [`safe-global/safe-contracts`](https://github.com/safe-global/safe-contracts) | `bf943f80fec5ac647159d26161446ac5d716a294` |
| OP | `kontrol-cheatcodes` | [`runtimeverification/kontrol-cheatcodes`](https://github.com/runtimeverification/kontrol-cheatcodes) | `2c48ae1ab44228c199dca29414c0b4b18a3434e6` |
| EAS | `openzeppelin-contracts` | [`OpenZeppelin/openzeppelin-contracts`](https://github.com/OpenZeppelin/openzeppelin-contracts) | tag `v5.2.0` |

All pins live at the top of
[`packages/op/scripts/pull-contracts.ts`](../../scripts/pull-contracts.ts).
Keep this file in lockstep with the constants there.

## Per-predeploy mapping

| Folder | Address | Source | Path |
|---|---|---|---|
| `gas-price-oracle/GasPriceOracle.abi.json` | `0x420…000F` | `snapshot-json` | `snapshots/abi/GasPriceOracle.json` |
| `l1-block/L1Block.abi.json` | `0x420…0015` | `snapshot-json` | `snapshots/abi/L1Block.json` |
| `l1-fee-vault/L1FeeVault.abi.json` | `0x420…001A` | `snapshot-json` | `snapshots/abi/L1FeeVault.json` |
| `l2-cross-domain-messenger/L2CrossDomainMessenger.abi.json` | `0x420…0007` | `snapshot-json` | `snapshots/abi/L2CrossDomainMessenger.json` |
| `l2-standard-bridge/L2StandardBridge.abi.json` | `0x420…0010` | `snapshot-json` | `snapshots/abi/L2StandardBridge.json` |
| `sequencer-fee-vault/SequencerFeeVault.abi.json` | `0x420…0011` | `snapshot-json` | `snapshots/abi/SequencerFeeVault.json` |
| `weth/WETH.abi.json` | `0x420…0006` | `forge-from-github` | `src/L2/WETH.sol:WETH` |
| `optimism-mintable-erc20-factory/OptimismMintableERC20Factory.abi.json` | `0x420…0012` | `forge-from-github` | `src/universal/OptimismMintableERC20Factory.sol:OptimismMintableERC20Factory` |
| `l1-block-number/L1BlockNumber.abi.json` | `0x420…0013` | `forge-from-github` | `src/legacy/L1BlockNumber.sol:L1BlockNumber` |
| `l2-erc721-bridge/L2ERC721Bridge.abi.json` | `0x420…0014` | `forge-from-github` | `src/L2/L2ERC721Bridge.sol:L2ERC721Bridge` |
| `optimism-mintable-erc721-factory/OptimismMintableERC721Factory.abi.json` | `0x420…0017` | `forge-from-github` | `src/L2/OptimismMintableERC721Factory.sol:OptimismMintableERC721Factory` |
| `proxy-admin/ProxyAdmin.abi.json` | `0x420…0018` | `forge-from-github` | `src/universal/ProxyAdmin.sol:ProxyAdmin` |
| `base-fee-vault/BaseFeeVault.abi.json` | `0x420…0019` | `forge-from-github` | `src/L2/BaseFeeVault.sol:BaseFeeVault` |
| `schema-registry/SchemaRegistry.abi.json` | `0x420…0020` | `forge-from-github` | `contracts/SchemaRegistry.sol:SchemaRegistry` (EAS) |
| `eas/EAS.abi.json` | `0x420…0021` | `forge-from-github` | `contracts/EAS.sol:EAS` (EAS) |
| `governance-token/GovernanceToken.abi.json` | `0x420…0042` | `forge-from-github` | `src/governance/GovernanceToken.sol:GovernanceToken` |
| `legacy-message-passer/LegacyMessagePasser.abi.json` | `0x420…0000` | `forge-from-github` | `src/legacy/LegacyMessagePasser.sol:LegacyMessagePasser` |
| `deployer-whitelist/DeployerWhitelist.abi.json` | `0x420…0002` | `forge-from-github` | `src/legacy/DeployerWhitelist.sol:DeployerWhitelist` |

`L2ToL1MessagePasser` (predeploy `0x420…0016`) is intentionally
**not** under `predeploys/` — it's bridge-tightly-coupled and lives
at `packages/op/src/bridge/l2-to-l1-message-passer/`. Moving it
would split the bridge's primitives across two folders for no gain.

`GovernanceToken` is **Optimism-only**: deployed at `0x420…0042` on
Optimism Mainnet + OP Sepolia, absent on every other OP-stack chain
(Base, Mode, Zora, Ink, …). The binding ships because the address
is canonical — calls against a chain where it isn't deployed revert
clearly. Honest answer over speculation.

## Bump cadence

- Refresh on every new `op-contracts/vN.0.0` **stable** release
  (release candidates do not qualify). Typically quarterly.
- Refresh EAS on a new stable EAS tag if a binding consumer needs
  a newer method.
- Refresh on demand when a consumer (the wallet, a dapp, a
  downstream package) needs a method that only exists past the
  current pin.
- Never track a branch (e.g. `develop`). The pin is always a
  commit SHA or annotated tag.

## How to bump

1. Pick the new target tag from
   [`ethereum-optimism/optimism` releases](https://github.com/ethereum-optimism/optimism/tags)
   (`op-contracts/vN.0.0` form, stable only).
2. Resolve the tag to a commit SHA:
   `gh api repos/ethereum-optimism/optimism/git/refs/tags/op-contracts/vN.0.0`
   (annotated tags need one more hop through `git/tags/<sha>`).
3. Update `OP_CONTRACTS_VERSION` + `OP_CONTRACTS_SHA` at the top
   of `packages/op/scripts/pull-contracts.ts`.
4. Re-harvest OP submodule pins via
   `GET /repos/ethereum-optimism/optimism/contents/packages/contracts-bedrock/lib?ref=<sha>`
   and update each entry in `OP_WORKSPACE.libs`.
5. Update this file's **Pinned upstream** + **Lib** tables.
6. Run `pnpm --filter @ethernauta/op pull-contracts` to rewrite
   the `*.abi.json` files.
7. Run `pnpm regen` to regenerate the `methods/` folders.
8. Run the verification chain
   (`pnpm --filter @ethernauta/op typecheck build test:unit lint`,
   plus `pnpm lint:ratchet` and `scripts/no-escape-hatches.sh`).
9. If new methods appeared, surface them in `docs/op/predeploys.md`.

## Links of interest

- [Predeploys — OP Stack specs](https://specs.optimism.io/protocol/predeploys.html)
- [`contracts-bedrock/snapshots/abi/`](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock/snapshots/abi) (latest)
- [`predeploys.go`](https://github.com/ethereum-optimism/optimism/blob/develop/op-bindings/predeploys/predeploys.go) — canonical address list
- [`contracts-bedrock/src/L2/`](https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts-bedrock/src/L2) — Solidity source
- [Isthmus upgrade](https://docs.optimism.io/builders/notices/upgrade-isthmus) — fork-by-fork surface changes
- [EAS docs](https://docs.attest.org/) — Schema Registry + EAS predeploy
