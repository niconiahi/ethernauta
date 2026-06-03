[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/eth&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/eth&treeshake=[*])

## Philosophy

This module is an un-opinionated representation of the [Ethereum execution APIs](https://github.com/ethereum/execution-apis/tree/main/src/eth) — every JSON-RPC `eth_*` method as a tree-shakable primitive function. Methods come in three shapes:

- `Readable<T>` for state queries (`eth_getBalance`, `eth_getBlockByHash`, …) — consumed by a reader resolver.
- `Writable<T>` for state mutations (`eth_sendRawTransaction`) — consumed by a writer resolver.
- `Signable<T>` for wallet operations (`eth_signTransaction`, `eth_sign`, `eth_sendTransaction`) — consumed by a signer resolver.

This package is also the canonical home of the JSON-RPC Ethereum schemas — block / receipt / generic-transaction / variant-signed-transaction. Primitive schemas (`AddressSchema`, `BytesSchema`, `UintSchema`, …) live in `@ethernauta/core`; per-EIP transaction wire schemas (`Transaction1559SignedSchema`, `AccessListSchema`, `Transaction4844UnsignedSchema`, …) live in `@ethernauta/eip/<n>` and are imported from there.

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

Every method is curried — `method(args)(resolver({ chain_id, …ctx }))` — and is one of the four resolver shapes exported by `@ethernauta/transport`.

### Client methods — `Readable<T>`

```ts
import {
  eth_accounts,
  eth_blockNumber,
  eth_chainId,
  eth_coinbase,
  eth_syncing,
} from "@ethernauta/eth"

const chainId = await eth_chainId()(reader({ chain_id }))
const head = await eth_blockNumber()(reader({ chain_id }))
```

### Block methods — `Readable<T>`

```ts
import {
  eth_getBlockByHash,
  eth_getBlockByNumber,
  eth_getBlockReceipts,
  eth_getBlockTransactionCountByHash,
  eth_getBlockTransactionCountByNumber,
  eth_getUncleCountByBlockHash,
  eth_getUncleCountByBlockNumber,
} from "@ethernauta/eth"

const block = await eth_getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
])(reader({ chain_id }))
```

### Transaction methods — `Readable<T>`

```ts
import {
  eth_getTransactionByBlockHashAndIndex,
  eth_getTransactionByBlockNumberAndIndex,
  eth_getTransactionByHash,
  eth_getTransactionReceipt,
} from "@ethernauta/eth"

const receipt = await eth_getTransactionReceipt([hash])(reader({ chain_id }))
```

### State methods — `Readable<T>`

```ts
import {
  eth_getBalance,
  eth_getCode,
  eth_getProof,
  eth_getStorageAt,
  eth_getTransactionCount,
} from "@ethernauta/eth"

const balance = await eth_getBalance([address, "latest"])(reader({ chain_id }))
```

### Execute methods — `Readable<T>`

```ts
import {
  eth_call,
  eth_createAccessList,
  eth_estimateGas,
} from "@ethernauta/eth"
```

### Fee market — `Readable<T>`

```ts
import {
  eth_feeHistory,
  eth_gasPrice,
  eth_maxPriorityFeePerGas,
} from "@ethernauta/eth"
```

### Filters — `Readable<T>` + `Writable<T>`

```ts
import {
  eth_getContractEvents,
  eth_getFilterChanges,
  eth_getFilterLogs,
  eth_getLogs,
  eth_newBlockFilter,
  eth_newFilter,
  eth_newPendingTransactionFilter,
  eth_uninstallFilter,
} from "@ethernauta/eth"
```

### Subscriptions

```ts
import {
  eth_subscribeLogs,
  eth_subscribeNewHeads,
  eth_subscribeNewPendingTransactions,
} from "@ethernauta/eth"
```

Subscription methods consume a websocket transport (see `websocket()` in `@ethernauta/transport`) and resolve with an `Unsubscribe` function.

### Signing — `Signable<T>`

```ts
import { eth_sign, eth_signTransaction } from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/utils"
import { signer, writer, SEPOLIA_CHAIN_ID } from "./resolvers"

// `eth_signTransaction` returns the raw signed payload —
// path 2: dapp broadcasts via `eth_sendRawTransaction`.
const signed_transaction = await eth_signTransaction([
  {
    to: "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
    value: number_to_hex(1),
  },
])(signer({ chain_id: SEPOLIA_CHAIN_ID }))
```

### Submitting — `Writable<T>` + `Signable<T>`

```ts
import { eth_sendRawTransaction, eth_sendTransaction } from "@ethernauta/eth"

// Path 2 — dapp pre-signs and broadcasts
const hash = await eth_sendRawTransaction([signed_transaction])(
  writer({ chain_id: SEPOLIA_CHAIN_ID }),
)

// Path 1 — wallet signs and broadcasts in one step
const hash2 = await eth_sendTransaction([{
  to: "0x…",
  value: number_to_hex(1),
}])(signer({ chain_id: SEPOLIA_CHAIN_ID }))
```

### Reacting to transaction states

```ts
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import { hex_to_number } from "@ethernauta/utils"

// Single-hash UI tracking — inline ~10-line poll. The wallet
// owns batched-call tracking via EIP-5792 (wallet_getCallsStatus);
// for a typed multi-tx tracker (subscription + persistence) see
// `@ethernauta/transaction`.
const interval_id = setInterval(async () => {
  const receipt = await eth_getTransactionReceipt([hash])(reader({ chain_id }))
  if (!receipt || !receipt.status) return
  const status = hex_to_number(receipt.status) === 1 ? "mined" : "reverted"
  clearInterval(interval_id)
}, 2000)
```

### Schemas + RLP helpers

```ts
import {
  ReceiptInfoSchema,
  RECEIPT_STATUS,
  is_post_byzantium,
  EthSignTransactionParametersSchema,
  // block / transaction / withdrawal / filter schemas …
} from "@ethernauta/eth"

import { encode_rlp, type RLPInput } from "@ethernauta/eth"
```

The `lib` subtree exposes the post-Byzantium receipt helper (`is_post_byzantium`, `RECEIPT_STATUS`, `ReceiptStatusSchema`, `PostByzantiumReceiptSchema`) plus the typed RLP encoder used by transaction-builders. `EthSignTransactionParametersSchema` is the parameter shape consumed by both `eth_signTransaction` (path 2) and the wallet's `eth_sendTransaction` handler.

### Gas + 1559 fee math

The `gas` subtree concentrates the L1-mainnet fee primitives previously housed in a separate `@ethernauta/gas` package (now retired). Composing these helpers on top of `eth_feeHistory` / `eth_maxPriorityFeePerGas` / `eth_estimateGas` is path 2 territory — no wallet involved.

```ts
import {
  estimate_1559_fees,        // base-fee math + priority fee + buffer
  estimate_priority_fee,     // priority-fee suggestion from eth_feeHistory
  buffer_gas_limit,          // multiply estimateGas result by a safety factor
  type Fees1559,
} from "@ethernauta/eth"
```

L2-specific fee math lives in the matching rollup package:

- OP-Stack — `estimate_op_fees` in [`@ethernauta/op`](https://github.com/niconiahi/ethernauta/tree/main/packages/op).
- Arbitrum — `estimate_arbitrum_fees` in [`@ethernauta/arbitrum`](https://github.com/niconiahi/ethernauta/tree/main/packages/arbitrum).
- zkSync Era — gas surface in [`@ethernauta/zksync`](https://github.com/niconiahi/ethernauta/tree/main/packages/zksync).
