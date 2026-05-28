[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/abi&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/abi&treeshake=[*])

## Philosophy

This module is an un-opinionated representation of the [Solidity ABI specification](https://docs.soliditylang.org/en/latest/abi-spec.html). It covers two responsibilities:

- **Runtime ABI codec** — encode function calls / constructor calls, decode function results, decode `Error(string)` / `Panic(uint256)` revert payloads, encode + decode event topics and logs.
- **Code generation** — emit ready-to-use TypeScript methods from an ABI JSON or a Foundry artifact.

Generated methods come in two flavors:

- `Callable<T>` for view / pure functions — consumed by a contract resolver, fires `eth_call`.
- `Signable<Bytes>` for state-changing functions — consumed by a signer resolver, returns the signed raw transaction ready for `eth_sendRawTransaction`.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### Encode a function call

```ts
import { build_signature, encode_function_call, function_selector, to_selector } from "@ethernauta/abi"
import { bytes_to_hex } from "@ethernauta/utils"

const signature = build_signature("transfer", ["address", "uint256"])
const selector = function_selector(signature)        // Bytes4 — keccak256(signature)[0:4]
const calldata = encode_function_call(
  signature,
  ["address", "uint256"],
  ["0x515e9e0565fdddd4f8a9759744734154da453585", 1n],
)
const input = bytes_to_hex(calldata) // "0xa9059cbb000000…"

// Also exported: `to_selector(name, inputs)` — same as
// `function_selector(build_signature(name, inputs))`.
```

### Encode a constructor call

```ts
import { encode_constructor_call } from "@ethernauta/abi"

const init_code = encode_constructor_call(
  bytecode,                  // Uint8Array — runtime + constructor
  ["address", "uint256"],    // constructor input types
  ["0x…", 1n],
)
```

### Decode a function result

```ts
import { decode_function_result } from "@ethernauta/abi"

const [decoded] = decode_function_result(
  ["uint256"],
  "0x0000000000000000000000000000000000000000000000000000000000000002",
)
// 2n
```

### Decode raw call data

Inverse of `encode_function_call` — useful for wallets inspecting an unknown `input` field.

```ts
import { decode_function_call } from "@ethernauta/abi"

const args = decode_function_call(["address", "uint256"], calldata)
```

### Decode a revert payload

```ts
import { decode_revert_reason } from "@ethernauta/abi"

const reason = decode_revert_reason(revert_bytes)
// { kind: "error", message: "ERC20: transfer to the zero address" }
// or { kind: "panic", code: 0x11 }
// or { kind: "raw", data: "0x…" }
```

`RevertReasonSchema` is exported for callers that want to validate / parse external payloads.

### Encode and decode event topics + logs

```ts
import {
  encode_event_topics,
  event_topic_hash,
  decode_event_log,
  decode_logs,
} from "@ethernauta/abi"

// Build the topic filter for an event signature
const topics = encode_event_topics({
  signature: "Transfer(address,address,uint256)",
  indexed: ["address", "address", "uint256"],
  filter: [from_address, undefined, undefined],
})

// Hash a single event signature
const topic0 = event_topic_hash("Transfer(address,address,uint256)")

// Decode a single log against a known ABI shape
const event = decode_event_log({
  signature: "Transfer(address,address,uint256)",
  inputs: [
    { name: "from", type: "address", indexed: true },
    { name: "to", type: "address", indexed: true },
    { name: "value", type: "uint256", indexed: false },
  ],
  topics: [topic0, "0x…", "0x…"],
  data: "0x…",
})

// Walk a batch of logs from `eth_getLogs`
const decoded = decode_logs(events_abi, raw_logs)
```

### Compose codecs by hand — `make_codec` and the primitives

When the call shape varies at runtime (a registry that holds heterogeneous types), build the codec from primitive `AbiCodec<T>` instances.

```ts
import {
  type AbiCodec,
  address, bool, bytes, bytes4, bytes32,
  string_, uint256, hash32,
  array, tuple,
  encode_sequence, decode_sequence,
  make_codec,
} from "@ethernauta/abi"

const codec = tuple({ to: address(), value: uint256() })
const packed = encode_sequence([codec], [{ to: "0x…", value: 1n }])
const [decoded] = decode_sequence([codec], packed)

// `make_codec("uint256")` returns the primitive by Solidity name
const dynamic = make_codec("address")
```

`uint256` also exposes raw width helpers — `read_uint256` / `write_uint256` for tight loops that bypass the `AbiCodec` envelope.

### Parse and walk an ABI

```ts
import {
  parse_abi,
  type Description,
  DescriptionSchema,
} from "@ethernauta/abi"

const descriptions = parse_abi(ERC20_ABI)
// Description = function | constructor | fallback | receive | event | error
```

### Generate methods programmatically

```ts
import {
  type Description,
  DescriptionSchema,
  emit_name_for,
  emit_file_basename_for,
  generate,
} from "@ethernauta/abi/generator"
import { array, parse } from "valibot"

const descriptions = parse(array(DescriptionSchema), ERC721_ABI)
const functions = descriptions.filter(
  (description): description is Description => description.type === "function",
)
generate(functions, "app") // methods will be generated at "app/methods"

// Pure name helpers (the same ones the generator uses internally)
const fn_name = emit_name_for("transferFrom") // "transferFrom"
const file_name = emit_file_basename_for("transferFrom") // "transfer-from"
```

### Generate methods via the CLI

```bash
npx ethernauta abi --in abis/IERC20.abi.json --out app/methods
```

See [`@ethernauta/cli`](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) for the full CLI reference.
