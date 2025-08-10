![logo](https://github.com/niconiahi/ethernauta/blob/main/assets/logo.svg)

## Philosophy

The monorepo is arquitectured as per described in [Valibot's thesis](https://valibot.dev/thesis.pdf) so that it takes full use of tree-shaking thus making the bundle size of the library much smaller than similar libraries. It comes with the burden of getting used to composing functions (of small bundle size) but this is helped with a clear API

It's ESM only, it should run anywhere in the web. Only [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) are used. This repository won't use [Node APIs](https://nodejs.org/dist/latest-v18.x/docs/api/) as part of its design

## Characteristics

- It only has heavy cryptography libraries as dependencies
- It uses validation schemas to validate every piece of data that flows through the library
- Seamless API for interacting with multiple blockchain ecosystems (currently: [Ethereum](https://ethereum.org/))

## Modules

- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/README.md)
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/README.md)
- [connector](https://github.com/niconiahi/ethernauta/blob/main/packages/connector/README.md)
- [transport](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/README.md)
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/README.md)

## Features

- [x] Chain manipulation methods ([CAIP](https://github.com/ChainAgnostic/caip-js))
- [x] Ethereum base methods ([specification](https://github.com/ethereum/execution-apis/tree/main/src/eth))
- [x] JSON RPC methods ([specification](https://www.jsonrpc.org/specification))
- [x] Methods for interacting with ERC20 contracts ([EIP-20](https://eips.ethereum.org/EIPS/eip-20))
- [x] Methods for interacting with Metamask ([EIP-1102](https://eips.ethereum.org/EIPS/eip-1102))
- [x] A function that allows to read the blockchain
- [x] Support multiple transports for reader
- [x] A function that allows to write the blockchain
- [x] Support multiple transports for writer
- [x] Sign transaction with wallet
- [x] Transaction tracking system
- [ ] WalletConnect's connector using [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Complete example

### Reading from the blockchain

```tsx
import { eth_getBlockByHash } from "@ethernauta/eth"
import { createReader, encodeChainId, http } from "@ethernauta/transport"
import { eip155_11155111, encodeChainId, decodeChainId } from "@ethernauta/chain"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const SEPOLIA_CHAIN_ID = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const reader = createReader([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http(
        "https://snow-fragment-stone.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"
      ),
    ],
  }
])
const readable = eth_getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
])
const block = await readable(reader(ethereumSepolia))
```

### Writing to the blockchain

```tsx
import { mainnet, rinkeby } from "@ethernauta/chain"
import { createWalletConnect } from "@ethernauta/connectors"
import { eth_sendTransaction } from "@ethernauta/eth"
import { createWriter, http } from "@ethernauta/transport"

const walletConnect = createWalletConnect(env.WALLET_CONNECT_PROJECT_ID)
const writer = createWriter(
  http(walletConnect(env.ENVIRONMENT === "production" ? mainnet : rinkeby))
)
const writable = eth_sendTransaction([
  {
    from: "0xF344B01DA08b142D2466dae9e47E333f22e64588",
    data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
  },
])
const hash = await writable(writer)
```
