## Philosophy

The monorepo is arquitectured as per described in [Valibot's thesis](https://valibot.dev/thesis.pdf) so that it takes full use of tree-shaking thus making the bundle size of the library much smaller than similar libraries. It comes with the burden of getting used to composing functions (of small bundle size) but this is helped with a clear API

## API

### reader

#### in Ethernauta
```tsx
// these are surgically imported to make the bundle size as low as possible
import { createReader, httpTransport } from "@ethernauta/transport"
import { getBlockByHash } from "@ethernauta/method"

const reader = createReader([
  httpTransport("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c420871faa17483fa65ba8177"),
  httpTransport("https://snowy-fragrant-haze.ethereum-sepolia.quiknode.pro/71bd09c56eb85b1c222871faa17483fa65ba8177"),
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
// these are surgically imported to make the bundle size as low as possible
import { mainnet, rinkeby } from "@ethernauta/chain"
import { sendTransaction } from "@ethernauta/method"
import { createWriter, http } from "@ethernauta/transport"
import { createWalletConnect } from "@ethernauta/connectors"

const walletConnect = createWalletConnect(env.WALLET_CONNECT_PROJECT_ID)
const writer = createWriter(
  http(walletConnect(env.ENVIRONMENT === "production" ? mainnet : rinkeby))
)
const sendTransaction_ = await writer(
  sendTransaction([{
    from: "0xF344B01DA08b142D2466dae9e47E333f22e64588",
    data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
  }])
)
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
