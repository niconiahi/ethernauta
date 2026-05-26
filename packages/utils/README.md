[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/utils&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/utils&treeshake=[*])

## Philosophy

This module is a set of small, dependency-free utilities used across the other packages. It is intentionally generic — nothing here knows about Ethereum, chains, or transactions. Pure, side-effect-free, no third-party runtime dependencies. **No new dependencies in `@ethernauta/utils`** is a hard rule of the monorepo.

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

### Hex ↔ bytes

```ts
import { bytes_to_hex, hex_to_bytes, strip_hex_prefix } from "@ethernauta/utils"

const hex = bytes_to_hex(new Uint8Array([0xde, 0xad, 0xbe, 0xef])) // "0xdeadbeef"
const bytes = hex_to_bytes("0xdeadbeef")                            // Uint8Array
const stripped = strip_hex_prefix("0xdeadbeef")                     // "deadbeef"
```

### Hex ↔ number

```ts
import { hex_to_number, number_to_hex } from "@ethernauta/utils"

const hex = number_to_hex(255)  // "0xff"
const value = hex_to_number("0xff") // 255
```

### Bytes ↔ unsigned integer

```ts
import { bytes_to_uint } from "@ethernauta/utils"

const n = bytes_to_uint(new Uint8Array([0x01, 0x00])) // 256n
```

### RLP encoding

```ts
import { rlp_encode, type RlpInput } from "@ethernauta/utils"

const encoded = rlp_encode([
  new Uint8Array([0x01]),
  new Uint8Array([0x02, 0x03]),
])
```

### Wei ↔ string formatting

```ts
import {
  format_ether, format_gwei, format_unit,
  parse_ether, parse_gwei, parse_unit,
} from "@ethernauta/utils"

format_ether(1_000_000_000_000_000_000n)  // "1"
format_gwei(2_000_000_000n)               // "2"
format_unit(123_456n, 4)                  // "12.3456"

parse_ether("1.5")                         // 1500000000000000000n
parse_gwei("2")                            // 2000000000n
parse_unit("12.34", 4)                     // 123400n
```

### Time helpers

```ts
import { seconds_to_big, now_to_big, deadline_in } from "@ethernauta/utils"

const now = now_to_big()                        // BigInt seconds since epoch
const in_one_minute = deadline_in(60)           // now + 60
const ms_as_bigint = seconds_to_big(30)         // 30n
```

### Case conversion

```ts
import { camel_to_kebab } from "@ethernauta/utils"

camel_to_kebab("transferFrom") // "transfer-from"
```

### Type narrowing — `invariant`

```ts
import { invariant } from "@ethernauta/utils"

const input: string | null = "helloWorld"
invariant(typeof input === "string", "input must be a string")
// input is narrowed to `string` from here on
```
