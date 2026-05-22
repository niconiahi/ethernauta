[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/utils&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/utils&treeshake=[*])

## Philosophy

This module is a set of small, dependency-free utilities used across the other packages. It is intentionally generic — nothing here knows about Ethereum, chains, or transactions.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### `camel_to_kebab`

```ts
import { camel_to_kebab } from "@ethernauta/utils"

const kebab = camel_to_kebab("helloWorld") // "hello-world"
```

### `invariant`

```ts
import { invariant } from "@ethernauta/utils"

const input: string | null = "helloWorld"
invariant(typeof input === "string", "input must be a string")
// input is narrowed to `string` from here on
```

### `number_to_hex`

```ts
import { number_to_hex } from "@ethernauta/utils"

const hex = number_to_hex(255) // "0xff"
```

### `hex_to_number`

```ts
import { hex_to_number } from "@ethernauta/utils"

const value = hex_to_number("0xff") // 255
```

### `bytes_to_hex`

```ts
import { bytes_to_hex } from "@ethernauta/utils"

const hex = bytes_to_hex(new Uint8Array([0xde, 0xad, 0xbe, 0xef]))
// "0xdeadbeef"
```

### `hex_to_bytes`

```ts
import { hex_to_bytes } from "@ethernauta/utils"

const bytes = hex_to_bytes("0xdeadbeef")
// Uint8Array([0xde, 0xad, 0xbe, 0xef])
```

### `strip_hex_prefix`

```ts
import { strip_hex_prefix } from "@ethernauta/utils"

const stripped = strip_hex_prefix("0xdeadbeef") // "deadbeef"
```
