---
title: "Gas — the two-dimensional fee model"
section: OP Stack
section_order: 9
order: 3
---

# Gas — the two-dimensional fee model

OP Stack transactions cost users **twice**:

1. **L2 execution fee** — standard EIP-1559 on the L2: `gas_used × (base_fee + priority_fee)`. Indistinguishable from L1 mainnet in shape.
2. **L1 calldata fee** — the L2 batcher posts a compressed batch of transactions to L1, and the user pays their share of that L1 cost. Charged as a flat surcharge per transaction, deducted at the moment the user's tx is included in an L2 block.

The Yellow Paper has no concept of (2). It's why `@ethernauta/op` exists as a separate gas surface from `@ethernauta/eth`.

Authoritative reference: [Fee mechanism — OP Stack specs](https://specs.optimism.io/protocol/exec-engine.html#fee-mechanism).

## `estimate_op_fees`

The coarse helper most dapps want. Composes the four reads in parallel, returns the 1559 triple plus the L1 surcharge.

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

const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
const value = parse(UintSchema, "0x0")
const input = parse(BytesSchema, "0x")

const fees = await estimate_op_fees({
  tx: { to, value, input },
  base_fee_multiplier: 1.5,
  priority_percentile: 10,
})(reader({ chain_id: CHAIN_ID }))

// fees: {
//   base_fee_per_gas: Uint,
//   max_priority_fee_per_gas: Uint,
//   max_fee_per_gas: Uint,
//   l1_fee: Uint,                  // total L1 surcharge in wei
// }
```

Under the hood — four RPCs in parallel where they're independent:

```
estimate_op_fees
├─ eth_feeHistory ─→ L2 base fee + priority percentile  ─┐
├─ eth_getTransactionCount → nonce                       ├→ build unsigned 1559 RLP
├─ eth_estimateGas → gas limit                           ┘
└─ GasPriceOracle.getL1Fee(rlp_bytes) → l1_fee
```

The gas limit is computed internally to size the unsigned RLP correctly — the L1 fee depends on the byte count and zero-byte ratio of the serialized tx. It's not returned to the caller. If your UI needs `gas_limit`, call `eth_estimateGas` or [`buffer_gas_limit`](/eth/overview) separately.

`base_fee_multiplier` and `priority_percentile` are caller-side knobs — the library ships no defaults ([M1](/concepts/primitives-first)). Typical choices: `1.5` / `10` for a fast user-facing path, `1.2` / `50` for a cheap background path.

## The `GasPriceOracle` predeploy

The L1 fee is charged via a single read against the `GasPriceOracle` contract at `0x420000000000000000000000000000000000000F` on every OP Stack chain. Spec: [GasPriceOracle predeploy](https://specs.optimism.io/protocol/predeploys.html#gaspriceoracle). Source: [`GasPriceOracle.sol`](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/GasPriceOracle.sol).

The fee formula has evolved across hardforks. The predeploy abstracts this — you call `getL1Fee(bytes)` with the unsigned tx RLP and it returns the correct fee for whichever formula the chain is currently on.

| Hardfork | L1 fee formula |
|---|---|
| Bedrock | `(byte_cost + overhead) × scalar / 1e6` where `byte_cost = sum(b == 0 ? 4 : 16) × l1_base_fee` |
| Ecotone | Adds a blob-base-fee component. Linear combo of `l1_base_fee × baseFeeScalar` + `blob_base_fee × blobBaseFeeScalar`. |
| Fjord | Switches the byte-cost component to compressed-size estimation via [Fastlz](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/GasPriceOracle.sol). Cheaper for compressible payloads. |
| Holocene | EIP-1559 params (elasticity, denominator) become per-chain configurable via the `SystemConfig`. |
| Isthmus / Jovian | Operator fee surcharge, min-base-fee floor (chain-by-chain). |

You don't need to handle this branching in dapp code — `GasPriceOracle.getL1Fee` returns the right number. But knowing the model helps when you read [`l1_base_fee`](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/L1Block.sol) values directly off the `L1Block` predeploy.

Full predeploy method binding shipped in [`@ethernauta/op` slice 1](/op/predeploys) — `getL1Fee`, `baseFee`, `decimals`, `gasPrice`, `getL1GasUsed`, etc.

## `estimate_l1_fee` — the path-2 primitive

Need the L1 fee without the 1559 triple — for instance, you already have a signed-but-unsent tx and want to know what it'll cost? Use `estimate_l1_fee` directly:

```ts
import { estimate_l1_fee } from "@ethernauta/op"

const l1_fee = await estimate_l1_fee({
  tx: {
    type: parse(ByteSchema, "0x2"),
    chainId: parse(UintSchema, "0x2105"),  // 8453, Base mainnet
    nonce: parse(UintSchema, "0x0"),
    maxPriorityFeePerGas: parse(UintSchema, "0x1"),
    maxFeePerGas: parse(UintSchema, "0x1"),
    gas: parse(UintSchema, "0x5208"),       // 21000
    to,
    value: parse(UintSchema, "0x0"),
    input: parse(BytesSchema, "0x"),
    gasPrice: parse(UintSchema, "0x0"),
    accessList: [],
  },
})(reader({ chain_id: CHAIN_ID }))
// → Uint256 (wei)
```

Encodes the tx as RLP, calls `GasPriceOracle.getL1Fee(bytes)`, returns the wei amount. One RPC.

## Per-chain quirks

The fee model is OP-Stack-wide but a few chains tune it:

- **Base** — standard OP Stack post-Ecotone. No special handling.
- **Mode** — Ecotone-era. Standard.
- **World Chain** — adds priority-pass for verified humans (PoP), changes the priority-fee dynamics off-chain. The on-chain L1 surcharge math is standard.
- **Soneium** — operator fee surcharge active (Isthmus). `getL1Fee` covers it.

When in doubt, trust `GasPriceOracle.getL1Fee` — it's the chain's own statement of what the user owes.

## What this layer doesn't do

- **No L1 base-fee oracle of our own.** We read `L1Block.basefee()` from the predeploy on the L2, populated by the sequencer from L1. Never query L1 directly to estimate L2 fees ([M4](/concepts/primitives-first)).
- **No fee subsidies / paymaster support.** OP Stack chains don't have native paymaster semantics — that's an ERC-4337 layer concern, see [`/eips/4337`](/eips/4337).
- **No batcher cost modeling.** The library does not try to predict tomorrow's L1 base fee, blob market behavior, or batcher posting cadence. Fees returned reflect *now*; render them in the UI as a quote, not a guarantee.

## See also

- [`/op/overview`](/op/overview) — package introduction.
- [`/op/rpc-methods`](/op/rpc-methods) — op-node RPC namespace.
- [`/op/predeploys`](/op/predeploys) — full predeploy registry including `GasPriceOracle` + `L1Block`.
- [`/eips/1559`](/eips/1559) — EIP-1559 base-fee arithmetic.
- [`/eth/overview`](/eth/overview) — `eth_feeHistory`, `eth_estimateGas`, `eth_getTransactionCount`.
- [`/arbitrum/gas`](/arbitrum/gas) — Arbitrum's L1+L2 split.
- [`/zksync/overview`](/zksync/overview) — zkSync's pubdata-priced fee model.
- [OP Stack fee-mechanism spec](https://specs.optimism.io/protocol/exec-engine.html#fee-mechanism) — authoritative.
- [`GasPriceOracle` source](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/GasPriceOracle.sol)
- [`L1Block` source](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/L1Block.sol)
- [Ecotone hardfork — Optimism blog](https://blog.oplabs.co/ecotone-upgrade/) — the EIP-4844 / blob-base-fee transition.
- [Fjord hardfork — Optimism blog](https://blog.oplabs.co/fjord-upgrade/) — the Fastlz-based fee transition.
