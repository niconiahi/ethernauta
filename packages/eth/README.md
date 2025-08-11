[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/eth@0.0.10&treeshake=[*])](https://deno.bundlejs.com/badge?q=@ethernauta/eth@0.0.10&treeshake=[*])

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Ethereum schemas](https://github.com/ethereum/execution-apis/tree/main/src/schemas)
- [Ethereum base methods](https://github.com/ethereum/execution-apis/tree/main/src/eth)
- [abi-spec](https://docs.soliditylang.org/en/latest/abi-spec.html)

## Modules

- [chain](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/README.md)
- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/README.md)
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/README.md)
- [transport](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/README.md)
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/README.md)

## Table of contents

1. [API](#api)
2. [core](#core)
4. [abi](#abi)
5. [method](#method)

## API

### Reading from the blockchain

```ts
import { eth_getBlockByHash } from "@ethernauta/eth";
import { reader, SEPOLIA_CHAIN_ID } from "./reader";

const readable = eth_getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
]);
const block = await readable(reader(SEPOLIA_CHAIN_ID));
```

### Signing a transaction

```ts
import { eth_sendRawTransaction } from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/wallet"

const method = "transfer"
const ADDRESS = "0x515e9e0565fdddd4f8a9759744734154da453585"
const params = [ADDRESS, number_to_hex(1)]
const signed_transaction = await window.wallet.sign(
  method,
  params,
)
```

### Writting to the blockchain

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
await writable(writer(SEPOLIA_CHAIN_ID))
```

### Reacting to transaction states

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

## Files to pay attention

### core

- [block.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/block.ts)
- [client.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/client.ts)
- [filter.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/filter.ts)
- [receipt.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/receipt.ts)
- [state.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/state.ts)
- [withdrawal.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/withdrawal.ts)

#### base

- [address.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/address.ts)
- [addressses.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/addresses.ts)
- [base/byte.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/byte.ts)
- [base/bytes/ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/core/base/bytes.ts)
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

### abi

- [abi/error.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/abi/error.ts)
- [abi/client.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/abi/event.ts)
- [abi/shared.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/abi/shared.ts)

#### function

- [function/shared.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/abi/function/shared.ts)
- [function/function.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/abi/function/function.ts)
- [function/constructor.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/abi/function/constructor.ts)
- [function/fallback.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/abi/function/fallback.ts)
- [function/receive.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/abi/function/receive.ts)

### method

#### eip

- [eip/1102/request-accounts/request-accounts.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/src/method/eip/1102/request-accounts.ts)

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
