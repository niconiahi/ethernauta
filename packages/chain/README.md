[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/chain@0.0.10&treeshake=[*])](https://deno.bundlejs.com/badge?q=@ethernauta/chain@0.0.10&treeshake=[*])

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains)
- [chain schema](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

## Modules

- [abi](https://github.com/niconiahi/ethernauta/blob/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/blob/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/blob/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [erc](https://github.com/niconiahi/ethernauta/blob/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [utils](https://github.com/niconiahi/ethernauta/blob/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet)

## Table of contents

1. [chain](#chain)

## API

```tsx
import { eip155_1, encode_chain_id, decode_chain_id } from "@ethernauta/chain"
const chain_id = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
}) 
console.log(chain_id)// eip155:11155111
const { namespace, reference } = decode_chain_id(chain_id)
console.log(namespace)// eip155
console.log(reference)// 11155111
```

## Files to pay attention

- [indexer.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/src/indexer.ts)

### chain

- [chain/shared.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/src/chain/shared.ts)
- [chain/eip155/eip155-1.tsx](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/src/chain/eip155/eip155-1.ts)
