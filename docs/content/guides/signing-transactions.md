---
title: Signing transactions
section: Guides
section_order: 2
order: 2
---

# Signing transactions

There are **two first-class signing paths**, and the library does not force a choice between them — the dapp picks per call.

## Path 1 — wallet signs and broadcasts

The wallet implements `eth_sendTransaction`. One round trip, the wallet handles nonce/gas, the dapp gets back a transaction hash.

```ts
import { create_signer } from "@ethernauta/transport";
import { eth_send_transaction } from "@ethernauta/eth";

const signer = create_signer([mainnet]);

const hash = await eth_send_transaction({
  to: "0x...",
  value: "0x0",
  input: "0x",
})(signer({ chain_id: mainnet.chain_id }));
```

## Path 2 — wallet signs, dapp broadcasts

The wallet implements `eth_signTransaction` and returns the signed bytes; the dapp broadcasts them via a `Writable<T>` against any public RPC.

```ts
const signed = await eth_sign_transaction({ /* ... */ })(
  signer({ chain_id: mainnet.chain_id }),
);

const hash = await eth_send_raw_transaction(signed)(
  writer({ chain_id: mainnet.chain_id }),
);
```

Both paths stay available. The `transport` resolver split (`Readable`, `Writable`, `Signable`, `Callable`) is what makes that possible.
