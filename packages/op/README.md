[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/op&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/op&treeshake=[*])

## Philosophy

OP-Stack–specific primitives. Op-node JSON-RPC methods, the L1-calldata fee model, the predeploy contract bindings, per-chain L1 deployment registry, and the L1↔L2 bridge verbs — everything that's true of every OP-Stack rollup (Optimism, Base, Mode, Zora, Worldchain, Soneium, Lisk) but isn't part of L1 Ethereum.

The Yellow-Paper substrate — accounts, EVM, RLP, EIP-1559, the `eth_*` method surface — stays in [`@ethernauta/eth`](https://github.com/niconiahi/ethernauta/tree/main/packages/eth). This package is the layer on top.

## Modules

- [arbitrum](https://github.com/niconiahi/ethernauta/tree/main/packages/arbitrum) [[NPM](https://www.npmjs.com/package/@ethernauta/arbitrum)]
- [op](https://github.com/niconiahi/ethernauta/tree/main/packages/op) [[NPM](https://www.npmjs.com/package/@ethernauta/op)]
- [zksync](https://github.com/niconiahi/ethernauta/tree/main/packages/zksync) [[NPM](https://www.npmjs.com/package/@ethernauta/zksync)]

## API

### Op-node RPC — `Readable<T>`

```ts
import {
  optimism_outputAtBlock,
  optimism_rollupConfig,
  optimism_syncStatus,
  optimism_version,
} from "@ethernauta/op"
```

Surface mirrors the [op-node spec](https://specs.optimism.io/) — output roots, rollup config, sync state — and rides the same `Readable<T>` shape as `eth_*`.

### Fees

```ts
import { estimate_op_fees } from "@ethernauta/op"

const fees = await estimate_op_fees({
  tx: { to, value, input },
  base_fee_multiplier: 1.5,
  priority_percentile: 10,
})(reader({ chain_id }))

// { base_fee_per_gas, max_priority_fee_per_gas, max_fee_per_gas, l1_fee }
```

`estimate_op_fees` composes `eth_feeHistory` + `eth_maxPriorityFeePerGas` + the `GasPriceOracle` predeploy at `0x420…000F` so consumers get the 1559 triple **plus** the L1 calldata surcharge in one call. Relocated here from the (now retired) `@ethernauta/gas` package.

### Predeploys

```ts
import {
  GasPriceOracle,
  L1Block,
  L2StandardBridge,
  L2CrossDomainMessenger,
  L2ToL1MessagePasser,
} from "@ethernauta/op/predeploys"
```

Method bindings against the fixed-address contracts at `0x420…` — `Callable<T>` for view methods, `Signable<T>` for state changes. Pinned to `op-contracts/v6.0.0`.

### Per-chain L1 deploys

```ts
import { require_deploy_addresses } from "@ethernauta/op"
import { eip155_8453 } from "@ethernauta/chain/eip155-8453"

const deploys = require_deploy_addresses(eip155_8453)
// { OptimismPortal, DisputeGameFactory, AnchorStateRegistry,
//   L1StandardBridge, L1CrossDomainMessenger, BatcherInbox, … }
```

Returns the L1 deployment addresses for every supported OP-Stack chain. Spec-anchored optional fields (fault-proof set) tag chains pre-/post-fault-proof migration.

### Bridge verbs — `Bridgeable<T>`

```ts
import {
  send_eth,
  send_erc20,
  send_message,
  start_withdraw_eth,
  start_withdraw_erc20,
  start_withdraw_message,
  prove_withdraw,
  execute_withdraw,
  fetch_message_proof,
  get_status,
} from "@ethernauta/op/bridge"

import { create_bridge } from "@ethernauta/transport"

const bridge = create_bridge(CHAINS)({
  l1_chain_id: ETH_MAINNET,
  l2_chain_id: BASE,
})

const hash = await send_eth({
  to: recipient,
  value: parse(UintSchema, "0x..."),
})(bridge.signer)
```

The bridge surface covers both deposit (L1 → L2) and the three-phase withdraw (start on L2, prove on L1 after the output root is published, execute on L1 after the dispute window). `get_status` walks the fault-dispute state machine and `fetch_message_proof` derives the merkle witness from on-chain state — no hosted indexer (M4).

Errors are typed: revert payloads from the OptimismPortal / DisputeGameFactory / FaultDisputeGame contracts decode into a discriminated `OpBridgeError` union.

### Solidity sources

The vendored OP contracts (op-contracts/v6.0.0) live colocated under `packages/op/src/bridge/<contract>/` and `packages/op/src/predeploys/<contract>/`. `pnpm pull-contracts` refreshes them from the upstream repo; `pnpm pull-superchain-registry` refreshes the per-chain L1 deploys registry.
