[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/abi&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/abi&treeshake=[*])

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [abi-spec](https://docs.soliditylang.org/en/latest/abi-spec.html)

It covers two responsibilities:

- Runtime ABI codec: encode function calls and decode function results
- Code generation: emit ready-to-use TypeScript methods from an ABI JSON

Generated methods come in two flavors:

- `Callable<T>` for view / pure functions — consumed by a contract resolver, fires `eth_call`
- `Signable<Bytes>` for state-changing functions — consumed by a signer resolver, returns the signed raw transaction ready for `eth_sendRawTransaction`

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

### Encode a function call

```ts
import {
  build_signature,
  encode_function_call,
} from "@ethernauta/abi"
import { bytes_to_hex } from "@ethernauta/utils"

const signature = build_signature("transfer", ["address", "uint256"])
const calldata = encode_function_call(
  signature,
  ["address", "uint256"],
  ["0x515e9e0565fdddd4f8a9759744734154da453585", 1n],
)
const input = bytes_to_hex(calldata) // "0xa9059cbb000000…"
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

### Generate methods programmatically

```ts
import {
  type Description,
  DescriptionSchema,
  generate,
} from "@ethernauta/abi/generator"
import { array, parse } from "valibot"

const descriptions = parse(array(DescriptionSchema), ERC721_ABI)
const functions = descriptions.filter(
  (description): description is Description =>
    description.type === "function",
)
generate(functions, "app") // methods will be generated at "app/methods"
```

### Generate methods via the CLI

```bash
npx ethernauta abi --in abis/IERC20.abi.json --out app/methods
```

See [`@ethernauta/cli`](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) for the full CLI reference.
