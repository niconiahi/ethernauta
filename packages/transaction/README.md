[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/transaction@0.0.10&treeshake=[*])](https://deno.bundlejs.com/badge?q=@ethernauta/transaction@0.0.10&treeshake=[*])

## Philosophy

This module allows to track transactions submitted to the blockchain. It implements a pooling system that every few seconds will call `eth_getTransactionReceipt` to get the latest transaction's status

## Modules

- [chain](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/README.md)
- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/README.md)
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/README.md)
- [transport](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/README.md)
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/README.md)

## API

```ts
import { eth_sendRawTransaction } from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/wallet"
import { writer, SEPOLIA_CHAIN_ID } from "./writer"

const method = "transfer"
const ADDRESS = "0x515e9e0565fdddd4f8a9759744734154da453585"
const params = [ADDRESS, number_to_hex(1)]
const signed_transaction = await window.wallet.sign(
  method,
  params,
)
const writable = eth_sendRawTransaction([
  signed_transaction,
])
const hash = await writable(writer(SEPOLIA_CHAIN_ID))
// initial transaction state 
// with "type" key equal "pending"
const transaction = register_transaction(hash)
watch_transaction(hash, (transaction) => {
  // subsequent states that the transaction goes trough
})
```

### Files to pay attention

- [transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/src/transaction.ts)
- [set-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/src/set-transaction.ts)
- [watch-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/src/watch-transaction.ts)
- [register-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/src/register-transaction.ts)
