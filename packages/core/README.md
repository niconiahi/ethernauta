## Philosophy

This module aims to be an un-opinionated representation of the defined [Ethereum schemas](https://github.com/ethereum/execution-apis/tree/main/src/schemas) in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## API

```tsx
import { addressSchema } from "@ethernauta/core"
import { safeParse } from "valibot"

const someAddress = "0x0002340gsdf8"
const { success: isAddress } = safeParse(addressSchema, someAddress)
```

### Files to pay attention

#### block

1. [block/block.ts](src/block/block.ts)

#### client

2. [client/client.ts](src/client/client.ts)

#### filter

3. [filter/filter.ts](src/filter/filter.ts)

#### receipt

4. [receipt/receipt.ts](src/receipt/receipt.ts)

#### state

5. [state/state.ts](src/state/state.ts)

#### withdrawal

6. [withdrawal/withdrawal.ts](src/withdrawal/withdrawal.ts)

#### address

7. [address/address.ts](src/base/address/address.ts)

#### addresses

8. [addresses/addressses.ts](src/base/addresses/addresses.ts)

#### base

9. [base/byte/byte.ts](src/base/byte/byte.ts)
10. [base/bytes/bytes/ts](src/base/bytes/bytes.ts)
11. [base/bytes-8/bytes-8.ts](src/base/bytes-8/bytes-8.ts)
12. [base/bytes-32/bytes-32.ts](src/base/bytes-32/bytes-32.ts)
13. [base/bytes-48/bytes-48.ts](src/base/bytes-48/bytes-48.ts)
14. [base/bytes-65/bytes-65.ts](src/base/bytes-65/bytes-65.ts)
15. [base/bytes-256/bytes-256.ts](src/base/bytes-256/bytes-256.ts)
16. [base/bytes-max-32/bytes-max-32.ts](src/base/bytes-max-32/bytes-max-32.ts)
17. [base/hash-32/hash-32.ts](src/base/hash-32/hash-32.ts)
18. [base/not-found/not-found.ts](src/base/not-found/not-found.ts)
19. [base/ratio/ratio.ts](src/base/ratio/ratio.ts)
20. [base/uint/uint.ts](src/base/uint/uint.ts)
21. [base/uint-64/uint-64.ts](src/base/uint-64/uint-64.ts)
22. [base/uint-256/uint-256.ts](src/base/uint-256/uint-256.ts)

#### transaction

23. [transaction/1559/1559.ts](src/transaction/1559/1559.ts)
24. [transaction/2930/2930.ts](src/transaction/2930/2930.ts)
25. [transaction/4844/4844.ts](src/transaction/4844/4844.ts)
26. [transaction/access-list/access-list.ts](src/transaction/access-list/access-list.ts)
27. [transaction/generic/generic.ts](src/transaction/generic/generic.ts)
28. [transaction/info/info.ts](src/transaction/info/info.ts)
29. [transaction/legacy/legacy.ts](src/transaction/legacy/legacy.ts)
30. [transaction/signed/signed.ts](src/transaction/signed/signed.ts)
31. [transaction/unsigned/unsigned.ts](src/transaction/unsigned/unsigned.ts)
