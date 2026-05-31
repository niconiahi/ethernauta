---
title: "@ethernauta/op"
section: OP Stack
section_order: 9
order: 1
---

# @ethernauta/op

OP Stack-specific primitives. Op-node JSON-RPC methods, the L1-calldata fee model, the predeploy contract bindings, the chain registry — everything that's true of every OP Stack rollup (Optimism Mainnet, Base, Mode, Zora, Worldchain, Soneium, Lisk) but isn't part of L1 Ethereum.

```bash
pnpm add @ethernauta/op
```

The Yellow Paper substrate — accounts, EVM, RLP, EIP-1559, the `eth_*` method surface — lives in [`@ethernauta/eth`](/eth/overview). This package is the layer on top: the things [the OP Stack specs](https://specs.optimism.io/) define that Yellow Paper doesn't.

## What's in the OP layer

OP Stack chains are EVM-equivalent at the execution layer. What differs from L1:

- **Block production.** Sequencer batches L2 blocks; an op-node derives the canonical chain from L1 inbox submissions. There's a [derivation pipeline](https://specs.optimism.io/protocol/derivation.html), an [output root commitment](https://specs.optimism.io/protocol/proposals.html#l2-output-commitment-construction) posted to L1, and a fault-proof system ([Cannon](https://github.com/ethereum-optimism/optimism/tree/develop/cannon)) settling disputes.
- **Two-dimensional fee model.** Users pay L2 EIP-1559 execution gas *plus* an L1 calldata surcharge collected by the [`GasPriceOracle` predeploy](https://specs.optimism.io/protocol/predeploys.html#gaspriceoracle) at `0x420…000F`. See [`/op/gas`](/op/gas).
- **Predeploys.** A fixed set of contracts live at well-known `0x420…` addresses on every OP Stack chain — `GasPriceOracle`, `L1Block`, `L2StandardBridge`, `L2CrossDomainMessenger`, etc. See [`/op/predeploys`](/op/predeploys).
- **Op-node JSON-RPC.** A small `optimism_*` namespace exposing sync state, the active rollup config, and output roots. Separate from the execution-client `eth_*` namespace. See [`/op/rpc-methods`](/op/rpc-methods).
- **Deposit transaction type `0x7E`.** L1 → L2 forced inclusion. Out of scope for now — lands with the bridge phase.

## Surface

| Export | Shape | Purpose |
|---|---|---|
| `optimism_outputAtBlock` | `Readable<OutputResponse>` | Output root + L2 block ref at a given L2 block number. |
| `optimism_rollupConfig` | `Readable<RollupConfig>` | Active rollup config (genesis, hardfork times, L1 contracts). |
| `optimism_syncStatus` | `Readable<SyncStatus>` | Head / safe / finalized L1+L2 block refs. |
| `optimism_version` | `Readable<string>` | Answering op-node's version string. |
| `estimate_op_fees` | `Readable<OpFees>` | 1559 fee triple + L1 calldata fee, composed in one call. |
| `require_deploy_addresses` | `(chain: Chain) => OpDeploys` | Per-chain L1 deployment addresses (portal, dispute factory, batcher, etc) for the six supported OP Stack chains. See [`/op/chains`](/op/chains). |

Response sub-types — `OutputResponse`, `RollupConfig`, `SyncStatus`, `L1BlockRef`, `L2BlockRef`, `SystemConfig`, `Genesis`, `OpDeploys` — are exported from the root and from `@ethernauta/op/core`.

## End-to-end — estimate gas on Base

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport"
import { estimate_op_fees } from "@ethernauta/op"
import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core"
import { parse } from "valibot"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_8453.chainId,
})
const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [http("https://base-rpc.publicnode.com")],
  },
])

const recipient = parse(
  AddressSchema,
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
)

const fees = await estimate_op_fees({
  tx: {
    to: recipient,
    value: parse(UintSchema, "0x0"),
    input: parse(BytesSchema, "0x"),
  },
  base_fee_multiplier: 1.5,
  priority_percentile: 10,
})(reader({ chain_id: CHAIN_ID }))

