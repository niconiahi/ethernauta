---
title: "@ethernauta/gas"
section: Overview
section_order: 7
order: 7.5
---

# @ethernauta/gas

Fee estimation as composable primitives, for the L2 families that don't have their own family package yet. The wallet's gas UI and a path-2 dapp consume the same code.

> ⓘ **OP Stack moved.** Slice 1 of the [`@ethernauta/op`](/op/overview) plan relocated the OP-specific gas helper out of `@ethernauta/gas` and into `@ethernauta/op`, renaming it `estimate_op_fees`. See [`/op/gas`](/op/gas) for the current OP-Stack fee estimation surface. Arbitrum and zkSync still live here until their family packages land.

```bash
pnpm add @ethernauta/gas
```

Every primitive returns a `Readable<T>` — pass a reader built by `create_reader(CHAINS)` (path 2) or `provider.reader(...)` (path 1). The package never asks for a wallet on its own.

## What this is for

Before broadcasting a transaction, a dapp needs three things: the fee triple (`base_fee`, `max_priority`, `max_fee`), a gas limit, and — on L2 — the L1 data-fee surcharge. None of that is RPC-method-binding work; all of it is real algorithm content with knobs (percentile, multiplier) every dapp ends up reinventing. `@ethernauta/gas` is that layer.

EIP-1559 spec constants and arithmetic (`INITIAL_BASE_FEE`, `BASE_FEE_MAX_CHANGE_DENOMINATOR`, `calculate_base_fee`, `effective_gas_price`) live in [`@ethernauta/eip/1559`](/eips/1559). JSON-RPC method bindings (`eth_feeHistory`, `eth_estimateGas`) live in [`@ethernauta/eth`](/eth/overview). This package sits on top of both.

## Surface

| Export | Shape | Purpose |
|---|---|---|
| `calculate_gas_arbitrum` | `Readable<CalculateGasArbitrumFees>` | Arbitrum: `NodeInterface.gasEstimateComponents` (L1 + L2 in one shot). |
| `calculate_gas_zksync` | `Readable<CalculateGasZksyncFees>` | zkSync: `zks_estimateFee` (non-standard RPC). |

For the 1559 baseline (`estimate_priority_fee`, `estimate_1559_fees`, `buffer_gas_limit`) see [`/eth/overview`](/eth/overview) — those moved into `@ethernauta/eth` alongside the rest of the substrate fee surface. For OP Stack (`estimate_op_fees`, `estimate_l1_fee`) see [`/op/gas`](/op/gas).

## L2 families

Arbitrum and zkSync each get their own coarse helper that orchestrates the chain-specific reads and returns a kind-tagged result. OP Stack moved to [`@ethernauta/op`](/op/gas).

### Arbitrum (One, Nova)

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { calculate_gas_arbitrum } from "@ethernauta/gas";
import { eip155_42161 } from "@ethernauta/chain/eip155-42161";
import { AddressSchema, BytesSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_42161.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://arbitrum-one-rpc.publicnode.com")] },
]);

const recipient = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const calldata = parse(BytesSchema, "0x");

const fees = await calculate_gas_arbitrum({
  tx: { to: recipient, input: calldata },
})(reader({ chain_id: CHAIN_ID }));

// { kind: "arbitrum", gas_estimate, l1_base_fee_estimate, l2_base_fee }
```

One call to `NodeInterface.gasEstimateComponents` at the predeploy `0x00…C8`. The Nitro node intercepts and hands back the L2-execution + L1-batch-posting split in one shot — simpler than OP-stack.

### zkSync (Era mainnet, Sepolia)

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { calculate_gas_zksync } from "@ethernauta/gas";
import { eip155_324 } from "@ethernauta/chain/eip155-324";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_324.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://mainnet.era.zksync.io")] },
]);

const recipient = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(UintSchema, "0x0");

const fees = await calculate_gas_zksync({
  tx: { to: recipient, value, input: parse(BytesSchema, "0x") },
})(reader({ chain_id: CHAIN_ID }));

// { kind: "zksync", gas_limit, gas_per_pubdata_limit,
//   max_fee_per_gas, max_priority_fee_per_gas }
```

One call to `zks_estimateFee` — a non-standard RPC method, hand-bound here because no contract or EIP defines it.

## Picking the family

There's no runtime `gas_family(chain)` dispatcher anymore — each L2 family lives in its own package (`@ethernauta/op` for OP Stack, this package for Arbitrum + zkSync), and the import statement *is* the family choice. If your code path needs to branch by chain, switch on a chain-ID set you control and call the right helper directly.

## What this package does not do

- **No paid gas oracles, no hosted fee APIs.** Per maxim M4. Every primitive composes JSON-RPC methods and public predeploy reads.
- **No auto-detect by `eth_chainId`.** Callers always pass the chain explicitly. One more round trip and one more layer of magic — not worth it.
- **No gas-token abstraction.** Chains that pay for gas in something other than the native token (paymaster setups, Mantle's MNT) are out of scope. v1+ assumes native-token gas. Paymaster work belongs in [`@ethernauta/eip/4337`](/eips/4337).

## See also

- [`/op/gas`](/op/gas) — OP Stack fee estimation (`estimate_op_fees`, `estimate_l1_fee`). Moved out of `@ethernauta/gas`.
- [`/eth/overview`](/eth/overview) — the 1559 baseline (`estimate_1559_fees`, `estimate_priority_fee`, `buffer_gas_limit`) and the underlying `eth_feeHistory` / `eth_estimateGas` / `eth_getTransactionCount` methods.
- [`/eips/1559`](/eips/1559) — the spec constants and base-fee arithmetic this package builds on.
- [`/concepts/resolver-shapes`](/concepts/resolver-shapes) — what `Readable<T>` means.
- [`/concepts/two-paths`](/concepts/two-paths) — wallet-routed vs primitive composition.
