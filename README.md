![logo](https://github.com/niconiahi/ethernauta/blob/main/assets/logo.svg)

## Use Ethernauta with your AI agent

Drop [`skills/ethernauta/SKILL.md`](https://github.com/niconiahi/ethernauta/blob/main/skills/ethernauta/SKILL.md) into your agent's context and it will know — without visiting these docs — how to wire chains, read state, connect a wallet, sign transactions, and call contracts the Ethernauta way. The skill is concept-by-concept (WHAT it is, WHEN to reach for it) and links to a self-contained, copy-pasteable example for every section under [`skills/ethernauta/examples/`](https://github.com/niconiahi/ethernauta/tree/main/skills/ethernauta/examples). Every pattern is lifted from real code in [Animatronik](https://github.com/niconiahi/animatronik) or the in-repo playground — nothing speculative.

## Full working example: Animatronik

[**Animatronik**](https://github.com/niconiahi/animatronik) is a production NFT dApp built end-to-end on Ethernauta. It uses the ABI generator for [its contract](https://github.com/niconiahi/animatronik/blob/main/contracts/out/AnimatronikContract.sol/AnimatronikContract.json) methods, `create_contract` for view reads, and `create_signer` + `create_writer` for state changes. The source is the most complete public reference for consuming the library.

## Philosophy

The monorepo is arquitectured as per described in [Valibot's thesis](https://valibot.dev/thesis.pdf) so that it takes full use of tree-shaking thus making the bundle size of the library much smaller than similar libraries. It comes with the burden of getting used to composing functions (of small bundle size) but this is helped with a clear API

It's ESM only, it should run anywhere in the web. Only [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) are used. This repository won't use [Node APIs](https://nodejs.org/dist/latest-v18.x/docs/api/) as part of its design

## Characteristics

- It only has heavy cryptography libraries as dependencies
- It uses validation schemas to validate every piece of data that flows through the library
- Seamless API for interacting with multiple blockchain ecosystems (currently: [Ethereum](https://ethereum.org/))

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

## Features

- [x] Chain manipulation methods ([CAIP](https://github.com/ChainAgnostic/caip-js))
- [x] Ethereum base methods ([specification](https://github.com/ethereum/execution-apis/tree/main/src/eth))
- [x] JSON RPC methods ([specification](https://www.jsonrpc.org/specification))
- [x] Reader factory for blockchain reads with multiple transports
- [x] Writer factory for blockchain writes with multiple transports
- [x] Signer factory for wallet interactions with multiple transports
- [x] Contract factory for `eth_call` against a specific contract with multiple transports
- [x] Four method shapes: `Readable<T>`, `Writable<T>`, `Signable<T>`, `Callable<T>`
- [x] Sign transactions with the wallet ([EIP-1559](https://eips.ethereum.org/EIPS/eip-1559))
- [x] `FunctionSidecar` protocol for ABI-aware transaction signing in the wallet
- [x] Methods for interacting with Metamask ([EIP-1102](https://eips.ethereum.org/EIPS/eip-1102))
- [x] EIP-1193 provider implementation ([specification](https://eips.ethereum.org/EIPS/eip-1193))
- [x] Multi-injected provider discovery ([EIP-6963](https://eips.ethereum.org/EIPS/eip-6963))
- [x] ABI encoding/decoding ([abi-spec](https://docs.soliditylang.org/en/latest/abi-spec.html))
- [x] ABI code generator (emits `Callable` for view methods, `Signable` for state-changing methods)
- [x] Token Standard ([ERC-20](https://eips.ethereum.org/EIPS/eip-20))
- [x] Standard Interface Detection ([ERC-165](https://eips.ethereum.org/EIPS/eip-165))
- [x] Non-Fungible Token Standard ([ERC-721](https://eips.ethereum.org/EIPS/eip-721))
- [x] Multi Token Standard ([ERC-1155](https://eips.ethereum.org/EIPS/eip-1155))
- [x] Tokenized Vault Standard ([ERC-4626](https://eips.ethereum.org/EIPS/eip-4626))
- [x] Batched calls ([EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) — `wallet_sendCalls` / `wallet_getCallsStatus`)
- [x] Chrome extension wallet
- [ ] Metamask's connector using [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [ ] WalletConnect's connector using [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Examples

### Creating reader

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

### Reading from the blockchain

```ts
import { eth_getBlockByHash } from "@ethernauta/eth"
import { reader, SEPOLIA_CHAIN_ID } from "./reader"

const readable = eth_getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
])
const block = await readable(reader({ chain_id: SEPOLIA_CHAIN_ID }))
```

### Creating a writer

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import {
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
export const writer = create_writer([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
])
```

### Creating a signer

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import {
  create_signer,
  encode_chain_id,
} from "@ethernauta/transport"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
export const signer = create_signer([{ chainId: SEPOLIA_CHAIN_ID }])
```

### Creating a contract resolver

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import {
  create_contract,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
export const contract = create_contract([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
])
```

### Requesting accounts from the wallet

```ts
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import { signer, SEPOLIA_CHAIN_ID } from "./signer"

const [account] = await eth_requestAccounts()(
  signer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Signing and broadcasting a transaction

```ts
import {
  eth_sendRawTransaction,
  eth_signTransaction,
} from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/utils"
import { signer, writer, SEPOLIA_CHAIN_ID } from "./resolvers"

const signed_transaction = await eth_signTransaction([
  {
    to: "0x515e9e0565fdddd4f8a9759744734154da453585",
    value: number_to_hex(1),
  },
])(signer({ chain_id: SEPOLIA_CHAIN_ID }))

const hash = await eth_sendRawTransaction([signed_transaction])(
  writer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Reacting to transaction states

```ts
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import { hex_to_number } from "@ethernauta/utils"
import { reader, SEPOLIA_CHAIN_ID } from "./reader"

// Single-hash UI tracking — inline ~10-line poll. The wallet
// owns batched-call tracking via EIP-5792 (wallet_getCallsStatus);
// for a single tx, just poll the receipt directly.
const interval_id = setInterval(async () => {
  const receipt = await eth_getTransactionReceipt([hash])(
    reader({ chain_id: SEPOLIA_CHAIN_ID }),
  )
  if (!receipt || !receipt.status) return
  const status = hex_to_number(receipt.status) === 1 ? "mined" : "reverted"
  // update your UI with `status` and `hash`
  clearInterval(interval_id)
}, 2000)
```

### Executing an ERC-20 method

```ts
import { transfer } from "@ethernauta/erc/20"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/utils"
import { signer, writer, SEPOLIA_CHAIN_ID } from "./resolvers"

const TOKEN_ADDRESS = "0x..."
const signed = await transfer([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  number_to_hex(1),
])(signer({ chain_id: SEPOLIA_CHAIN_ID, to: TOKEN_ADDRESS }))

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Reading from a contract

```ts
import { balanceOf } from "@ethernauta/erc/20"
import { contract, SEPOLIA_CHAIN_ID } from "./contract"

const TOKEN_ADDRESS = "0x..."
const balance = await balanceOf({ owner: account })(
  contract({ chain_id: SEPOLIA_CHAIN_ID, to: TOKEN_ADDRESS }),
)
```

