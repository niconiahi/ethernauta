![logo](https://github.com/niconiahi/ethernauta/blob/main/assets/logo.svg)

## Philosophy

The monorepo is arquitectured as per described in [Valibot's thesis](https://valibot.dev/thesis.pdf) so that it takes full use of tree-shaking thus making the bundle size of the library much smaller than similar libraries. It comes with the burden of getting used to composing functions (of small bundle size) but this is helped with a clear API

It's ESM-first, it should run anywhere in the web. Only [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) are used. This repository won't use [Node APIs](https://nodejs.org/dist/latest-v18.x/docs/api/) as part of its design

## Characteristics

- It has no dependencies
- It heavily uses validation schemas to validate every transaction parameters and results
- Seamless API for interacting with multiple blockchain ecosystems (currently: [Ethereum](https://ethereum.org/) and [Solana](https://solana.com/))

## Modules

- [connector](packages/connector/README.md)
- [eth](packages/eth/README.md)
- [sol](packages/sol/README.md)
- [transport](packages/transport/README.md)

## Features

- [x] Chain manipulation methods ([CAIP](https://github.com/ChainAgnostic/caip-js))
- [x] Ethereum base methods ([specification](https://github.com/ethereum/execution-apis/tree/main/src/eth))
- [x] Solana base methods ([specification](https://github.com/solana-labs/solana-web3.js/tree/master/packages/rpc-api/src))
- [x] JSON RPC methods ([specification](https://www.jsonrpc.org/specification))
- [x] Methods for interacting with ERC20 contracts ([EIP-20](https://eips.ethereum.org/EIPS/eip-20))
- [x] Methods for interacting with Metamask ([EIP-1102](https://eips.ethereum.org/EIPS/eip-1102))
- [x] A function that allows to read the blockchain
- [x] Support multiple transports for reader
- [ ] A function that allows to write the blockchain
- [ ] Support multiple transports for writer
- [ ] WalletConnect's connector using [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## API

### reader

#### in Ethernauta

```tsx
import { eip155_11155111, eth_getBlockByHash } from "@ethernauta/eth"
import { getBalance } from "@ethernauta/sol"
import { createReader, encodeChainId, http } from "@ethernauta/transport"

// unique reader
const reader = createReader([
  {
    chainId: "eip155:11155111",
    transports: [
      http(
        "https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c709871faa17483fa65ba8177/"
      ),
    ],
  },
  {
    chainId: "solana:devnet",
    transports: [
      http(
        "https://withered-wider-pool.solana-devnet.quiknode.pro/742e63a8f44b2b9ea78af3feb44e4be930a830a6"
      ),
    ],
  },
])

// ethereum
const ethereumReadable = eth_getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
])
const ethereumSepolia = encodeChainId({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
const block = await readable(reader(ethereumSepolia))
// const block: {
//     number: `0x${string}`;
//     hash: `0x${string}`;
//     parentHash: `0x${string}`;
//     sha3Uncles: `0x${string}`;
//     miner: `0x${string}`;
//     stateRoot: `0x${string}`;
//     transactionsRoot: `0x${string}`;
//     receiptsRoot: `0x${string}`;
//     logsBloom: `0x${string}`;
//     ... 16 more ...;
//     withdrawals?: {
//         ...;
//     }[] | undefined;
// } | null

// solana
const solanaReadable = getBalance([
  "5U3bH5b6XtG99aVWLqwVzYPVpQiFHytBD68Rz2eFPZd7",
])
const solanaDevnet = encodeChainId({
  namespace: "solana",
  reference: "devnet",
})
const balance = await readable(reader(solanaDevnet))
// const balance: {
//    context: {
//        apiVersion: string;
//        slot: number;
//    };
//    value: number;
// }
```

#### in Viem

```tsx
import { createPublicClient, fallback, http } from "viem"
import { mainnet, rinkeby } from "viem/chains"

const client = createPublicClient({
  chain: env.environment === "production" ? mainnet : rinkeby,
  transport: fallback([
    http("https://eth-mainnet.g.alchemy.com/v2"),
    http("https://eth-mainnet.g.alchemy.com/v2"),
  ]),
})
const blockNumber = await client.getBlockNumber()
const chain = await client.chain()
```

### writer

#### in Ethernauta

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

#### in Viem

```tsx
import { createWalletClient, custom } from "viem"
import { mainnet } from "viem/chains"

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const [address] = await client.getAddresses()
const hash = await client.sendTransaction({
  account: address,
  to: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
})
```

