[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/chain@0.0.10&treeshake=[*])](https://deno.bundlejs.com/badge?q=@ethernauta/chain@0.0.10&treeshake=[*])

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains)
- [chain schema](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

## Modules

- [chain](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/README.md)
- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/README.md)
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/README.md)
- [transport](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/README.md)
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/README.md)

## Table of contents

1. [chain](#chain)

## API

```tsx
import { eip155_1, encodeChainId, decodeChainId } from "@ethernauta/chain"
const chainId = encodeChainId({
  namespace: "eip155",
  reference: eip155_1.chainId,
}) 
console.log(chainId)// eip155:11155111
const { namespace, reference } = decodeChainId(chainId)
console.log(namespace)// eip155
console.log(reference)// 11155111
```

## Files to pay attention

### chain

- [indexer.tsx](src/indexer.ts)
- [shared.tsx](src/chain/shared.ts)
- [eip155-1](src/chain/eip155/eip155-1.ts)
