## Philosophy

The monorepo is arquitectured as per described in [Valibot's thesis](https://valibot.dev/thesis.pdf) so that it takes full use of tree-shaking thus making the bundle size of the library much smaller than similar libraries. It comes with the burden of getting used to composing functions (of small bundle size) but this is helped with a clear API

All "self" code, no third party libraries. It think this is very important due to the lack of validation schemas as core arquitecture of the system. Because of this, error messages can lead to better communication with the Ethereum user in order to guide for a valid and successful transaction

It's ESM-first and edge/browser compatible, it runs anywhere. Only browser native APIs are used. This repository won't use Node APIs as part of its design

## API

### Disclaimer

Right not the system _does not_ know how to handle chains. It will do in the near future. It also doesn't connect to WalletConnect
but it will

### reader

#### in Ethernauta
```tsx
import { getBlockByHash } from "@ethernauta/method"
import { createReader, http } from "@ethernauta/transport"

const reader = createReader([
  http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba8177"),
  http("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c222871faa17483fa65ba8177"),
])
const readable = getBlockByHash(["0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26", false])
const block = await readable(reader)
```

#### in Viem
```tsx
import { createPublicClient, fallback, http } from "viem"
import { mainnet, rinkeby } from "viem/chains"

const client = createPublicClient({
  chain: env.environment === "production" ? mainnet : rinkeby,
  transport: fallback([
    http("https://eth-mainnet.g.alchemy.com/v2"),
    http("https://eth-mainnet.g.alchemy.com/v2")
  ])
})
const blockNumber = await client.getBlockNumber()
const chain = await client.chain()
```

### writer

#### in Ethernauta
```tsx
import { mainnet, rinkeby } from "@ethernauta/chain"
import { createWalletConnect } from "@ethernauta/connectors"
import { sendTransaction } from "@ethernauta/method"
import { createWriter, http } from "@ethernauta/transport"

const walletConnect = createWalletConnect(env.WALLET_CONNECT_PROJECT_ID)
const writer = createWriter(
  http(walletConnect(env.ENVIRONMENT === "production" ? mainnet : rinkeby))
)
const writable = sendTransaction([{
  from: "0xF344B01DA08b142D2466dae9e47E333f22e64588",
  data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
}])
const hash = await writable(writer)
```

#### in Viem
```tsx
import { createWalletClient, custom } from "viem"
import { mainnet } from "viem/chains"

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
})
const [address] = await client.getAddresses()
const hash = await client.sendTransaction({
  account: address,
  to: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC"
})
```
