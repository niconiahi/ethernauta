## Philosophy

This module aims to be an un-opinionated representation of the defined [Solana base methods](https://solana.com/docs/rpc/http) in a completely modular fashion. It it's _absolutely_ typed-safe because it uses validation schemas to validate every piece of information. If any information that do not completely comply with the validation schema, it will throw an error, effectively stopping execution. Perfect for the safe enviroment we need to run while using Ethereum

## API

```tsx
import { addressSchema } from "@ethernauta/eth"
import { safeParse } from "valibot"

const someAddress = "0x0002340gsdf8"
const { success: isAddress } = safeParse(addressSchema, someAddress)
```

### Files to pay attention

1. [method/get-balance.ts](src/method/get-balance/get-balance.ts)
