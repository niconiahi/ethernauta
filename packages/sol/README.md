This module aims to be an un-opinionated representation of the defined:

- [Solana base methods](https://solana.com/docs/rpc/http)

## Table of contents

1. [API](#api)
2. [core](#core)
3. [chain](#chain)
4. [abi](#abi)

## API

```tsx
import { createReader, http } from "@ethernauta/transport";
import { getBalance } from "@ethernauta/sol";

const reader = createReader([
  http(
    "https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"
  ),
]);
const readable = getBalance(["5U3bH5b6XtG99aVWLqwVzYPVpQiFHytBD68Rz2eFPZd7"]);
const balance = await readable(reader);
```

## Files to pay attention

### core

- [core/uint-64](src/core/base/uint-64/uint-64.ts)
- [core/address](src/core/base/address/address.ts)

### method

- [getBalance](src/method/get-balance/get-balance.ts)
- [getLatestBlockhash](src/method/get-latest-blockhash/get-latest-blockhash.ts)
- [getMinimumBalanceForRentExemption](src/method/get-minimum-balance-for-rent-exemption/get-minimum-balance-for-rent-exemption.ts)
- [sendTransaction](src/method/send-transaction/send-transaction.ts)
- [simulateTransaction](src/method/simulate-transaction/simulate-transaction.ts)

### Tests

- [x] Correctly gets balance of an address [Go to file](src/method/get-balance/get-balance.test.ts)
- [x] Correctly gets the latest blockhash [Go to file](src/method/get-latest-blockhash/get-latest-blockhash.test.ts)
- [x] Correctly gets minimum balance for rent exemption [Go to file](src/method/get-minimum-balance-for-rent-exemption/get-minimum-balance-for-rent-exemption.test.ts)

## Additional

This is `solana-web3`'s [implementation of "getBalance" RPC method](https://github.com/solana-labs/solana-web3.js/blob/master/packages/rpc-core/src/rpc-methods/getBalance.ts) vs [the implementation of it in this library](src/method/get-balance/get-balance.ts)
