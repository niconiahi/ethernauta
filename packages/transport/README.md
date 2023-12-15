## Philosophy
This module aims to be an un-opinionated representation of the defined [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains) in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## Schema
The official Ethereum validation schema is defined in [this file](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

## API

### reader

```tsx
import { createReader, httpTransport } from "@ethernauta/transport"

const reader = createReader([
  httpTransport("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba8177"),
])
```

### writer

```tsx
import { createWriter, httpTransport } from "@ethernauta/transport"
import { walletConnect } from "@ethernauta/connector" // not yet implemented

const writer = createWriter(
  httpTransport(walletConnect())
)
```

### Files to pay attention
1. [base/call/call.ts](src/base/call/call.ts)
2. [http/http.ts](src/http/http.ts)
3. [json-rpc/json-rpc.ts](src/json-rpc/json-rpc.ts)
4. [reader/reader.ts](src/reader/reader.ts)
5. [writer/writer.ts](src/writer/writer.ts)
