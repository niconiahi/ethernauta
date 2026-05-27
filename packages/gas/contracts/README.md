# gas/contracts

Pinned ABI sources for the L2 family helpers in `@ethernauta/gas`.
Each `.sol` carries upstream provenance; each `.abi.json` is the
codegen input for `@ethernauta/cli abi`. The ABIs are curated to
the exact methods the gas helpers wire — emitting unused methods
would bloat tree-shaking and risks tripping the codegen on
exotic types we do not consume.

| Contract | Predeploy | Family | Methods wired | Upstream `.sol` |
|---|---|---|---|---|
| `GasPriceOracle` | `0x420000000000000000000000000000000000000F` | OP-stack | `getL1Fee(bytes)`, `l1BaseFee()` | `ethereum-optimism/optimism@0e3d4663` — `packages/contracts-bedrock/src/L2/GasPriceOracle.sol` |
| `NodeInterface` | `0x00000000000000000000000000000000000000C8` | Arbitrum | `gasEstimateComponents(address,bool,bytes)` | `OffchainLabs/nitro-contracts@67487333` — `src/node-interface/NodeInterface.sol` |
| `ArbGasInfo` | `0x000000000000000000000000000000000000006C` | Arbitrum | `getL1BaseFeeEstimate()`, `getPricesInWei()` | `OffchainLabs/nitro-precompile-interfaces@7e88c8cc` — `ArbGasInfo.sol` |

`NodeInterface.gasEstimateComponents` is declared `payable` in
Solidity but is universally consumed via `eth_call` (the
upstream natspec says so explicitly); we curate it as `view` in
the ABI so codegen emits a `Callable<T>`.

To regenerate one family's bindings:

```bash
pnpm --filter @ethernauta/cli build
node packages/cli/dist/bin.js abi \
  --in packages/gas/contracts/GasPriceOracle.abi.json \
  --out packages/gas/src/chains/op-stack/gas-price-oracle
```
