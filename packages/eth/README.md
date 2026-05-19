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
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
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
import {
  register_transaction,
  watch_transaction,
} from "@ethernauta/transaction"

const transaction = register_transaction(hash)
watch_transaction(hash, (transaction) => {
  // subsequent states that the transaction goes through
})
```

## Files to pay attention

### core

- [block.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/block.ts)
- [client.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/client.ts)
- [filter.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/filter.ts)
- [receipt.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/receipt.ts)
- [state.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/state.ts)
- [withdrawal.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/withdrawal.ts)

#### base

- [base/address.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/address.ts)
- [base/addresses.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/addresses.ts)
- [base/byte.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/byte.ts)
- [base/bytes.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/bytes.ts)
- [base/bytes-8.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/bytes-8.ts)
- [base/bytes-32.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/bytes-32.ts)
- [base/bytes-48.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/bytes-48.ts)
- [base/bytes-65.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/bytes-65.ts)
- [base/bytes-256.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/bytes-256.ts)
- [base/bytes-max-32.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/bytes-max-32.ts)
- [base/hash-32.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/hash-32.ts)
- [base/not-found.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/not-found.ts)
- [base/ratio.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/ratio.ts)
- [base/uint.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/uint.ts)
- [base/uint-64.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/uint-64.ts)
- [base/uint-256.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/uint-256.ts)

#### transaction

- [transaction/1559.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/1559.ts)
- [transaction/2930.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/2930.ts)
- [transaction/4844.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/4844.ts)
- [transaction/access-list.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/access-list.ts)
- [transaction/generic.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/generic.ts)
- [transaction/info.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/info.ts)
- [transaction/legacy.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/legacy.ts)
- [transaction/signed.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/signed.ts)
- [transaction/unsigned.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/transaction/unsigned.ts)

### method

#### block

- [block/get-block-by-hash.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/block/get-block-by-hash.ts)
- [block/get-block-by-number.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/block/get-block-by-number.ts)
- [block/get-block-receipts.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/block/get-block-receipts.ts)
- [block/get-block-transaction-count-by-hash.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/block/get-block-transaction-count-by-hash.ts)
- [block/get-block-transaction-count-by-number.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/block/get-block-transaction-count-by-number.ts)
- [block/get-uncle-count-by-block-hash.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/block/get-uncle-count-by-block-hash.ts)
- [block/get-uncle-count-by-block-number.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/block/get-uncle-count-by-block-number.ts)

#### client

- [client/accounts.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/client/accounts.ts)
- [client/block-number.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/client/block-number.ts)
- [client/chain-id.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/client/chain-id.ts)
- [client/coinbase.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/client/coinbase.ts)
- [client/syncing.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/client/syncing.ts)

#### execute

- [execute/call.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/execute/call.ts)
- [execute/create-access-list.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/execute/create-access-list.ts)
- [execute/estimate-gas.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/execute/estimate-gas.ts)

#### fee-market

- [fee-market/fee-history.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/fee-market/fee-history.ts)
- [fee-market/gas-price.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/fee-market/gas-price.ts)
- [fee-market/max-priority-fee-per-gas.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/fee-market/max-priority-fee-per-gas.ts)

#### filter

- [filter/get-filter-changes.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/filter/get-filter-changes.ts)
- [filter/get-filter-logs.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/filter/get-filter-logs.ts)
- [filter/get-logs.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/filter/get-logs.ts)
- [filter/new-block-filter.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/filter/new-block-filter.ts)
- [filter/new-filter.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/filter/new-filter.ts)
- [filter/new-pending-transaction-filter.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/filter/new-pending-transaction-filter.ts)
- [filter/uninstall-filter.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/filter/uninstall-filter.ts)

#### sign

- [sign/sign.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/sign/sign.ts)
- [sign/sign-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/sign/sign-transaction.ts)

#### state

- [state/get-balance.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/state/get-balance.ts)
- [state/get-code.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/state/get-code.ts)
- [state/get-proof.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/state/get-proof.ts)
- [state/get-storage-at.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/state/get-storage-at.ts)
- [state/get-transaction-count.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/state/get-transaction-count.ts)

#### submit

- [submit/send-raw-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/submit/send-raw-transaction.ts)
- [submit/send-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/submit/send-transaction.ts)

#### transaction

- [transaction/get-transaction-by-block-hash-and-index.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/transaction/get-transaction-by-block-hash-and-index.ts)
- [transaction/get-transaction-by-block-number-and-index.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/transaction/get-transaction-by-block-number-and-index.ts)
- [transaction/get-transaction-by-hash.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/transaction/get-transaction-by-hash.ts)
- [transaction/get-transaction-receipt.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/transaction/get-transaction-receipt.ts)
