---
title: Reading from the chain
section: Guides
section_order: 2
order: 1
---

# Reading from the chain

Chain reads do not require a wallet. They go through a `Readable<T>` resolver built from a list of chain definitions.

```ts
import { create_reader } from "@ethernauta/transport";
import { eth_block_number } from "@ethernauta/eth";
import { mainnet, sepolia } from "@ethernauta/chain";

const reader = create_reader([mainnet, sepolia]);

const block_number = await eth_block_number()(
  reader({ chain_id: mainnet.chain_id }),
);
```

The two-call shape — `method(args)(resolver(...))` — is **never collapsed**. The first call binds parameters; the second binds the transport. That separation is what lets the same method run against a public RPC reader, an EIP-1193 provider, or a test mock without changing the call site.
