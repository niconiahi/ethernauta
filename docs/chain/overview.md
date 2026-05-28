---
title: "@ethernauta/chain"
section: Overview
section_order: 7
order: 4
---

# @ethernauta/chain

A registry of 500+ EIP-155 chain definitions. Each chain is a structured object carrying its chain ID, native currency, public RPC endpoints, block explorers, ENS registry (where applicable), bridges, and feature flags.

```bash
pnpm add @ethernauta/chain
```

## The shape of a chain

```ts
import type { Chain } from "@ethernauta/chain";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

eip155_1
// {
//   chain_id: 1,
//   name: "Ethereum Mainnet",
//   short_name: "eth",
//   native_currency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpc: ["https://eth.llamarpc.com", ...],
//   explorers: [{ name: "Etherscan", url: "...", standard: "EIP3091" }],
//   ens: { registry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
//   features: ["EIP1559"],
//   ...
// }
```

The full `Chain` schema is exported (`ChainSchema`); inferred type is `Chain`. Adjunct types: `NativeCurrency`, `Explorer`, `Bridge`, `Parent`, `EnsRegistry`, `Feature`, `ShortName`, `RedFlagSchema`.

## Naming convention

Every chain is exported as `eip155_<chain_id>`:

```ts
import { eip155_1 } from "@ethernauta/chain/eip155-1";          // Ethereum Mainnet
import { eip155_10 } from "@ethernauta/chain/eip155-10";        // OP Mainnet
import { eip155_137 } from "@ethernauta/chain/eip155-137";      // Polygon
import { eip155_8453 } from "@ethernauta/chain/eip155-8453";    // Base
import { eip155_42161 } from "@ethernauta/chain/eip155-42161";  // Arbitrum One
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"; // Sepolia
```

The name disambiguates testnets, L2s, sidechains, and forks unambiguously. Chain ID is the only thing that's ever truly identifying.

## Using a chain with a resolver

```ts
import { create_reader } from "@ethernauta/transport";
import { eth_blockNumber } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { eip155_8453 } from "@ethernauta/chain/eip155-8453";
import { eip155_42161 } from "@ethernauta/chain/eip155-42161";

const reader = create_reader([eip155_1, eip155_8453, eip155_42161]);

// pick at call time
const eth_block = await eth_blockNumber()(
  reader({ chain_id: eip155_1.chain_id }),
);
const base_block = await eth_blockNumber()(
  reader({ chain_id: eip155_8453.chain_id }),
);
```

The reader doesn't fetch any chain it wasn't told about. The list you pass is the resolver's universe.

## Why a registry

**No magic strings.** `chain_id: 1` is correct but unreadable. `chain_id: eip155_1.chain_id` puts the chain at the call site.

**Self-contained RPCs.** Each chain carries its own RPC URL list. The HTTP transport rotates through them on failure. No environment variable to wire, no separate config file to maintain.

**ENS-aware.** Chains that have an ENS deployment (Ethereum, Goerli, Sepolia, Holesky) carry their registry address. The ENS resolution flow looks it up automatically.

**EIP-155 by definition.** The registry is keyed on the canonical chain ID, so re-broadcast attacks across forks can't happen by accident.

## Picking a custom RPC

```ts
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const my_chain = {
  ...eip155_1,
  rpc: ["https://my-private-rpc.example.com"],
};

const reader = create_reader([my_chain]);
```

`Chain` is a plain object. Override what you need. The schema is permissive — the only required fields are `chain_id`, `name`, `rpc`.

## See also

- [@ethernauta/transport](/transport/overview) — the resolver factories that consume `Chain[]`.
- [EIP-3085 → wallet_addEthereumChain](/eips/3085) — adding a chain to a wallet at runtime.
- [EIP-3326 → wallet_switchEthereumChain](/eips/3326) — switching chains.
