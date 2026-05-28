[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/chain&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/chain&treeshake=[*])

## Philosophy

This module is an un-opinionated representation of the public chain catalogue:

- [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains)
- [chain schema](https://github.com/ethereum-lists/chains/blob/master/tools/schema/ChainSchema.json)

Every chain in the upstream list is exported as a const named `eip155_<chainId>` (one file per chain). Pair the const with `encode_chain_id` from `@ethernauta/transport` to produce a [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md) identifier that every Ethernauta resolver factory accepts.

A small derivation tool — `runIndexer` — refreshes the catalogue from the upstream repository.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### Chain consts — one per EIP-155 chain

```ts
import {
  eip155_1,           // Ethereum Mainnet
  eip155_10,          // OP Mainnet
  eip155_8453,        // Base
  eip155_42161,       // Arbitrum One
  eip155_11155111,    // Sepolia
  // …500+ exports
} from "@ethernauta/chain"

// Each const exposes the upstream `ChainSchema` shape:
//   { name, shortName, chainId, networkId, nativeCurrency,
//     rpc, explorers, … }
```

### Pair a chain with a CAIP-2 id

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import { decode_chain_id, encode_chain_id } from "@ethernauta/transport"

const chain_id = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
console.log(chain_id) // "eip155:11155111"

const { namespace, reference } = decode_chain_id(chain_id)
console.log(namespace) // "eip155"
console.log(reference) // "11155111"
```

### Schemas

```ts
import {
  type Chain,
  ChainSchema,
  type Feature,
  type NativeCurrency,
  type Explorer,
  type Bridge,
  type Parent,
  type EnsRegistry,
  type ShortName,
  ShortNameSchema,
  type RedFlagSchema,
} from "@ethernauta/chain"

// `ChainSchema` matches the upstream JSON schema and is what
// every `eip155_*` export validates against at build time.
```

### Refresh the catalogue

```bash
pnpm --filter @ethernauta/chain indexer
```

The `indexer` script pulls the latest definitions from [ethereum-lists/chains](https://github.com/ethereum-lists/chains), validates each against `ChainSchema`, and writes one TS file per chain under `src/chain/eip155/`.
