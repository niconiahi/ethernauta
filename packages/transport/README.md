[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/transport&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/transport&treeshake=[*])

## Philosophy

This module owns the protocol layer that the rest of the library composes on top of:

- [JSON-RPC 2.0](https://www.jsonrpc.org/specification) primitives (`Call`, `Response`, `Http`, `http()`)
- [CAIP](https://github.com/ChainAgnostic/caip-js) chain, account, asset and token identifiers
- The four resolver factories — `create_reader`, `create_writer`, `create_signer`, `create_contract` — and their matching method shapes

It is the only package every other published package depends on.

## The four method shapes

Every method exported across the library is one of these four shapes:

| Shape | Factory | Resolver input | Use for |
| --- | --- | --- | --- |
| `Readable<T>` | `create_reader(chains)` | `{ chain_id }` | Chain reads via JSON-RPC (`eth_getBalance`, `eth_getBlockByHash`, …) |
| `Writable<T>` | `create_writer(chains)` | `{ chain_id }` | Chain writes via JSON-RPC (`eth_sendRawTransaction`) |
| `Signable<T>` | `create_signer(chains)` | `{ chain_id, to? }` | Wallet interactions (`eth_requestAccounts`, `eth_signTransaction`, contract `Signable` methods) |
| `Callable<T>` | `create_contract(chains)` | `{ chain_id, to }` | `eth_call` reads against a specific contract |

All four factories take the same `chains` array shape — each entry is `{ chainId, transports? }`. `Promise.any` is used internally so that any one transport succeeding resolves the call.

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

### `create_reader`

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
export const reader = create_reader([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
])
```

### `create_writer`

```ts
import { create_writer, http } from "@ethernauta/transport"

export const writer = create_writer([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
])
```

### `create_signer`

```ts
import { create_signer } from "@ethernauta/transport"

// The signer doesn't broadcast — it bridges to the wallet
// extension via window.postMessage. Transports are optional.
export const signer = create_signer([{ chainId: SEPOLIA_CHAIN_ID }])
```

### `create_contract`

```ts
import { create_contract, http } from "@ethernauta/transport"

// Contract resolver targets a specific `to` address and is
// used by Callable methods that issue `eth_call`.
export const contract = create_contract([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
])
```

### `encode_chain_id` / `decode_chain_id`

```ts
import {
  decode_chain_id,
  encode_chain_id,
} from "@ethernauta/transport"

const chain_id = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
// "eip155:11155111"
const { namespace, reference } = decode_chain_id(chain_id)
// { namespace: "eip155", reference: "11155111" }
```

### `FunctionSidecar`

Sidecar metadata that travels alongside a `eth_signTransaction` request so the wallet can display human-readable function and parameter names. The wallet verifies `keccak(signature)[0:4] === input[0:4]` before showing anything — `names` is display-only.

```ts
import type { FunctionSidecar } from "@ethernauta/transport"

const _function: FunctionSidecar = {
  signature: "transfer(address,uint256)",
  names: ["to", "value"],
}
```

