---
title: The four resolver shapes
section: Concepts
section_order: 2
order: 2
---

# The four resolver shapes

Every method in Ethernauta is a curried function:

```ts
// shape only — see the blocks below for runnable examples.
declare function method(args: unknown): (resolved_transport: unknown) => Promise<unknown>;
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
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eth_blockNumber } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const block = await eth_blockNumber()(
  reader({ chain_id: CHAIN_ID }),
);
```

Backed by an HTTP transport that picks an RPC URL from the chain definition. Read-only methods (`eth_blockNumber`, `eth_getBalance`, `eth_getCode`, `eth_getBlockByNumber`, `eth_call`, `eth_getLogs`, …) return `Readable<T>`. No wallet involved at any layer.

## Writable\<T\>

```ts
import { create_writer, encode_chain_id, http } from "@ethernauta/transport";
import { eth_sendRawTransaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { BytesSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const writer = create_writer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const signed_bytes = parse(BytesSchema, "0x");

const hash = await eth_sendRawTransaction([signed_bytes])(
  writer({ chain_id: CHAIN_ID }),
);
```

Same HTTP transport, but reserved for methods that broadcast. Only `eth_sendRawTransaction` returns `Writable<Hash32>` today. Splitting `Readable` from `Writable` is a type-level guard against accidentally calling broadcast methods on a reader (and vice versa).

## Signable\<T\>

```ts
import type { Provider } from "@ethernauta/eip/1193";
import { create_provider, encode_chain_id } from "@ethernauta/transport";
import { eth_sendTransaction } from "@ethernauta/eth";
import { personal_sign } from "@ethernauta/eip/191";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
declare const provider: Provider; // see /eips/6963 for discovery
const { signer } = create_provider(provider);
const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(UintSchema, "0x0");
const input = parse(BytesSchema, "0x");
const account = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

const hash = await eth_sendTransaction([{ to, value, input }])(
  signer({ chain_id: CHAIN_ID }),
);

const signature = await personal_sign(["hello", account])(
  signer({ chain_id: CHAIN_ID }),
);
```

The **only** shape that requires a wallet. The signer wraps a 1193 provider (the wallet extension, `window.ethereum`, or any EIP-6963 announcement). Methods that need user confirmation or wallet-held secrets — `eth_sendTransaction`, `eth_signTransaction`, `personal_sign`, `eth_signTypedData_v4`, `eth_requestAccounts`, `wallet_switchEthereumChain`, `wallet_sendCalls`, `wallet_signAuthorization` — return `Signable<T>`.

## Callable\<T\>

```ts
import { contract, create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { balanceOf } from "@ethernauta/erc/20";
import { eth_call } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const token_address = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const holder = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

const callable = balanceOf([holder])(
  contract({ chain_id: CHAIN_ID, to: token_address }),
);
const result_bytes = await eth_call([
  { to: callable.to, input: callable.data },
])(reader({ chain_id: CHAIN_ID }));
const balance = callable.decode(result_bytes);
```

A specialization of `Readable` for ABI-decoded contract reads. The `Callable<T>` returned by an ERC binding carries the calldata + a `decode` function; you pass it through `eth_call` and then decode the bytes. ERC method bindings (`@ethernauta/erc/20/methods/balance-of`, etc.) all return `Callable<T>`.

## Trackable\<T\>

```ts
import { create_tracker, wait_for_receipt, watch_transaction, window_store } from "@ethernauta/transaction";
import { encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { Hash32Schema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const tracker = create_tracker(
  [{ chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] }],
  { store: window_store },
);
const hash = parse(Hash32Schema, "0x" + "0".repeat(64));

const receipt = await wait_for_receipt([hash])(
  tracker({ chain_id: CHAIN_ID }),
);

const unsubscribe = watch_transaction(hash, (_transaction) => {
  // react to mined transaction
})(tracker({ chain_id: CHAIN_ID }));
```

The tracker carries a `Store` (typically `localStorage`-backed) so pending transactions survive page reloads. Layered on top of `Readable<T>`.

## Why split

Three reasons.

**Type-safety.** Calling `eth_sendTransaction` against a `Reader` is a compile error, not a runtime one. The shape is the type-system enforcement of "this method needs a wallet."

**Path-2 viability.** If signing and broadcasting were one shape, dapps wanting to broadcast through a different RPC than the wallet would have to forge ahead anyway. The split makes path 2 ergonomic — see [Two paths](/concepts/two-paths).

**Transport flexibility.** A `Reader` over an HTTP RPC and a `Reader` over an EIP-1193 provider's `eth_call` are the same shape. The call site doesn't change when you swap them. `create_provider(provider).reader` and `create_reader(CHAINS)` both produce a `Reader`.

## The shape is the contract

When you write a new method (an EIP binding, an ERC binding, a wallet RPC handler), the very first decision is the shape. That decision is the public contract: it tells consumers whether the method needs a wallet, whether it can run in tests against a mock, whether it can be batched into a multicall. Picking the wrong shape is the bug; the implementation usually follows.
