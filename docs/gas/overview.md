---
title: "@ethernauta/gas"
section: Overview
section_order: 7
order: 7.5
---

# @ethernauta/gas

Fee estimation as composable primitives. One package, four families: standard EIP-1559, OP-stack, Arbitrum, zkSync. The wallet's gas UI and a path-2 dapp consume the same code.

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
| `estimate_priority_fee` | `Readable<Uint>` | Percentile model over `eth_feeHistory`'s `reward[]` matrix. |
| `estimate_1559_fees` | `Readable<Fees1559>` | `base × multiplier + priority` composition. |
| `buffer_gas_limit` | `Readable<Uint>` | `eth_estimateGas` × safety margin. |
| `calculate_gas_op_stack` | `Readable<CalculateGasOpStackFees>` | OP-stack: 1559 triple + L1 data fee via `GasPriceOracle`. |
| `calculate_gas_arbitrum` | `Readable<CalculateGasArbitrumFees>` | Arbitrum: `NodeInterface.gasEstimateComponents` (L1 + L2 in one shot). |
| `calculate_gas_zksync` | `Readable<CalculateGasZksyncFees>` | zkSync: `zks_estimateFee` (non-standard RPC). |
| `gas_family` | `(chain) => GasFamily` | Chain-family dispatch: `"1559" \| "op-stack" \| "arbitrum" \| "zksync"`. |
| `OP_STACK_CHAIN_IDS`, `ARBITRUM_CHAIN_IDS`, `ZKSYNC_CHAIN_IDS` | `readonly number[]` | The chain-ID literal arrays that drive `gas_family`. |
| `FamilyForChainId<Id>` | conditional type | Compile-time mirror of `gas_family`. |

## Quick example — standard 1559

```ts
import { create_reader } from "@ethernauta/transport";
import { estimate_1559_fees, buffer_gas_limit } from "@ethernauta/gas";
import { eip155_1 } from "@ethernauta/chain";

const reader = create_reader([eip155_1]);
const ctx = reader({ chain_id: eip155_1.chain_id });

const fees = await estimate_1559_fees({
  base_fee_multiplier: 1.5,
  priority_percentile: 10,
})(ctx);
// { base_fee_per_gas, max_priority_fee_per_gas, max_fee_per_gas }

const gas = await buffer_gas_limit({
  tx: { to: recipient, value: amount, input: "0x" },
  multiplier: 1.2,
})(ctx);
```

The multiplier and percentile choices belong to the call site. The library ships no `DEFAULT_PERCENTILE` constant — it has no opinion.

## L2 families

OP-stack, Arbitrum, and zkSync each get their own coarse helper. They orchestrate the chain-specific reads and return a kind-tagged result, so a dapp that branches on `kind` can render one UI per family without re-parsing.

### OP-stack (Optimism, Base, Mode, Zora, Mantle, World Chain, Soneium, Lisk)

```ts
import { create_reader } from "@ethernauta/transport";
import { calculate_gas_op_stack } from "@ethernauta/gas";
import { eip155_8453 } from "@ethernauta/chain";

const reader = create_reader([eip155_8453]);

const fees = await calculate_gas_op_stack({
  tx: { to: recipient, value, input: "0x" },
  base_fee_multiplier: 1.5,
  priority_percentile: 10,
})(reader({ chain_id: eip155_8453.chain_id }));

// { kind: "op-stack", base_fee_per_gas, max_priority_fee_per_gas,
//   max_fee_per_gas, l1_fee }
```

Four reads run in parallel where they're independent: `eth_feeHistory` + `eth_getTransactionCount` + `eth_estimateGas`, then `GasPriceOracle.getL1Fee(bytes)` against the predeploy at `0x420…0F`.

### Arbitrum (One, Nova)

```ts
import { calculate_gas_arbitrum } from "@ethernauta/gas";
import { eip155_42161 } from "@ethernauta/chain";

const fees = await calculate_gas_arbitrum({
  tx: { to: recipient, input: calldata },
})(reader({ chain_id: eip155_42161.chain_id }));

// { kind: "arbitrum", gas_estimate, l1_base_fee_estimate, l2_base_fee }
```

One call to `NodeInterface.gasEstimateComponents` at the predeploy `0x00…C8`. The Nitro node intercepts and hands back the L2-execution + L1-batch-posting split in one shot — simpler than OP-stack.

### zkSync (Era mainnet, Sepolia)

```ts
import { calculate_gas_zksync } from "@ethernauta/gas";
import { eip155_324 } from "@ethernauta/chain";

const fees = await calculate_gas_zksync({
  tx: { to: recipient, value, input: "0x" },
})(reader({ chain_id: eip155_324.chain_id }));

// { kind: "zksync", gas_limit, gas_per_pubdata_limit,
//   max_fee_per_gas, max_priority_fee_per_gas }
```

One call to `zks_estimateFee` — a non-standard RPC method, hand-bound here because no contract or EIP defines it.

## Picking the family

For dispatch by chain, use `gas_family`:

```ts
import { gas_family } from "@ethernauta/gas";

switch (gas_family(chain)) {
  case "op-stack":
    return calculate_gas_op_stack(...)(reader(...));
  case "arbitrum":
    return calculate_gas_arbitrum(...)(reader(...));
  case "zksync":
    return calculate_gas_zksync(...)(reader(...));
  case "1559":
    return estimate_1559_fees(...)(reader(...));
}
```

The coarse helpers are exported directly rather than hidden behind a single `calculate_gas(chain, …)` dispatcher. Each family's parameter and return shape is different enough that a unified call is more friction than service.

If your codepath only ever runs on a single chain, skip `gas_family` and call the helper directly.

## What this package does not do

- **No paid gas oracles, no hosted fee APIs.** Per maxim M4. Every primitive composes JSON-RPC methods and public predeploy reads.
- **No auto-detect by `eth_chainId`.** Callers always pass the chain explicitly. One more round trip and one more layer of magic — not worth it.
- **No gas-token abstraction.** Chains that pay for gas in something other than the native token (paymaster setups, Mantle's MNT) are out of scope. v1+ assumes native-token gas. Paymaster work belongs in [`@ethernauta/eip/4337`](/eips/4337).

## See also

- [EIP-1559](/eips/1559) — the spec constants and base-fee arithmetic this package builds on.
- [Concepts → resolver shapes](/concepts/resolver-shapes) — what `Readable<T>` means.
- [Concepts → two paths](/concepts/two-paths) — wallet-routed vs primitive composition.
- [@ethernauta/eth](/eth/overview) — `eth_feeHistory`, `eth_estimateGas`, `eth_getTransactionCount`.
