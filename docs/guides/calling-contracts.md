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
import { create_contract } from "@ethernauta/transport";
import { balance_of, decimals, symbol } from "@ethernauta/erc/20";
import { eip155_1 } from "@ethernauta/chain";

const contract = create_contract([eip155_1]);
const ctx = contract({ chain_id: eip155_1.chain_id, contract: usdc });

const [bal, dec, sym] = await Promise.all([
  balance_of({ owner: holder })(ctx),
  decimals()(ctx),
  symbol()(ctx),
]);
```

The contract address is bound at `contract({ chain_id, contract })` time; the method is bound at `balance_of(...)`. Each call resolves to a single `eth_call` with the right calldata.

## Reads — raw `eth_call`

When you don't have a binding (e.g. a project-specific contract), build calldata with the codec and call directly:

```ts
import { make_codec, parse_abi } from "@ethernauta/abi";
import { eth_call } from "@ethernauta/eth";

const fragment = parse_abi(["function quoteExactInputSingle(...) returns (uint256)"])[0];
const codec = make_codec(fragment);

const calldata = codec.encode_inputs([token_in, token_out, fee, amount_in, 0n]);

const result_bytes = await eth_call({
  to: quoter,
  input: calldata,
  block: "latest",
})(reader({ chain_id: eip155_1.chain_id }));

const [amount_out] = codec.decode_outputs(result_bytes);
```

This is what the generated ERC bindings do under the hood.

## Writes — `Signable<Hash32>`

```ts
import { create_signer } from "@ethernauta/transport";
import { transfer, approve } from "@ethernauta/erc/20";

const signer = create_signer([eip155_1]);

const approve_hash = await approve({
  spender: router,
  amount: parse_unit("100", 6),
})(signer({ chain_id: eip155_1.chain_id, contract: usdc }));
```

The signer fills in nonce / gas / fees. The dapp only specifies the call.

## Writes — path 2

To inspect or persist the signed bytes before broadcast (see [signing transactions](/guides/signing-transactions)):

```ts
import { eth_sign_transaction, eth_send_raw_transaction } from "@ethernauta/eth";

const signed = await eth_sign_transaction({
  to: usdc,
  input: encoded_approve_calldata,
  value: "0x0",
})(signer({ chain_id: eip155_1.chain_id }));

const hash = await eth_send_raw_transaction(signed)(
  writer({ chain_id: eip155_1.chain_id }),
);
```

## Batched calls

For "approve + swap" or any multi-step interaction, use EIP-5792:

```ts
import { wallet_send_calls } from "@ethernauta/eip/5792";

const id = await wallet_send_calls({
  version: "1.0",
  chain_id: "0x1",
  from: account,
  calls: [
    { to: usdc, data: encoded_approve },
    { to: router, data: encoded_swap },
  ],
})(signer({ chain_id: eip155_1.chain_id }));
```

The wallet picks the best execution strategy (multicall, EIP-7702 set-code, smart-account UserOp) for the active chain. The dapp doesn't choose.

## See also

- [@ethernauta/abi](/abi/overview) — the codec.
- [@ethernauta/erc](/ercs/overview) — generated bindings for the standards.
- [EIP-5792](/eips/5792) — batched calls.
- [@ethernauta/transport → create_contract](/transport/overview).
