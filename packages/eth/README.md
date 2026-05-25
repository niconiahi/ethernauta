[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/eth&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/eth&treeshake=[*])

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Ethereum schemas](https://github.com/ethereum/execution-apis/tree/main/src/schemas)
- [Ethereum base methods](https://github.com/ethereum/execution-apis/tree/main/src/eth)

Methods come in three shapes:

- `Readable<T>` for state queries (`eth_getBalance`, `eth_getBlockByHash`, …) — consumed by a reader resolver
- `Writable<T>` for state mutations (`eth_sendRawTransaction`) — consumed by a writer resolver
- `Signable<T>` for wallet operations (`eth_signTransaction`, `eth_sign`) — consumed by a signer resolver

This package is also the canonical home of the Ethereum schemas — `addressSchema`, `Bytes`, `Uint256`, the block / transaction / receipt schemas. Other packages import these from here.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### Reading from the blockchain

```ts
import { eth_getBlockByHash } from "@ethernauta/eth"
import { reader, SEPOLIA_CHAIN_ID } from "./reader"

const readable = eth_getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
])
const block = await readable(reader({ chain_id: SEPOLIA_CHAIN_ID }))
```

### Signing and broadcasting a transaction

```ts
import {
  eth_sendRawTransaction,
  eth_signTransaction,
} from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/utils"
import { signer, writer, SEPOLIA_CHAIN_ID } from "./resolvers"

const signed_transaction = await eth_signTransaction([
  {
    to: "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
    value: number_to_hex(1),
  },
])(signer({ chain_id: SEPOLIA_CHAIN_ID }))

const hash = await eth_sendRawTransaction([signed_transaction])(
  writer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Reacting to transaction states

```ts
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import { hex_to_number } from "@ethernauta/utils"
import { reader, SEPOLIA_CHAIN_ID } from "./reader"

// Single-hash UI tracking — inline ~10-line poll. The wallet
// owns batched-call tracking via EIP-5792 (wallet_getCallsStatus);
// for a single tx, just poll the receipt directly.
const interval_id = setInterval(async () => {
  const receipt = await eth_getTransactionReceipt([hash])(
    reader({ chain_id: SEPOLIA_CHAIN_ID }),
  )
  if (!receipt || !receipt.status) return
  const status = hex_to_number(receipt.status) === 1 ? "mined" : "reverted"
  // update your UI with `status` and `hash`
  clearInterval(interval_id)
}, 2000)
```

