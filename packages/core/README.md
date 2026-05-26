[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/core&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/core&treeshake=[*])

## Philosophy

This module is the canonical home of the **primitive Valibot schemas** used everywhere else in the monorepo — addresses, fixed-width byte sequences, uintN sizes, the 32-byte hash type, and a few small protocol primitives. Every other package depends on it; nothing here depends on the rest of the library.

The shapes mirror the Ethereum execution-apis [base types](https://github.com/ethereum/execution-apis/blob/main/src/schemas/base-types.yaml). A schema in `@ethernauta/core` is the single source of truth — feature packages **compose** these primitives instead of redeclaring regexes.

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

Every export pairs a `xxxSchema` Valibot schema with an `Xxx` type inferred via `v.InferOutput`. The idiom across the monorepo is:

```ts
import { parse } from "valibot"
import { addressSchema } from "@ethernauta/core"

function transfer(_to: string) {
  const to = parse(addressSchema, _to) // validated `Address`
  // …
}
```

### Address

```ts
import { type Address, addressSchema, addressesSchema } from "@ethernauta/core"

// `addressSchema`     — single 0x-prefixed 20-byte address
// `addressesSchema`   — array of addresses
```

### Hash

```ts
import { type Hash32, hash32Schema } from "@ethernauta/core"

// `hash32Schema` — 0x-prefixed 32-byte hash (transaction / block / topic)
```

### Bytes

```ts
import {
  type Byte, byteSchema,
  type Bytes, bytesSchema,
  type BytesMax32, bytesMax32Schema,
  type Bytes4, bytes4Schema,
  type Bytes8, bytes8Schema,
  type Bytes32, bytes32Schema,
  type Bytes48, bytes48Schema,
  type Bytes64, bytes64Schema,
  type Bytes65, bytes65Schema,
  type Bytes256, bytes256Schema,
} from "@ethernauta/core"

// `byteSchema`       — single 0x-prefixed byte
// `bytesSchema`      — arbitrary 0x-prefixed byte string
// `bytesMax32Schema` — 0x-prefixed byte string ≤ 32 bytes
// `bytesNSchema`     — fixed-width N-byte string (4, 8, 32, 48, 64, 65, 256)
```

### Unsigned integers

```ts
import {
  type Uint, uintSchema,
  type Uint8, uint8Schema,
  type Uint16, uint16Schema,
  type Uint24, uint24Schema,
  type Uint32, uint32Schema,
  type Uint40, uint40Schema,
  type Uint48, uint48Schema,
  type Uint56, uint56Schema,
  type Uint64, uint64Schema,
  type Uint96, uint96Schema,
  type Uint128, uint128Schema,
  type Uint160, uint160Schema,
  type Uint192, uint192Schema,
  type Uint224, uint224Schema,
  type Uint256, uint256Schema,
} from "@ethernauta/core"

// One schema per ABI uintN width. All accept 0x-prefixed
// quantities, validated against `2^N - 1`.
```

### Ratio

```ts
import { type Ratio, ratioSchema } from "@ethernauta/core"

// A 0x-prefixed fraction in [0, 1] (used by tip / cap ratios).
```

### NotFound

```ts
import { type NotFound, notFoundSchema } from "@ethernauta/core"

// The protocol's "absent" sentinel — `null` wrapped as a schema
// so JSON-RPC responses that may resolve to `null` (missing
// block, missing receipt) can be composed with `union([…, notFoundSchema])`.
```
