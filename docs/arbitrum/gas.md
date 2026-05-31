---
title: "Gas — the L1+L2 split"
section: Arbitrum
section_order: 10
order: 3
---

# Gas — the L1+L2 split

Arbitrum transactions cost users **twice**:

1. **L2 execution fee** — standard EIP-1559 on the L2: `gas_used × (base_fee + priority_fee)`. Indistinguishable from L1 mainnet in shape, just running on the Nitro sequencer.
2. **L1 batch-posting fee** — the sequencer posts a compressed batch of L2 transactions to L1 via the `SequencerInbox`, and the user pays their share of that L1 cost. Charged as a flat surcharge per transaction, deducted at the moment the user's tx is included in an L2 block.

The Yellow Paper has no concept of (2). It's why `@ethernauta/arbitrum` exists as a separate gas surface from `@ethernauta/eth`.

Authoritative reference: [Gas and fees — Arbitrum docs](https://docs.arbitrum.io/how-arbitrum-works/gas-fees).

## `estimate_arbitrum_fees`

The coarse helper most dapps want. One read against the `NodeInterface` virtual precompile, returns the L1 + L2 gas split.

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport"
import { estimate_arbitrum_fees } from "@ethernauta/arbitrum"
import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { AddressSchema, BytesSchema } from "@ethernauta/core"
import { parse } from "valibot"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_42161.chainId,
})
const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [http("https://arb1.arbitrum.io/rpc")],
  },
])

const to = parse(
  AddressSchema,
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
)
const input = parse(BytesSchema, "0x")

const fees = await estimate_arbitrum_fees({
  tx: { to, input },
})(reader({ chain_id: CHAIN_ID }))

// fees: {
//   gas_estimate: Uint,           // total gas (L1 component already baked in)
//   l1_base_fee_estimate: Uint,   // L1 base fee Nitro is using for surcharge math
//   l2_base_fee: Uint,            // L2 EIP-1559 base fee
// }
```

Under the hood — one RPC, one call, all four numbers decoded from a single ABI return:

```
estimate_arbitrum_fees
└─ NodeInterface.gasEstimateComponents(to, false, data)
   → (gasEstimate, gasEstimateForL1, baseFee, l1BaseFeeEstimate)
```

`gasEstimate` is the **total** gas — Nitro already folded the L1 component into the L2 number, so this is what you pass as `gas` to `eth_signTransaction`. `gasEstimateForL1` is the carved-out L1 portion (useful for UI breakdown but not for transaction sizing); the helper returns it as `gas_estimate` net so callers don't have to add the two.

No knobs — there's nothing for the caller to tune. The L1 base fee comes from the chain; the L2 base fee comes from the chain; the gas estimate runs the same EVM the sequencer would. If you need control over `from` or `value` for the estimate, those parameters extend in later versions.

## The `NodeInterface` virtual precompile

The L1 + L2 split is computed by the `NodeInterface` virtual contract at `0x00000000000000000000000000000000000000C8` on every Nitro chain. Spec: [Arbitrum docs — NodeInterface reference](https://docs.arbitrum.io/build-decentralized-apps/precompiles/reference#nodeinterface). Source: [`NodeInterface.sol`](https://github.com/OffchainLabs/nitro-contracts/blob/main/src/node-interface/NodeInterface.sol).

`NodeInterface` is "virtual" because no contract is actually deployed at `0x00…C8` — the deployed bytecode is just `0xfe` (`INVALID`) to satisfy `extcodesize > 0`. The Nitro Geth instance intercepts calls to this address and answers them in Go. From a dapp's perspective the interaction is identical to a normal `eth_call` — the binding-generator treats it the same.

Other methods on `NodeInterface` (`gasEstimateL1Component`, `estimateRetryableTicket`, `constructOutboxProof`, `findBatchContainingBlock`, `l2BlockRangeForL1`, etc.) ship as primitives in slice 4 of `@ethernauta/arbitrum` — `NodeInterface` is one of the 16 binding targets.

## Why this is simpler than OP Stack

OP Stack needs four reads in parallel (`eth_feeHistory` + `eth_getTransactionCount` + `eth_estimateGas` + `GasPriceOracle.getL1Fee`) followed by an RLP serialization of the unsigned tx. Arbitrum's `gasEstimateComponents` collapses that into one `eth_call`. Two reasons:

1. The Nitro node already knows the L1 base fee — it's polled and surfaced via `ArbGasInfo`. No need to read it from a calldata-passed RLP and apply formula coefficients per hardfork.
2. Arbitrum's L2 gas already absorbs the L1 component; you don't broadcast the L1 fee as a separate value. So the caller doesn't need the underlying L1 RLP byte count.

The downside: there's no path-2 primitive for "I already have a signed tx, what's the L1 fee?". With Arbitrum, you re-run `gasEstimateComponents` against the unsigned tx shape; you can't ask "given this RLP, what would Nitro charge?" without sequencer-side knowledge.

## Per-chain quirks

The fee model is Nitro-wide but Orbit chains tune it:

- **Arbitrum One, Nova, Sepolia** — standard Nitro. No special handling.
- **Xai, ApeChain, Sanko, Proof of Play Apex, Treasure, RARI** — Orbit chains on top of Arbitrum One. Same precompile contract; the L1 base fee Nitro reports is the L2-Arbitrum-One base fee (the Orbit chain's parent), not L1-Ethereum.
- **Plume, Reya** — Orbit chains on top of L1 Ethereum directly. `l1_base_fee_estimate` is the L1-Ethereum base fee.
- **Custom-gas-token Orbit chains** — fees are reported in the chain's native gas token (managed via `ArbNativeTokenManager`). The numbers are valid; the unit of account is whatever the chain configured.

When in doubt, trust `NodeInterface.gasEstimateComponents` — it's the chain's own statement of what the user owes, in the chain's own gas token.

## What this layer doesn't do

- **No L1 base-fee oracle of our own.** We read whatever Nitro reports via `gasEstimateComponents` (which internally reads `ArbGasInfo.getL1BaseFeeEstimate`). Never query L1 directly to estimate L2 fees ([M4](/concepts/primitives-first)).
- **No fee subsidies / paymaster support.** Arbitrum chains don't have native paymaster semantics — that's an ERC-4337 layer concern, see [`/eips/4337`](/eips/4337).
- **No batcher cost modeling.** The library does not try to predict tomorrow's L1 base fee or batcher posting cadence. Fees returned reflect *now*; render them in the UI as a quote, not a guarantee.

## See also

- [`/arbitrum/overview`](/arbitrum/overview) — package introduction.
- [`/op/gas`](/op/gas) — the sibling OP-Stack fee model.
- [`/eips/1559`](/eips/1559) — EIP-1559 base-fee arithmetic.
- [`/eth/overview`](/eth/overview) — substrate `eth_*` methods.
- [`/gas/overview`](/gas/overview) — `@ethernauta/gas` (zkSync still lives there).
- [Arbitrum gas + fees — Arbitrum docs](https://docs.arbitrum.io/how-arbitrum-works/gas-fees) — authoritative.
- [`NodeInterface` source](https://github.com/OffchainLabs/nitro-contracts/blob/main/src/node-interface/NodeInterface.sol)
- [`ArbGasInfo` source](https://github.com/OffchainLabs/nitro-contracts/blob/main/src/precompiles/ArbGasInfo.sol)
- [Arbitrum precompiles reference](https://docs.arbitrum.io/build-decentralized-apps/precompiles/reference)
