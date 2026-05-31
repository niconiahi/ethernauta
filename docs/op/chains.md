---
title: "Chains"
section: OP Stack
section_order: 9
order: 5
---

# Chains

> 🚧 **In progress — landing with slice 4 of the OP package plan.** Typed chain entries (`packages/op/lib/chains/*`) and the address registry (`packages/op/lib/addresses.ts`) ship in slice 4, sourced from [`ethereum-optimism/superchain-registry`](https://github.com/ethereum-optimism/superchain-registry). Today the package surface depends on a chain ID via the standard [`@ethernauta/chain`](/chain/overview) entries (`eip155-10`, `eip155-8453`, …) — that already works for everything except per-chain deployment addresses.

OP Stack ships as a *family* of chains. Same code, same predeploy addresses, same op-node — but each chain has its own L1 deployment (portal address, dispute-game factory address, batcher EOA, sequencer feeds, fault-proof settings). The `@ethernauta/op` `lib/chains/*` layer carries those typed per-chain entries.

## Target chain list (v1)

Drawn from the canonical [superchain-registry](https://github.com/ethereum-optimism/superchain-registry) — the OP-maintained source of truth for OP Stack chain definitions.

### Production

| Chain | chain_id | Docs | Registry entry |
|---|---|---|---|
| Optimism Mainnet | `10` | [docs.optimism.io](https://docs.optimism.io/) | [superchain-registry/optimism/](https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/configs/mainnet/op.toml) |
| Base | `8453` | [docs.base.org](https://docs.base.org/) | [superchain-registry/base/](https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/configs/mainnet/base.toml) |
| Mode | `34443` | [docs.mode.network](https://docs.mode.network/) | [superchain-registry/mode/](https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/configs/mainnet/mode.toml) |
| Zora | `7777777` | [docs.zora.co](https://docs.zora.co/) | [superchain-registry/zora/](https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/configs/mainnet/zora.toml) |
| World Chain | `480` | [docs.world.org/world-chain](https://docs.world.org/world-chain/quick-start/info) | [superchain-registry/worldchain/](https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/configs/mainnet/worldchain.toml) |
| Soneium | `1868` | [docs.soneium.org](https://docs.soneium.org/) | [superchain-registry/soneium/](https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/configs/mainnet/soneium.toml) |
| Lisk | `1135` | [docs.lisk.com](https://docs.lisk.com/) | [superchain-registry/lisk/](https://github.com/ethereum-optimism/superchain-registry/tree/main/superchain/configs/mainnet/lisk.toml) |

### Testnets

| Chain | chain_id | Docs |
|---|---|---|
| OP Sepolia | `11155420` | [docs.optimism.io](https://docs.optimism.io/) |
| Base Sepolia | `84532` | [docs.base.org](https://docs.base.org/) |
| Mode Sepolia | `919` | [docs.mode.network](https://docs.mode.network/) |
| Zora Sepolia | `999999999` | [docs.zora.co](https://docs.zora.co/) |
| World Sepolia | `4801` | [docs.world.org](https://docs.world.org/world-chain) |
| Soneium Minato | `1946` | [docs.soneium.org](https://docs.soneium.org/) |

The full list is large and growing. The canonical and always-current source is the [superchain-registry repository](https://github.com/ethereum-optimism/superchain-registry) — `@ethernauta/op` slice 4 will track this list mechanically via `scripts/pull-superchain-registry.ts`.

## Typed chain entries (planned shape)

```ts
import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { type OpDeployments, OpDeploymentsSchema } from "@ethernauta/op"
import { parse } from "valibot"

export const op_mainnet = {
  base: eip155_10,
  deployments: parse(OpDeploymentsSchema, {
    l1_standard_bridge: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
    l1_cross_domain_messenger: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1",
    optimism_portal: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed",
    l2_output_oracle: "0xdfe97868233d1aa3e83a5b04e62a9b9fdaab1395",
    l2_standard_bridge: "0x4200000000000000000000000000000000000010",
    // …
  }),
}
```

`OpDeploymentsSchema` is precise — no `unknown`, no widely-typed union. Each OP Stack chain has the same deployment *shape*; only the addresses differ.

The `base` field references the existing chain definition in [`@ethernauta/chain`](/chain/overview) — RPC URLs, chain ID, native-token symbol, explorers. The `deployments` field is the OP-specific addition.

## Using a chain entry today

Until slice 4 lands, work directly off the existing `@ethernauta/chain` entries:

```ts
import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import { create_reader, encode_chain_id, http } from "@ethernauta/transport"
import { estimate_op_fees } from "@ethernauta/op"

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

// All predeploy reads work — they live at 0x420… on every OP Stack chain.
const fees = await estimate_op_fees({ /* … */ })(reader({ chain_id: CHAIN_ID }))
```

The L1 deployment addresses (portal, dispute-game factory, etc.) you need to hardcode or pull manually from the superchain-registry. Slice 4 fixes that.

## See also

- [`/op/overview`](/op/overview) — package introduction.
- [`/op/predeploys`](/op/predeploys) — the L2-side predeploys (same address on every chain).
- [`/chain/overview`](/chain/overview) — base `@ethernauta/chain` definitions this layer builds on.
- [superchain-registry](https://github.com/ethereum-optimism/superchain-registry) — source of truth for OP Stack chain definitions.
- [Superchain explainer](https://docs.optimism.io/superchain/superchain-explainer) — what membership in the Superchain entails.
