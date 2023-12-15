## Philosophy
This module aims to be an un-opinionated representation of the defined [Ethereum base methods](https://github.com/ethereum/execution-apis/tree/main/src/eth) in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## API

```tsx
import { createReader, httpTransport } from "@ethernauta/transport"
import { getBlockByHash } from "@ethernauta/method"

const reader = createReader([
  httpTransport("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba8177"),
])
const readable = getBlockByHash(["0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26", false])
const block = await readable(reader)
```

### Files to pay attention
#### eip-1102
1. [eip/1102/request-accounts/request-accounts.ts](src/eip/1102/request-accounts/request-accounts.ts)

#### block
2. [block/get-block-by-hash/get-block-by-hash.ts](src/eth/block/get-block-by-hash/get-block-by-hash.ts)
3. [block/get-block-by-number/get-block-by-number.ts](src/eth/block/get-block-by-number/get-block-by-number.ts)
4. [block/get-block-receipts/get-block-receipts.ts](src/eth/block/get-block-receipts/get-block-receipts.ts)
5. [block/get-block-transaction-count-by-hash/get-block-transaction-count-by-hash.ts](src/eth/block/get-block-transaction-count-by-hash/get-block-transaction-count-by-hash.ts)
5. [block/get-block-transaction-count-by-number/get-block-transaction-count-by-number.ts](src/eth/block/get-block-transaction-count-by-number/get-block-transaction-count-by-number.ts)
6. [block/get-uncle-count-by-block-hash/get-uncle-count-by-block-hash.ts](src/eth/block/get-uncle-count-by-block-hash/get-uncle-count-by-block-hash.ts)
7. [block/get-uncle-count-by-block-number/get-uncle-count-by-block-number.ts](src/eth/block/get-uncle-count-by-block-number/get-uncle-count-by-block-number.ts)
8. [block/get-block-by-hash/get-block-by-hash.ts](src/eth/block/get-block-by-hash/get-block-by-hash.ts)
9. [block/get-block-by-number/get-block-by-number.ts](src/eth/block/get-block-by-number/get-block-by-number.ts)

#### client
10. [client/accounts/accounts.ts](src/eth/client/accounts/accounts.ts)
11. [client/block-number/block-number.ts](src/eth/client/block-number/block-number.ts)
12. [client/chain-id/chain-id.ts](src/eth/client/chain-id/chain-id.ts)
13. [client/coinbase/coinbase.ts](src/eth/client/coinbase/coinbase.ts)
14. [client/syncing/syncing.ts](src/eth/client/syncing/syncing.ts)

#### execute
15. [execute/call/call.ts](src/eth/execute/call/call.ts)
16. [execute/create-access-list/create-access-list.ts](src/eth/execute/create-access-list/create-access-list.ts)
17. [execute/estimate-gas/estimate-gas.ts](src/eth/execute/estimate-gas/estimate-gas.ts)

#### fee-market
18. [fee-market/fee-history/fee-history.ts](src/eth/fee-market/fee-history/fee-history.ts)
19. [fee-market/gas-price/gas-price.ts](src/eth/fee-market/gas-price/gas-price.ts)
20. [fee-market/max-priority-fee-per-gas/max-priority-fee-per-gas.ts](src/eth/fee-market/max-priority-fee-per-gas/max-priority-fee-per-gas.ts)

#### filter
21. [filter/get-filter-changes/get-filter-changes.ts](src/eth/filter/get-filter-changes/get-filter-changes.ts)
22. [filter/get-filter-logs/get-filter-logs.ts](src/eth/filter/get-filter-logs/get-filter-logs.ts)
23. [filter/get-logs/get-logs.ts](src/eth/filter/get-logs/get-logs.ts)
24. [filter/new-block-filter/new-block-filter.ts](src/eth/filter/new-block-filter/new-block-filter.ts)
25. [filter/new-filter/new-filter.ts](src/eth/filter/new-filter/new-filter.ts)
26. [filter/new-pending-transaction-filter/new-pending-transaction-filter.ts](src/eth/filter/new-pending-transaction-filter/new-pending-transaction-filter.ts)
27. [filter/uninstall-filter/uninstall-filter.ts](src/eth/filter/uninstall-filter/uninstall-filter.ts)

#### sign
28. [sign/sign/sign.ts](src/eth/sign/sign/sign.ts)
29. [sign/sign-transaction/sign-transaction.ts](src/eth/sign/sign-transaction/sign-transaction.ts)

#### state
30. [state/get-balance/get-balance.ts](src/eth/state/get-balance/get-balance.ts)
31. [state/get-code/get-code.ts](src/eth/state/get-code/get-code.ts)
32. [state/get-proof/get-proof.ts](src/eth/state/get-proof/get-proof.ts)
33. [state/get-storage-at/get-storage-at.ts](src/eth/state/get-storage-at/get-storage-at.ts)
34. [state/get-transaction-count/get-transaction-count.ts](src/eth/state/get-transaction-count/get-transaction-count.ts)

#### submit
35. [submit/send-raw-transaction/send-raw-transaction.ts](src/eth/submit/send-raw-transaction/send-raw-transaction.ts)
36. [submit/send-transaction/send-transaction.ts](src/eth/submit/send-transaction/send-transaction.ts)

#### transaction
37. [transaction/get-transaction-by-block-hash-and-index/get-transaction-by-block-hash-and-index.ts](src/eth/transaction/get-transaction-by-block-hash-and-index/get-transaction-by-block-hash-and-index.ts)
38. [transaction/get-transaction-by-block-number-and-index/get-transaction-by-block-number-and-index.ts](src/eth/transaction/get-transaction-by-block-number-and-index/get-transaction-by-block-number-and-index.ts)
39. [transaction/get-transaction-by-hash/get-transaction-by-hash.ts](src/eth/transaction/get-transaction-by-hash/get-transaction-by-hash.ts)
40. [transaction/get-transaction-receipt/get-transaction-receipt.ts](src/eth/transaction/get-transaction-receipt/get-transaction-receipt.ts)
