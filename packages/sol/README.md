## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Solana base methods](https://solana.com/docs/rpc/http)

It does so in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## Table of contents

1. [API](#api)
2. [core](#core)
3. [chain](#chain)
4. [abi](#abi)

## API

```tsx
import { createReader, http } from "@ethernauta/transport"
import { getBalance } from "@ethernauta/sol"

const reader = createReader([
  http("https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"),
])
const readable = getBalance(["5U3bH5b6XtG99aVWLqwVzYPVpQiFHytBD68Rz2eFPZd7"])
const balance = await readable(reader)
```

## Files to pay attention

### method

- [get-balance/get-balance.ts](src/method/get-balance/get-balance.ts)

### Tests

- [x] Correctly gets balance of an address [Go to file](src/method/get-balance/get-balance.test.ts)
