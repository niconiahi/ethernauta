## Philosophy

This module aims to be an un-opinionated representation of the defined [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains) in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## Schema

The official Ethereum validation schema is defined in [this file](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

## API

```tsx
import { getBlockByHash } from "@ethernauta/method"
import { createReader, http } from "@ethernauta/transport"
import { eip155_1, eip155_11155111, eip155_3 } from "@ethernauta/chain"

const currentChain = eip155_1
const reader = createReader([
  {
    chain: eip155_1,
    transports: [
      http("https://doggy-hazelnut-hat.ethereum-mainnet.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba4179"),
      http("https://doggy-hazelnut-hat.ethereum-mainnet.quiknode.pro/71bd09c56eb85b1c222871faa17483fa65ba6167"),
    ]
  },
  {
    chain: eip155_11155111,
    transports: [
      http("https://doggy-hazelnut-hat.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba4179"),
      http("https://doggy-hazelnut-hat.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c222871faa17483fa65ba6167"),
    ]
  },
])
const readable = getBlockByHash(["0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26", false])

// target one chain
const block = await readable(reader(eip155_11155111))

// or the other
const block = await readable(reader(eip155_1))

// or lets you know if an incompatible reader is being used.
// you definitely need transports for the chain you are targeting,
// thus erroring out seems reasonable. You are the one controlling which
// chains can be used here
const block = await readable(reader(eip155_2)) // Error
```

### Files to pay attention

1. [indexer.tsx](src/indexer/indexer.ts)
2. [shared.tsx](src/shared/shared.ts)
