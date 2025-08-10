[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/transport@0.0.10&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/transport@0.0.10&treeshake=[*])

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification)

## Modules

- [chain](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/README.md)
- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/README.md)
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/README.md)
- [transport](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/README.md)
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/README.md)

## Examples

### Creating reader

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import {
  createReader,
  encodeChainId,
  http,
} from "@ethernauta/transport"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://grounded-electronic-house.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
export const SEPOLIA_CHAIN_ID = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
export const reader = createReader([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])
```

### Creating a writer

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import {
  createWriter,
  encodeChainId,
  http,
} from "@ethernauta/transport"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://grounded-electronic-house.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
export const SEPOLIA_CHAIN_ID = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
export const writer = createWriter([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])
```

## Files to pay attention

- [call.ts](src/call.ts)
- [http.ts](src/http/http.ts)
- [json-rpc.ts](src/json-rpc/json-rpc.ts)
- [reader.ts](src/reader/reader.ts)
- [writer.ts](src/writer/writer.ts)
- [chain/encode-chain-id.ts](src/chain/encode-chain-id.ts)
- [chain/decode-chain-id.ts](src/chain/decode-chain-id.ts)
