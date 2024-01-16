## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [Ethereum schemas](https://github.com/ethereum/execution-apis/tree/main/src/schemas)
- [Ethereum base methods](https://github.com/ethereum/execution-apis/tree/main/src/eth)
- [Ethereum chains](https://github.com/ethereum-lists/chains/tree/master/_data/chains)
- [abi-spec](https://docs.soliditylang.org/en/latest/abi-spec.html)
- [chain schema](https://github.com/ethereum-lists/chains/blob/master/tools/schema/chainSchema.json)

## Table of contents

1. [API](#api)
2. [core](#core)
3. [chain](#chain)
4. [abi](#abi)
5. [method](#method)

## API

```tsx
import { eip155_1, eth_getBlockByHash } from "@ethernauta/eth";
import { createReader, encodeChainId, http } from "@ethernauta/transport";

const reader = createReader([
  {
    chainId: "eip155:1",
    transports: [
      http(
        "https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"
      ),
    ],
  },
  {
    chainId: "eip155:1",
    transports: [
      http(
        "https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/x3bdg0c56ebg5b1c70957bfaa17483faxaba81z1/"
      ),
    ],
  },
]);
const readable = eth_getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
]);
const chainId = encodeChainId({
  namespace: "eip155",
  reference: eip155_1.chainId,
});
const block = await readable(reader(chainId));
```

## Files to pay attention

### core

#### block

- [block/block.ts](src/core/block/block.ts)

#### client

- [client/client.ts](src/core/client/client.ts)

#### filter

- [filter/filter.ts](src/core/filter/filter.ts)

#### receipt

- [receipt/receipt.ts](src/core/receipt/receipt.ts)

#### state

- [state/state.ts](src/core/state/state.ts)

#### withdrawal

- [withdrawal/withdrawal.ts](src/core/withdrawal/withdrawal.ts)

#### address

- [address/address.ts](src/core/base/address/address.ts)

#### addresses

- [addresses/addressses.ts](src/core/base/addresses/addresses.ts)

#### base

- [base/byte/byte.ts](src/core/base/byte/byte.ts)
- [base/bytes/bytes/ts](src/core/base/bytes/bytes.ts)
- [base/bytes-8/bytes-8.ts](src/core/base/bytes-8/bytes-8.ts)
- [base/bytes-32/bytes-32.ts](src/core/base/bytes-32/bytes-32.ts)
- [base/bytes-48/bytes-48.ts](src/core/base/bytes-48/bytes-48.ts)
- [base/bytes-65/bytes-65.ts](src/core/base/bytes-65/bytes-65.ts)
- [base/bytes-256/bytes-256.ts](src/core/base/bytes-256/bytes-256.ts)
- [base/bytes-max-32/bytes-max-32.ts](src/core/base/bytes-max-32/bytes-max-32.ts)
- [base/hash-32/hash-32.ts](src/core/base/hash-32/hash-32.ts)
- [base/not-found/not-found.ts](src/core/base/not-found/not-found.ts)
- [base/ratio/ratio.ts](src/core/base/ratio/ratio.ts)
- [base/uint/uint.ts](src/core/base/uint/uint.ts)
- [base/uint-64/uint-64.ts](src/core/base/uint-64/uint-64.ts)
- [base/uint-256/uint-256.ts](src/core/base/uint-256/uint-256.ts)

#### transaction

- [transaction/1559/1559.ts](src/core/transaction/1559/1559.ts)
- [transaction/2930/2930.ts](src/core/transaction/2930/2930.ts)
- [transaction/4844/4844.ts](src/core/transaction/4844/4844.ts)
- [transaction/access-list/access-list.ts](src/core/transaction/access-list/access-list.ts)
- [transaction/generic/generic.ts](src/core/transaction/generic/generic.ts)
- [transaction/info/info.ts](src/core/transaction/info/info.ts)
- [transaction/legacy/legacy.ts](src/core/transaction/legacy/legacy.ts)
- [transaction/signed/signed.ts](src/core/transaction/signed/signed.ts)
- [transaction/unsigned/unsigned.ts](src/core/transaction/unsigned/unsigned.ts)

### chain

- [indexer.tsx](src/chain/indexer/indexer.ts)
- [shared.tsx](src/chain/shared/shared.ts)
- [eip155-1](src/chain/eip155/eip155-1/eip155-1.ts)

### abi

#### error

- [error/error.ts](src/abi/error/error.ts)

#### client

- [client/client.ts](src/abi/event/event.ts)

#### shared

- [shared/shared.ts](src/abi/shared/shared.ts)

#### function

- [function/shared/shared.ts](src/abi/function/shared/shared.ts)
- [function/function/function.ts](src/abi/function/function/function.ts)
- [function/constructor/constructor.ts](src/abi/function/constructor/constructor.ts)
- [function/fallback/fallback.ts](src/abi/function/fallback/fallback.ts)
- [function/receive/receive.ts](src/abi/function/receive/receive.ts)
- [error/error.ts](src/abi/error/error.ts)

#### client

- [client/client.ts](src/abi/event/event.ts)

#### shared

- [shared/shared.ts](src/abi/shared/shared.ts)

#### function

- [function/shared/shared.ts](src/abi/function/shared/shared.ts)
- [function/function/function.ts](src/abi/function/function/function.ts)
- [function/constructor/constructor.ts](src/abi/function/constructor/constructor.ts)
- [function/fallback/fallback.ts](src/abi/function/fallback/fallback.ts)
- [function/receive/receive.ts](src/abi/function/receive/receive.ts)

### method

#### eip-1102

- [eip/1102/request-accounts/request-accounts.ts](src/method/eip/1102/request-accounts/request-accounts.ts)

#### block

- [block/get-block-by-hash/get-block-by-hash.ts](src/method/block/get-block-by-hash/get-block-by-hash.ts)
- [block/get-block-by-number/get-block-by-number.ts](src/method/block/get-block-by-number/get-block-by-number.ts)
- [block/get-block-receipts/get-block-receipts.ts](src/method/block/get-block-receipts/get-block-receipts.ts)
- [block/get-block-transaction-count-by-hash/get-block-transaction-count-by-hash.ts](src/method/block/get-block-transaction-count-by-hash/get-block-transaction-count-by-hash.ts)
- [block/get-block-transaction-count-by-number/get-block-transaction-count-by-number.ts](src/method/block/get-block-transaction-count-by-number/get-block-transaction-count-by-number.ts)
- [block/get-uncle-count-by-block-hash/get-uncle-count-by-block-hash.ts](src/method/block/get-uncle-count-by-block-hash/get-uncle-count-by-block-hash.ts)
- [block/get-uncle-count-by-block-number/get-uncle-count-by-block-number.ts](src/method/block/get-uncle-count-by-block-number/get-uncle-count-by-block-number.ts)
- [block/get-block-by-hash/get-block-by-hash.ts](src/method/block/get-block-by-hash/get-block-by-hash.ts)
- [block/get-block-by-number/get-block-by-number.ts](src/method/block/get-block-by-number/get-block-by-number.ts)

#### client

- [client/accounts/accounts.ts](src/method/client/accounts/accounts.ts)
- [client/block-number/block-number.ts](src/method/client/block-number/block-number.ts)
- [client/chain-id/chain-id.ts](src/method/client/chain-id/chain-id.ts)
- [client/coinbase/coinbase.ts](src/method/client/coinbase/coinbase.ts)
- [client/syncing/syncing.ts](src/method/client/syncing/syncing.ts)

#### execute

- [execute/call/call.ts](src/method/execute/call/call.ts)
- [execute/create-access-list/create-access-list.ts](src/method/execute/create-access-list/create-access-list.ts)
- [execute/estimate-gas/estimate-gas.ts](src/method/execute/estimate-gas/estimate-gas.ts)

#### fee-market

- [fee-market/fee-history/fee-history.ts](src/method/fee-market/fee-history/fee-history.ts)
- [fee-market/gas-price/gas-price.ts](src/method/fee-market/gas-price/gas-price.ts)
- [fee-market/max-priority-fee-per-gas/max-priority-fee-per-gas.ts](src/method/fee-market/max-priority-fee-per-gas/max-priority-fee-per-gas.ts)

#### filter

- [filter/get-filter-changes/get-filter-changes.ts](src/method/filter/get-filter-changes/get-filter-changes.ts)
- [filter/get-filter-logs/get-filter-logs.ts](src/method/filter/get-filter-logs/get-filter-logs.ts)
- [filter/get-logs/get-logs.ts](src/method/filter/get-logs/get-logs.ts)
- [filter/new-block-filter/new-block-filter.ts](src/method/filter/new-block-filter/new-block-filter.ts)
- [filter/new-filter/new-filter.ts](src/method/filter/new-filter/new-filter.ts)
- [filter/new-pending-transaction-filter/new-pending-transaction-filter.ts](src/method/filter/new-pending-transaction-filter/new-pending-transaction-filter.ts)
- [filter/uninstall-filter/uninstall-filter.ts](src/method/filter/uninstall-filter/uninstall-filter.ts)

#### sign

- [sign/sign/sign.ts](src/method/sign/sign/sign.ts)
- [sign/sign-transaction/sign-transaction.ts](src/method/sign/sign-transaction/sign-transaction.ts)

#### state

- [state/get-balance/get-balance.ts](src/method/state/get-balance/get-balance.ts)
- [state/get-code/get-code.ts](src/method/state/get-code/get-code.ts)
- [state/get-proof/get-proof.ts](src/method/state/get-proof/get-proof.ts)
- [state/get-storage-at/get-storage-at.ts](src/method/state/get-storage-at/get-storage-at.ts)
- [state/get-transaction-count/get-transaction-count.ts](src/method/state/get-transaction-count/get-transaction-count.ts)

#### submit

- [submit/send-raw-transaction/send-raw-transaction.ts](src/method/submit/send-raw-transaction/send-raw-transaction.ts)
- [submit/send-transaction/send-transaction.ts](src/method/submit/send-transaction/send-transaction.ts)

#### transaction

- [transaction/get-transaction-by-block-hash-and-index/get-transaction-by-block-hash-and-index.ts](src/method/transaction/get-transaction-by-block-hash-and-index/get-transaction-by-block-hash-and-index.ts)
- [transaction/get-transaction-by-block-number-and-index/get-transaction-by-block-number-and-index.ts](src/method/transaction/get-transaction-by-block-number-and-index/get-transaction-by-block-number-and-index.ts)
- [transaction/get-transaction-by-hash/get-transaction-by-hash.ts](src/method/transaction/get-transaction-by-hash/get-transaction-by-hash.ts)
- [transaction/get-transaction-receipt/get-transaction-receipt.ts](src/method/transaction/get-transaction-receipt/get-transaction-receipt.ts)