// fees: {
//   base_fee_per_gas, max_priority_fee_per_gas,
//   max_fee_per_gas, l1_fee
// }
```

Three parallel reads (`eth_feeHistory` + `eth_getTransactionCount` + `eth_estimateGas`) followed by a `getL1Fee(bytes)` call against the `GasPriceOracle` predeploy. No paid services, no hosted gas oracle ([M4](/concepts/primitives-first)). The gas limit is computed internally to size the L1-fee calculation correctly but not returned — get it separately via `eth_estimateGas` or `buffer_gas_limit` if your UI needs to display it.

## Maxim alignment

This package exists exactly because of the [primitives-first maxim](/concepts/primitives-first):

- **[M1 — Primitives are first-class.](/concepts/primitives-first)** RPC methods, predeploy reads, fee composition. Everything is a `Readable<T>`.
- **[M3 — Two consumer paths.](/concepts/two-paths)** Dapps can compose `estimate_op_fees` + `eth_signTransaction` + `eth_sendRawTransaction` end-to-end with no wallet (path 2), or hand a typed-tx envelope to the wallet (path 1). Both work on every OP Stack chain.
- **[M4 — No paid services.](/concepts/primitives-first)** Every input is a public RPC, a vendored ABI from `ethereum-optimism/optimism`, or a deployment address from [`superchain-registry`](https://github.com/ethereum-optimism/superchain-registry).
- **Hard rule 11.** Anything OP-Stack-specific lives here, not scattered into `@ethernauta/abi` or `@ethernauta/utils`. The predeploys aren't numbered EIPs/ERCs — they're OP-stack standards, so they live in `@ethernauta/op`.

## What this package does not do

- **Bridge methods.** Deposits, withdrawals, withdrawal-proof construction. Lands with the bridge phase. The data path runs through [`OptimismPortal`](https://specs.optimism.io/protocol/withdrawals.html#withdrawal-flow) on L1 and the `L2StandardBridge` / `L2CrossDomainMessenger` predeploys on L2.
- **Fault-proof interaction.** Reading dispute games, submitting challenges, etc. Cannon-specific — out of scope until a clear consumer need surfaces.
- **Op-batcher / op-proposer / op-challenger orchestration.** Those are node-operator tools, not dapp-consumer surface.
- **Off-chain indexer wrappers.** Per [M4](/concepts/primitives-first) — no hosted-service dependencies.

## Per-chain documentation

Every OP Stack chain runs its own docs site. Cross-reference these when chain-specific facts (block time, gas limit, batcher address, sequencer feeds) matter:

- [Optimism Mainnet](https://docs.optimism.io/) — the reference implementation.
- [Base](https://docs.base.org/)
- [Mode](https://docs.mode.network/)
- [Zora](https://docs.zora.co/)
- [Worldchain](https://docs.world.org/world-chain/quick-start/info)
- [Soneium](https://docs.soneium.org/)
- [Lisk](https://docs.lisk.com/)

See [`/op/chains`](/op/chains) for the typed chain-entry rollout.

## See also

- [`/op/rpc-methods`](/op/rpc-methods) — the four op-node methods.
- [`/op/gas`](/op/gas) — two-dimensional fee model, `estimate_op_fees`.
- [`/op/predeploys`](/op/predeploys) — predeploy address registry.
- [`/op/chains`](/op/chains) — typed entries for each OP Stack chain.
- [OP Stack specs](https://specs.optimism.io/) — protocol authority.
- [op-node JSON-RPC reference](https://docs.optimism.io/operators/node-operators/json-rpc) — wire-format authority for everything under `optimism_*`.
- [`ethereum-optimism/optimism`](https://github.com/ethereum-optimism/optimism) — source.
- [`ethereum-optimism/superchain-registry`](https://github.com/ethereum-optimism/superchain-registry) — chain registry.
- [`/eth/overview`](/eth/overview) — substrate `eth_*` methods this package composes.
- [`/concepts/primitives-first`](/concepts/primitives-first) — why "primitive + folder + done" is the iteration model.
