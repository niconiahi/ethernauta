---
title: The four resolver shapes
section: Concepts
section_order: 2
order: 2
---

# The four resolver shapes

Every method in Ethernauta is a curried function:

```ts
method(args)(resolved_transport) // → Promise<T>
```

The **first call** binds the method's parameters. The **second call** binds the transport. The two are never collapsed — that's a hard rule (M3 in the project maxims).

The four shapes of "resolved transport" are:

- `Readable<T>` — chain reads. No wallet.
- `Writable<T>` — broadcast pre-signed bytes. No wallet.
- `Signable<T>` — anything that needs a wallet to sign or expose state.
- `Callable<T>` — `eth_call`-shaped contract reads. No wallet.

Plus a fifth that the `@ethernauta/transaction` package layers on top:

- `Trackable<T>` — receipt polling / lifecycle tracking. No wallet.

## Readable\<T\>

```ts
import { create_reader } from "@ethernauta/transport";
import { eth_block_number } from "@ethernauta/eth";

const reader = create_reader([chain1, chain2]);

const block = await eth_block_number()(
  reader({ chain_id: chain1.chain_id }),
);
```

Backed by an HTTP transport that picks an RPC URL from the chain definition. Read-only methods (`eth_blockNumber`, `eth_getBalance`, `eth_getCode`, `eth_getBlockByNumber`, `eth_call`, `eth_getLogs`, …) return `Readable<T>`. No wallet involved at any layer.

## Writable\<T\>

```ts
import { create_writer } from "@ethernauta/transport";
import { eth_send_raw_transaction } from "@ethernauta/eth";

const writer = create_writer([chain1]);

const hash = await eth_send_raw_transaction(signed_bytes)(
  writer({ chain_id: chain1.chain_id }),
);
```

Same HTTP transport, but reserved for methods that broadcast. Only `eth_sendRawTransaction` returns `Writable<Hash32>` today. Splitting `Readable` from `Writable` is a type-level guard against accidentally calling broadcast methods on a reader (and vice versa).

## Signable\<T\>

```ts
import { create_signer } from "@ethernauta/transport";
import { eth_send_transaction, personal_sign } from "@ethernauta/eth";

const signer = create_signer([chain1]);

const hash = await eth_send_transaction({ to, value, input })(
  signer({ chain_id: chain1.chain_id }),
);

const signature = await personal_sign({ message, account })(
  signer({ chain_id: chain1.chain_id }),
);
```

The **only** shape that requires a wallet. The signer wraps a 1193 provider (the wallet extension, `window.ethereum`, or any EIP-6963 announcement). Methods that need user confirmation or wallet-held secrets — `eth_sendTransaction`, `eth_signTransaction`, `personal_sign`, `eth_signTypedData_v4`, `eth_requestAccounts`, `wallet_switchEthereumChain`, `wallet_sendCalls`, `wallet_signAuthorization` — return `Signable<T>`.

## Callable\<T\>

```ts
import { create_contract } from "@ethernauta/transport";
import { balance_of } from "@ethernauta/erc/20";

const contract = create_contract([chain1]);

const balance = await balance_of({ address: holder })(
  contract({ chain_id: chain1.chain_id, contract: token_address }),
);
```

A specialization of `Readable` for ABI-decoded contract reads. The resolver carries a `contract` address; the method binds `function selector + args + return decoder` automatically. ERC method bindings (`@ethernauta/erc/20/methods/balance-of`, etc.) all return `Callable<T>`.

## Trackable\<T\>

```ts
import { create_tracker, wait_for_receipt, watch_transaction } from "@ethernauta/transaction";

const tracker = create_tracker([chain1], { store });

const receipt = await wait_for_receipt({ hash })(
  tracker({ chain_id: chain1.chain_id }),
);

const unsubscribe = watch_transaction({ hash, on_receipt })(
  tracker({ chain_id: chain1.chain_id }),
);
```

The tracker carries a `Store` (typically `localStorage`-backed) so pending transactions survive page reloads. Layered on top of `Readable<T>`.

## Why split

Three reasons.

**Type-safety.** Calling `eth_sendTransaction` against a `Reader` is a compile error, not a runtime one. The shape is the type-system enforcement of "this method needs a wallet."

**Path-2 viability.** If signing and broadcasting were one shape, dapps wanting to broadcast through a different RPC than the wallet would have to forge ahead anyway. The split makes path 2 ergonomic — see [Two paths](/concepts/two-paths).

**Transport flexibility.** A `Reader` over an HTTP RPC and a `Reader` over an EIP-1193 provider's `eth_call` are the same shape. The call site doesn't change when you swap them. `create_provider(provider).reader` and `create_reader(CHAINS)` both produce a `Reader`.

## The shape is the contract

When you write a new method (an EIP binding, an ERC binding, a wallet RPC handler), the very first decision is the shape. That decision is the public contract: it tells consumers whether the method needs a wallet, whether it can run in tests against a mock, whether it can be batched into a multicall. Picking the wrong shape is the bug; the implementation usually follows.
