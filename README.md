### Next generation

### writer

#### in Ethernauta
```tsx
// these are surgically imported to make the bundle size as low as possible
import { mainnet, rinkeby } from "@ethernauta/chain";
import { sendTransaction } from "@ethernauta/method";
import { http, createWriter } from "@ethernauta/transport";
import { createWalletConnect } from "@ethernauta/connectors";

const walletConnect = createWalletConnect(env.WALLET_CONNECT_PROJECT_ID)
const writer = createWriter(
  http(walletConnect(env.ENVIRONMENT === 'production' ? mainnet : rinkeby))
)
const sendTransactionResponse = await writer(
  sendTransaction([{
    from: '0xF344B01DA08b142D2466dae9e47E333f22e64588',
    data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
  }])
)
```

#### in Viem
```tsx
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
})
const [address] = await client.getAddresses()
const hash = await client.sendTransaction({ 
  account: address,
  to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'
})
```

### reader

#### in Ethernauta
```tsx
// these are surgically imported to make the bundle size as low as possible
import { mainnet, rinkeby } from "@ethernauta/chain";
import { blockNumber, chain } from "@ethernauta/method";
import { http, createReader } from "@ethernauta/transport";
import { createAlchemy, createInfura } from "@ethernauta/connectors";

const alchemy = createAlchemy(env.WALLET_CONNECT_PROJECT_ID)
const infura = createInfura(env.INFURA_ID)
const reader =  createReader([
  http(infura(env.ENVIRONMENT === 'production' ? mainnet : rinkeby)),
  http(alchemy(env.ENVIRONMENT === 'production' ? mainnet : rinkeby))
])
const blockNumber_ = await reader.send(blockNumber())
const chain_ = await reader.send(chain())
```

#### in Viem
```tsx
import { createPublicClient, http } from 'viem'
import { mainnet, rinkeby } from 'viem/chains'

const client = createPublicClient({ 
  chain: env.ENVIRONMENT === 'production' ? mainnet : rinkeby,
  transport: fallback([
    http('https://eth-mainnet.g.alchemy.com/v2'), 
    http('https://eth-mainnet.g.alchemy.com/v2')
  ])
})
const blockNumber = await client.getBlockNumber() 
const chain = await client.chain() 
```
