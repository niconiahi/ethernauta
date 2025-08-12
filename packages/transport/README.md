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
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://grounded-electronic-house.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
export const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
export const reader = create_reader([
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
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://grounded-electronic-house.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
export const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
export const writer = create_writer([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])
```

## Files to pay attention

- [call.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/src/call.ts)
- [http.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/src/http.ts)
- [json-rpc.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/src/json-rpc.ts)
- [reader.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/src/reader.ts)
- [writer.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/src/writer.ts)

### chain

- [chain/encode-chain-id.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/src/chain/encode-chain-id.ts)
- [chain/decode-chain-id.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/src/chain/decode-chain-id.ts)
