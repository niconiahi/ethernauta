## Philosophy
This module aims to be an un-opinionated representation of the defined [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains) in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## Schema
The official Ethereum validation schema is defined in [this file](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

## API

```tsx
import { eip155_100001 } from "@ethernauta/chain"

const quarkChain = eip155_100001
```

### Files to pay attention
1. [indexer.tsx](src/indexer/indexer.ts)
2. [shared.tsx](src/shared/shared.ts)
