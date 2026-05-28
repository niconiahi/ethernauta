---
title: "@ethernauta/abi"
section: Overview
section_order: 7
order: 3
---

# @ethernauta/abi

The ABI codec. Encode function calls, decode return values, decode logs, generate TypeScript bindings from contract ABIs.

```bash
pnpm add @ethernauta/abi
```

## What ships

- **Codec primitives** (`address`, `bool`, `string_`, `uint256`, `bytes32`, …) — one per Solidity type.
- **Composers** — `array(codec)`, `tuple(codecs)` for higher-order types.
- **`make_codec(fragment)`** — turn an ABI function fragment into a single encode/decode pair.
- **`parse_abi(abi)`** — parse a raw JSON ABI into the codec-ready shape.
- **`decode_logs(events, logs)`** — match raw logs against event signatures, return typed entries.
- **`to_selector(signature)`** — 4-byte function selector from a Solidity signature string.
- **`revert`** — decode Solidity revert payloads (`Error(string)`, `Panic(uint256)`, custom errors).
- **Code generation** via `@ethernauta/abi/generator` — produce method binding files from an ABI.

## Codec primitives

Each Solidity static type has a matching codec:

| Codec | Solidity |
|---|---|
| `address` | `address` |
| `bool` | `bool` |
| `string_` | `string` (underscore to avoid the JS keyword) |
| `bytes` | `bytes` (dynamic) |
| `bytes4`, `bytes8`, `bytes32`, `bytes48`, `bytes65`, `bytes256` | fixed-length `bytesN` |
| `hash32` | semantic alias of `bytes32` for hashes |
| `uint8`, `uint16`, `uint24`, `uint32`, `uint40`, `uint48`, `uint56`, `uint64`, `uint96`, `uint128`, `uint160`, `uint192`, `uint224`, `uint256`, `uint` | unsigned ints |

Each is an `AbiCodec<T>`:

```ts
import { uint256 } from "@ethernauta/abi";
import { Uint256Schema } from "@ethernauta/core";
import { parse } from "valibot";

const codec = uint256();
const encoded = codec.encode(parse(Uint256Schema, "0x2a"));
const decoded = codec.decode(encoded, 0);
```

`InferCodec<C>` extracts the TS type a codec produces; `InferArrayElement<C>` gets the element type of an array codec.

## Composers

```ts
import { array, tuple, uint256, address, bool } from "@ethernauta/abi";

// uint256[]
const uint_array = array(uint256());

// (address, uint256, bool)
const trio = tuple({
  to: address(),
  amount: uint256(),
  ok: bool(),
});

// (address, uint256[])
const mixed = tuple({
  to: address(),
  amounts: array(uint256()),
});
```

The codec composes the way the type composes. The codec for a function fragment with `(address spender, uint256 amount)` is `tuple([address, uint256])`.

## make_codec

The high-level builder. Pass an ABI function fragment, get a codec back:

```ts
import {
  address,
  encode_function_call,
  uint256,
} from "@ethernauta/abi";
import { AddressSchema, Uint256Schema } from "@ethernauta/core";
import { parse } from "valibot";

const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const amount = parse(Uint256Schema, "0x3e8");

const calldata = encode_function_call({
  name: "transfer",
  args: [address(), uint256()] as const,
  values: [to, amount] as const,
});
```

Used internally by `packages/erc/src/*/methods/*` to bind every ERC method.

## Log decoding

```ts
import {
  address,
  decode_logs,
  type EventEntry,
  uint256,
} from "@ethernauta/abi";
import type { EventLog } from "@ethernauta/abi";

const entries: EventEntry[] = [
  {
    name: "Transfer",
    args: [address(), address(), uint256()],
    indexed: [true, true, false],
  },
];

declare const raw_logs: readonly EventLog[];

const decoded = decode_logs(entries, raw_logs);
// → DecodedLogEntry[]
//   each carrying { name, args, log }
```

`EventEntry<T>` is the typed shape of one decoded event; `DecodedLogEntry` is the union across all event signatures the caller passed.

## Selectors

```ts
import { to_selector } from "@ethernauta/abi";

to_selector("transfer(address,uint256)");   // → Uint8Array([0xa9, 0x05, 0x9c, 0xbb])
to_selector("balanceOf(address)");          // → Uint8Array([0x70, 0xa0, 0x82, 0x31])
```

Used by the registry generator (`@ethernauta/erc/registry`) and by the wallet's `wallet_sendCalls` UI to display human-readable method names from selectors.

## Revert decoding

```ts
import { decode_revert_reason } from "@ethernauta/abi";
import { BytesSchema } from "@ethernauta/core";
import { parse } from "valibot";

// raw revert bytes from eth_call
const raw_bytes = parse(BytesSchema, "0x");
const reason = decode_revert_reason(raw_bytes);
// →
//   | { kind: "empty" }
//   | { kind: "error"; reason: string }
//   | { kind: "panic"; code: bigint }
//   | { kind: "custom"; selector: Bytes; data: Bytes }
```

Picks `Error(string)`, `Panic(uint256)`, or custom-error / raw fallback. The wallet uses this to surface readable revert reasons in its UI; dapps use it for the same purpose.

## Code generation

```bash
pnpm dlx @ethernauta/cli abi --in ./erc20.abi.json --out ./generated/
```

Produces one TypeScript file per ABI method. Each file binds the method into a `Callable<T>` you can use directly:

```ts ignore
// generated/balance-of.ts (auto-generated, illustrative)
import { make_codec } from "@ethernauta/abi";
import type { Callable } from "@ethernauta/transport";

// each generated method binds the function selector + decoder once
// and returns a Callable<T> ready to be passed through `eth_call`.
export function balanceOf(_args: readonly [Address]): Callable<Uint256> {
  /* curried codec invocation */
}
```

`@ethernauta/abi/generator` exposes the generator primitives (`generate`, `emit_name_for`, `emit_file_basename_for`) if you want to embed codegen in your own tooling.

## See also

- [@ethernauta/erc](/ercs/overview) — entire ERC catalog generated by this codec.
- [@ethernauta/cli](/cli/overview) — the codegen command-line tool.
- [Tooling → ERC codegen](/tooling/erc-codegen) — how to regenerate the registry.
