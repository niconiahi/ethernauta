---
title: Calling contracts
section: Guides
section_order: 3
order: 4
---

# Calling contracts

Two kinds of contract calls: **reads** (no wallet, no gas, no on-chain change) and **writes** (wallet signature, gas, state change).

## Reads — `Callable<T>`

The ERC bindings in `@ethernauta/erc/*` already wrap the read methods. Use them directly:

```ts
import { contract, create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { balanceOf } from "@ethernauta/erc/20";
import { decimals, symbol } from "@ethernauta/erc/20/extensions/metadata";
import { eth_call } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const usdc = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const holder = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

const ctx = contract({ chain_id: CHAIN_ID, to: usdc });

const balance_callable = balanceOf([holder])(ctx);
const decimals_callable = decimals()(ctx);
const symbol_callable = symbol()(ctx);

const [balance_bytes, decimals_bytes, symbol_bytes] = await Promise.all([
  eth_call([{ to: balance_callable.to, input: balance_callable.data }])(reader({ chain_id: CHAIN_ID })),
  eth_call([{ to: decimals_callable.to, input: decimals_callable.data }])(reader({ chain_id: CHAIN_ID })),
  eth_call([{ to: symbol_callable.to, input: symbol_callable.data }])(reader({ chain_id: CHAIN_ID })),
]);

const balance = balance_callable.decode(balance_bytes);
const decimals_value = decimals_callable.decode(decimals_bytes);
const symbol_value = symbol_callable.decode(symbol_bytes);
```

The contract address is bound at `contract({ chain_id, to })` time; the method is bound at `balanceOf(...)`. Each binding returns a `Callable<T>` — `{ chain_id, to, data, decode }` — that you pass through `eth_call` to get raw bytes, then `decode` to recover the typed value.

## Reads — raw `eth_call`

When you don't have a binding (e.g. a project-specific contract), build calldata with the codec primitives and call directly:

```ts
import { address, encode_function_call, uint256 } from "@ethernauta/abi";
import { eth_call } from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { AddressSchema, BytesSchema, Uint256Schema } from "@ethernauta/core";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { bytes_to_hex } from "@ethernauta/utils";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const router = parse(AddressSchema, "0xE592427A0AEce92De3Edee1F18E0157C05861564");
const token_in = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");

const PARAMS = [address(), uint256()] as const;
const calldata = encode_function_call({
  name: "exampleRead",
  args: PARAMS,
  values: [token_in, parse(Uint256Schema, "0x64")],
});

const result_bytes = await eth_call([
  { to: router, input: parse(BytesSchema, bytes_to_hex(calldata)) },
])(reader({ chain_id: CHAIN_ID }));
```

This is what the generated ERC bindings do under the hood.

## Writes — `Signable<Hash32>` via an ERC binding

```ts
import { create_signer, encode_chain_id, http } from "@ethernauta/transport";
import { approve } from "@ethernauta/erc/20";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, Uint256Schema } from "@ethernauta/core";
import { bigint_to_hex, parse_unit } from "@ethernauta/utils";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const usdc = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const router = parse(AddressSchema, "0xE592427A0AEce92De3Edee1F18E0157C05861564");

const signed_bytes = await approve({
  spender: router,
  value: parse(Uint256Schema, bigint_to_hex(parse_unit("100", 6))),
})(signer({ chain_id: CHAIN_ID, to: usdc }));
```

The signer fills in nonce / gas / fees. The dapp only specifies the call.

## Writes — path 2

To inspect or persist the signed bytes before broadcast (see [signing transactions](/guides/signing-transactions)):

```ts
import { create_signer, create_writer, encode_chain_id, http } from "@ethernauta/transport";
import { eth_sendRawTransaction, eth_signTransaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const writer = create_writer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const usdc = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const approve_calldata = parse(BytesSchema, "0x");

const signed = await eth_signTransaction([
  { to: usdc, input: approve_calldata, value: parse(UintSchema, "0x0") },
])(signer({ chain_id: CHAIN_ID }));

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: CHAIN_ID }),
);
```

## Batched calls

For "approve + swap" or any multi-step interaction, use EIP-5792:

```ts
import { wallet_sendCalls } from "@ethernauta/eip/5792";
import { create_signer, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const account = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const usdc = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const router = parse(AddressSchema, "0xE592427A0AEce92De3Edee1F18E0157C05861564");
const encoded_approve = parse(BytesSchema, "0x");
const encoded_swap = parse(BytesSchema, "0x");

const result = await wallet_sendCalls([
  {
    version: "1.0",
    chainId: parse(UintSchema, "0x1"),
    from: account,
    calls: [
      { to: usdc, data: encoded_approve },
      { to: router, data: encoded_swap },
    ],
  },
])(signer({ chain_id: CHAIN_ID }));
```

The wallet picks the best execution strategy (multicall, EIP-7702 set-code, smart-account UserOp) for the active chain. The dapp doesn't choose.

## See also

- [@ethernauta/abi](/abi/overview) — the codec primitives.
- [@ethernauta/erc](/ercs/overview) — generated bindings for the standards.
- [EIP-5792](/eips/5792) — batched calls.
- [@ethernauta/transport → contract](/transport/overview).
