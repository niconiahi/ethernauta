---
title: "Op-node RPC methods"
section: OP Stack
section_order: 9
order: 2
---

# Op-node RPC methods

The `optimism_*` JSON-RPC namespace served by [op-node](https://github.com/ethereum-optimism/optimism/tree/develop/op-node). Distinct from the execution-client `eth_*` namespace served by op-geth — different process, different default port, often different access policy.

Each method is a curried primitive returning `Readable<T>`. Bind parameters first, transport second ([Concepts → resolver shapes](/concepts/resolver-shapes)).

## Access note — op-node RPC isn't on public endpoints

Public RPC providers (`https://base-rpc.publicnode.com`, `https://mainnet.optimism.io`, etc.) expose **only** the op-geth execution client, not op-node. The execution endpoint serves `eth_*` / `net_*` / `web3_*` and nothing else — calling `optimism_outputAtBlock` against it returns `method not found`.

To call these methods you need access to a node that runs op-node alongside op-geth and exposes its RPC port (default `:9545`). Options:

- Run your own op-node + op-geth pair against an L1 source. [Bedrock operator guide](https://docs.optimism.io/operators/node-operators/tutorials/node-from-source).
- Use a provider that explicitly exposes op-node (rare — most don't).
- For dapps: these methods are typically informational, not on the hot path. Cache results from a node you control.

## `optimism_outputAtBlock`

The output root and L2 block reference at a given L2 block number. This is what's posted to L1 — clients verifying withdrawals or building proofs anchor on the output root returned here.

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport"
import { optimism_outputAtBlock } from "@ethernauta/op"
import { UintSchema } from "@ethernauta/core"
import { parse } from "valibot"

const reader = create_reader([
  {
    chainId: encode_chain_id({ namespace: "eip155", reference: 10 }),
    transports: [http("https://your-op-node-rpc.example/")],
  },
])

const block_number = parse(UintSchema, "0x4d2") // 1234
const output = await optimism_outputAtBlock([block_number])(
  reader({ chain_id: "eip155:10" }),
)

// output: {
//   version: "0x00...",       // output-root version
//   outputRoot: "0x...",      // the commitment posted to L1
//   blockRef: {               // L2 block at this height
//     hash, number, parentHash, timestamp,
//     l1origin: { hash, number },
//     sequenceNumber,
//   },
//   withdrawalStorageRoot: "0x...",
//   stateRoot: "0x...",
//   syncStatus?: { current_l1, head_l1, safe_l1, ... }
// }
```

Also accepts the named-parameter form `{ blockNumber }`. Both normalize to the positional wire shape (`[blockNumber]`) op-node expects.

Spec: [output-root commitment construction](https://specs.optimism.io/protocol/proposals.html#l2-output-commitment-construction). Go source: [`OutputResponse` in op-service/eth/output.go](https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/output.go).

## `optimism_rollupConfig`

The active rollup config of the answering op-node. Genesis, hardfork activation times, L1 contract addresses, batch inbox, system config. The same data lives statically in [`superchain-registry`](https://github.com/ethereum-optimism/superchain-registry) — but querying op-node directly tells you *what the node currently believes*, including locally-applied overrides.

```ts
const config = await optimism_rollupConfig()(
  reader({ chain_id: "eip155:8453" }),
)

// config.l2_chain_id: 8453
// config.block_time: 2
// config.fjord_time: 1720627201
// config.holocene_time: 1736445601
// config.genesis.l2.hash: "0xf712aa..."
// config.genesis.system_config.gasLimit: 60_000_000
```

**Hardfork timestamps are all optional.** OP Stack ships a new hardfork roughly every 3–6 months — Regolith, Canyon, Delta, Ecotone, Fjord, Granite, Holocene, Isthmus, Jovian, Karst, Interop, Pectra-blob-schedule (and counting). A chain that hasn't activated a given fork omits the field. The schema parses cleanly against any active chain at any point in time.

Spec: [rollup-node specification](https://specs.optimism.io/protocol/rollup-node.html). Go source: [`rollup.Config` in op-node/rollup/types.go](https://github.com/ethereum-optimism/optimism/blob/develop/op-node/rollup/types.go).

## `optimism_syncStatus`

The op-node's view of the L1 + L2 chains at the moment of the call. Useful for "is this node caught up?" checks, for dashboards, and for safety checks before consuming derived data.

```ts
const status = await optimism_syncStatus()(reader({ chain_id: "eip155:10" }))

// status: {
//   current_l1, current_l1_finalized, head_l1, safe_l1, finalized_l1,
//   unsafe_l2, safe_l2, finalized_l2,
//   pending_safe_l2?, cross_unsafe_l2?, local_safe_l2?,
// }
```

The three optional L2 refs (`pending_safe_l2`, `cross_unsafe_l2`, `local_safe_l2`) are [interop-era](https://specs.optimism.io/interop/overview.html) additions. Pre-interop op-node deployments omit them; the schema accepts both shapes.

Go source: [`SyncStatus` in op-service/eth/sync_status.go](https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/sync_status.go).

## `optimism_version`

The op-node version string — e.g. `"v1.10.2"`.

```ts
const version = await optimism_version()(reader({ chain_id: "eip155:10" }))
// "v1.10.2"
```

Useful for health checks and for capability detection (some response fields are version-gated).

## Implementation notes

Three details worth knowing if you're reading the source or planning to extend it.

### Two BlockID wire formats

`L1BlockRef` and `L2BlockRef` (returned inside `OutputResponse` and `SyncStatus`) custom-MarshalJSON every numeric field as `hexutil.Uint64` — hex strings on the wire (`"0x4d2"`). But the `BlockID` shape inside `Genesis.l1` / `Genesis.l2` (returned by `optimism_rollupConfig`) uses Go's default `encoding/json` — decimal numbers (`1234`).

The package models these as two separate types — `L1OriginSchema` (hex, inside `L2BlockRef`) and the decimal-numbered Genesis variant inline in `GenesisSchema`. Don't try to unify them; the wire format genuinely differs.

### Hardfork-time optionality

Every `*_time` field on `RollupConfig` is `optional()`. The Go source declares them as `*uint64` with `omitempty` — absent on chains that haven't scheduled the fork. The same applies to system-config fields that came with later forks: `eip1559Params` (Holocene+), `operatorFeeParams` (Isthmus+), `minBaseFee` + `daFootprintGasScalar` (Jovian+).

Same pattern in `SyncStatus`: the three interop-era refs are optional so the schema parses against pre-interop deployments.

### The dead `rollup_getInfo`

You may see `rollup_getInfo` referenced in older docs and in some third-party provider documentation. **It does not exist on modern op-node or op-geth.** It was a method on the pre-Bedrock OVM `l2geth` codebase and was removed at the Bedrock upgrade in 2023. The intent it served (node-version + sync-state) is now covered by `optimism_version` + `optimism_syncStatus`.

## See also

- [`/op/overview`](/op/overview) — package introduction.
- [`/op/gas`](/op/gas) — the L2 fee model.
- [op-node JSON-RPC reference](https://docs.optimism.io/operators/node-operators/json-rpc) — the wire-format authority for `optimism_*`.
- [Rollup-node specification](https://specs.optimism.io/protocol/rollup-node.html) — protocol authority.
- [`OutputResponse` source](https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/output.go)
- [`SyncStatus` source](https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/sync_status.go)
- [`rollup.Config` source](https://github.com/ethereum-optimism/optimism/blob/develop/op-node/rollup/types.go)
- [`/eth/overview`](/eth/overview) — the substrate `eth_*` namespace (different process, different access policy).
