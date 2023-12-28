## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Ethereum schemas](https://github.com/ethereum/execution-apis/tree/main/src/schemas)
- [Ethereum base methods](https://github.com/ethereum/execution-apis/tree/main/src/eth)
- [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains)
- [abi-spec](https://docs.soliditylang.org/en/latest/abi-spec.html)
- [chain schema](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

It does so in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## Table of contents

1. [API](#api)
2. [core](#core)
3. [chain](#chain)
4. [abi](#abi)
5. [method](#method)

## API

```tsx
import { safeParse } from "valibot"
import { addressSchema, eip155_1, getBlockByHash } from "@ethernauta/eth"
import { createReader, http } from "@ethernauta/transport"

const someAddress = "5U3bH5b6XtG99aVWLqwVzYPVpQiFHytBD68Rz2eFPZd7"
const { success: isAddress } = safeParse(addressSchema, someAddress)

const reader = createReader([
  http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba8177"),
])
const readable = getBlockByHash(["0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26", false])
const block = await readable(reader)
```

## Files to pay attention

### core

#### block

- [block/block.ts](src/block/block.ts)

#### client

- [client/client.ts](src/client/client.ts)

#### filter

- [filter/filter.ts](src/filter/filter.ts)

#### receipt

- [receipt/receipt.ts](src/receipt/receipt.ts)

#### state

- [state/state.ts](src/state/state.ts)

#### withdrawal

- [withdrawal/withdrawal.ts](src/withdrawal/withdrawal.ts)

#### address

- [address/address.ts](src/base/address/address.ts)

#### addresses

- [addresses/addressses.ts](src/base/addresses/addresses.ts)

#### base

- [base/byte/byte.ts](src/base/byte/byte.ts)
- [base/bytes/bytes/ts](src/base/bytes/bytes.ts)
- [base/bytes-8/bytes-8.ts](src/base/bytes-8/bytes-8.ts)
- [base/bytes-32/bytes-32.ts](src/base/bytes-32/bytes-32.ts)
- [base/bytes-48/bytes-48.ts](src/base/bytes-48/bytes-48.ts)
- [base/bytes-65/bytes-65.ts](src/base/bytes-65/bytes-65.ts)
- [base/bytes-256/bytes-256.ts](src/base/bytes-256/bytes-256.ts)
- [base/bytes-max-32/bytes-max-32.ts](src/base/bytes-max-32/bytes-max-32.ts)
- [base/hash-32/hash-32.ts](src/base/hash-32/hash-32.ts)
- [base/not-found/not-found.ts](src/base/not-found/not-found.ts)
- [base/ratio/ratio.ts](src/base/ratio/ratio.ts)
- [base/uint/uint.ts](src/base/uint/uint.ts)
- [base/uint-64/uint-64.ts](src/base/uint-64/uint-64.ts)
- [base/uint-256/uint-256.ts](src/base/uint-256/uint-256.ts)

#### transaction

- [transaction/1559/1559.ts](src/transaction/1559/1559.ts)
- [transaction/2930/2930.ts](src/transaction/2930/2930.ts)
- [transaction/4844/4844.ts](src/transaction/4844/4844.ts)
- [transaction/access-list/access-list.ts](src/transaction/access-list/access-list.ts)
- [transaction/generic/generic.ts](src/transaction/generic/generic.ts)
- [transaction/info/info.ts](src/transaction/info/info.ts)
- [transaction/legacy/legacy.ts](src/transaction/legacy/legacy.ts)
- [transaction/signed/signed.ts](src/transaction/signed/signed.ts)
- [transaction/unsigned/unsigned.ts](src/transaction/unsigned/unsigned.ts)

### chain

- [indexer.tsx](src/chain/indexer/indexer.ts)
- [shared.tsx](src/chain/shared/shared.ts)
- [eip155-1](src/chain/eip155/eip155-1/eip155-1.ts)

### abi

#### error

- [error/error.ts](src/error/error.ts)

#### client

- [client/client.ts](src/event/event.ts)

#### shared

- [shared/shared.ts](src/shared/shared.ts)

#### function

- [function/shared/shared.ts](src/function/shared/shared.ts)
- [function/function/function.ts](src/function/function/function.ts)
- [function/constructor/constructor.ts](src/function/constructor/constructor.ts)
- [function/fallback/fallback.ts](src/function/fallback/fallback.ts)
- [function/receive/receive.ts](src/function/receive/receive.ts)
- [error/error.ts](src/error/error.ts)

#### client

- [client/client.ts](src/event/event.ts)

#### shared

- [shared/shared.ts](src/shared/shared.ts)

#### function

- [function/shared/shared.ts](src/function/shared/shared.ts)
- [function/function/function.ts](src/function/function/function.ts)
- [function/constructor/constructor.ts](src/function/constructor/constructor.ts)
- [function/fallback/fallback.ts](src/function/fallback/fallback.ts)
- [function/receive/receive.ts](src/function/receive/receive.ts)

### method

#### eip-1102

- [eip/1102/request-accounts/request-accounts.ts](src/eip/1102/request-accounts/request-accounts.ts)

#### block

- [block/get-block-by-hash/get-block-by-hash.ts](src/eth/block/get-block-by-hash/get-block-by-hash.ts)
- [block/get-block-by-number/get-block-by-number.ts](src/eth/block/get-block-by-number/get-block-by-number.ts)
- [block/get-block-receipts/get-block-receipts.ts](src/eth/block/get-block-receipts/get-block-receipts.ts)
- [block/get-block-transaction-count-by-hash/get-block-transaction-count-by-hash.ts](src/eth/block/get-block-transaction-count-by-hash/get-block-transaction-count-by-hash.ts)
- [block/get-block-transaction-count-by-number/get-block-transaction-count-by-number.ts](src/eth/block/get-block-transaction-count-by-number/get-block-transaction-count-by-number.ts)
- [block/get-uncle-count-by-block-hash/get-uncle-count-by-block-hash.ts](src/eth/block/get-uncle-count-by-block-hash/get-uncle-count-by-block-hash.ts)
- [block/get-uncle-count-by-block-number/get-uncle-count-by-block-number.ts](src/eth/block/get-uncle-count-by-block-number/get-uncle-count-by-block-number.ts)
- [block/get-block-by-hash/get-block-by-hash.ts](src/eth/block/get-block-by-hash/get-block-by-hash.ts)
- [block/get-block-by-number/get-block-by-number.ts](src/eth/block/get-block-by-number/get-block-by-number.ts)

#### client

- [client/accounts/accounts.ts](src/eth/client/accounts/accounts.ts)
- [client/block-number/block-number.ts](src/eth/client/block-number/block-number.ts)
- [client/chain-id/chain-id.ts](src/eth/client/chain-id/chain-id.ts)
- [client/coinbase/coinbase.ts](src/eth/client/coinbase/coinbase.ts)
- [client/syncing/syncing.ts](src/eth/client/syncing/syncing.ts)

#### execute

- [execute/call/call.ts](src/eth/execute/call/call.ts)
- [execute/create-access-list/create-access-list.ts](src/eth/execute/create-access-list/create-access-list.ts)
- [execute/estimate-gas/estimate-gas.ts](src/eth/execute/estimate-gas/estimate-gas.ts)

#### fee-market

- [fee-market/fee-history/fee-history.ts](src/eth/fee-market/fee-history/fee-history.ts)
- [fee-market/gas-price/gas-price.ts](src/eth/fee-market/gas-price/gas-price.ts)
- [fee-market/max-priority-fee-per-gas/max-priority-fee-per-gas.ts](src/eth/fee-market/max-priority-fee-per-gas/max-priority-fee-per-gas.ts)

#### filter

- [filter/get-filter-changes/get-filter-changes.ts](src/eth/filter/get-filter-changes/get-filter-changes.ts)
- [filter/get-filter-logs/get-filter-logs.ts](src/eth/filter/get-filter-logs/get-filter-logs.ts)
- [filter/get-logs/get-logs.ts](src/eth/filter/get-logs/get-logs.ts)
- [filter/new-block-filter/new-block-filter.ts](src/eth/filter/new-block-filter/new-block-filter.ts)
- [filter/new-filter/new-filter.ts](src/eth/filter/new-filter/new-filter.ts)
- [filter/new-pending-transaction-filter/new-pending-transaction-filter.ts](src/eth/filter/new-pending-transaction-filter/new-pending-transaction-filter.ts)
- [filter/uninstall-filter/uninstall-filter.ts](src/eth/filter/uninstall-filter/uninstall-filter.ts)

#### sign

- [sign/sign/sign.ts](src/eth/sign/sign/sign.ts)
- [sign/sign-transaction/sign-transaction.ts](src/eth/sign/sign-transaction/sign-transaction.ts)

#### state

- [state/get-balance/get-balance.ts](src/eth/state/get-balance/get-balance.ts)
- [state/get-code/get-code.ts](src/eth/state/get-code/get-code.ts)
- [state/get-proof/get-proof.ts](src/eth/state/get-proof/get-proof.ts)
- [state/get-storage-at/get-storage-at.ts](src/eth/state/get-storage-at/get-storage-at.ts)
- [state/get-transaction-count/get-transaction-count.ts](src/eth/state/get-transaction-count/get-transaction-count.ts)

#### submit

- [submit/send-raw-transaction/send-raw-transaction.ts](src/eth/submit/send-raw-transaction/send-raw-transaction.ts)
- [submit/send-transaction/send-transaction.ts](src/eth/submit/send-transaction/send-transaction.ts)

#### transaction

- [transaction/get-transaction-by-block-hash-and-index/get-transaction-by-block-hash-and-index.ts](src/eth/transaction/get-transaction-by-block-hash-and-index/get-transaction-by-block-hash-and-index.ts)
- [transaction/get-transaction-by-block-number-and-index/get-transaction-by-block-number-and-index.ts](src/eth/transaction/get-transaction-by-block-number-and-index/get-transaction-by-block-number-and-index.ts)
- [transaction/get-transaction-by-hash/get-transaction-by-hash.ts](src/eth/transaction/get-transaction-by-hash/get-transaction-by-hash.ts)
- [transaction/get-transaction-receipt/get-transaction-receipt.ts](src/eth/transaction/get-transaction-receipt/get-transaction-receipt.ts)
