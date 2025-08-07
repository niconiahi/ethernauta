## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains)
- [chain schema](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

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

- [indexer.tsx](src/chain/indexer/indexer.ts)
- [shared.tsx](src/chain/shared/shared.ts)
- [eip155-1](src/chain/eip155/eip155-1/eip155-1.ts)
