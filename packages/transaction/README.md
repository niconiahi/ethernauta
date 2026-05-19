[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/transaction&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/transaction&treeshake=[*])

## Philosophy

This module tracks the lifecycle of transactions you've submitted to the blockchain. It implements a polling system that every few seconds calls `eth_getTransactionReceipt` to advance a transaction from `pending` to `mined` or `reverted`.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

```ts
import { transfer } from "@ethernauta/erc/20"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import {
  register_transaction,
  watch_transaction,
} from "@ethernauta/transaction"
import { number_to_hex } from "@ethernauta/utils"
import { signer, writer, SEPOLIA_CHAIN_ID } from "./resolvers"

const TOKEN_ADDRESS = "0x..."
const signed = await transfer([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  number_to_hex(1),
])(signer({ chain_id: SEPOLIA_CHAIN_ID, to: TOKEN_ADDRESS }))

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: SEPOLIA_CHAIN_ID }),
)

// initial transaction state with status "pending"
const transaction = register_transaction(hash)
watch_transaction(hash, (transaction) => {
  // subsequent states the transaction goes through
  // (status: "mined" | "reverted")
})
```

### Files to pay attention

- [transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/src/transaction.ts)
- [register-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/src/register-transaction.ts)
- [set-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/src/set-transaction.ts)
- [watch-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/src/watch-transaction.ts)
