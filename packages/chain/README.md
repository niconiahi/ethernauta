[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/chain&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/chain&treeshake=[*])

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains)
- [chain schema](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

Each chain is exported as a const that you can pair with `encode_chain_id` (from `@ethernauta/transport`) to produce a [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md) identifier.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import {
  decode_chain_id,
  encode_chain_id,
} from "@ethernauta/transport"

const chain_id = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
console.log(chain_id) // eip155:11155111

const { namespace, reference } = decode_chain_id(chain_id)
console.log(namespace) // eip155
console.log(reference) // 11155111
```

## Files to pay attention

- [indexer.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/src/indexer.ts)

### chain

- [chain/shared.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/src/chain/shared.ts)
- [chain/eip155](https://github.com/niconiahi/ethernauta/tree/main/packages/chain/src/chain/eip155) (500+ chain definitions)
