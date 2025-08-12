![logo](https://github.com/niconiahi/ethernauta/blob/main/assets/logo.svg)

## Philosophy

The monorepo is arquitectured as per described in [Valibot's thesis](https://valibot.dev/thesis.pdf) so that it takes full use of tree-shaking thus making the bundle size of the library much smaller than similar libraries. It comes with the burden of getting used to composing functions (of small bundle size) but this is helped with a clear API

It's ESM only, it should run anywhere in the web. Only [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) are used. This repository won't use [Node APIs](https://nodejs.org/dist/latest-v18.x/docs/api/) as part of its design

## Characteristics

- It only has heavy cryptography libraries as dependencies
- It uses validation schemas to validate every piece of data that flows through the library
- Seamless API for interacting with multiple blockchain ecosystems (currently: [Ethereum](https://ethereum.org/))

## Example

You can check the [officially maintained repository](https://github.com/niconiahi/ethernauta/blob/main/examples/playground) for a full overview of the libraries usage

## Modules

- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth)
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet)
- [connector](https://github.com/niconiahi/ethernauta/blob/main/packages/connector)
- [transport](https://github.com/niconiahi/ethernauta/blob/main/packages/transport)
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction)

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
- [x] Sign transaction with wallet ([EIP-1559](https://eips.ethereum.org/EIPS/eip-1559))
- [x] Transaction tracking system
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

### Reading from the blockchain

```ts
import { eth_getBlockByHash } from "@ethernauta/eth";
import { reader, SEPOLIA_CHAIN_ID } from "./reader";

const readable = eth_getBlockByHash([
  "0x31386e6cfba70bb4d8a95404bdb740572b758a15c62e51ee912071a7b5be9e26",
  false,
]);
const block = await readable(reader(SEPOLIA_CHAIN_ID));
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

### Signing a transaction

```ts
import { eth_sendRawTransaction } from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/wallet"

const method = "transfer"
const ADDRESS = "0x515e9e0565fdddd4f8a9759744734154da453585"
const params = [ADDRESS, number_to_hex(1)]
const signed_transaction = await window.wallet.sign(
  method,
  params,
)
```

### Writting to the blockchain

```ts
import { transfer } from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/wallet"
import { writer, SEPOLIA_CHAIN_ID } from "./writer"

const writable = transfer([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  number_to_hex(1),
])
const hash = await writable(writer(SEPOLIA_CHAIN_ID))
```

### Reacting to transaction states

```ts
import { transfer } from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/wallet"
import { writer, SEPOLIA_CHAIN_ID } from "./writer"
import {
  watch_transaction,
  register_transaction
} from "@ethernauta/transaction"

const writable = transfer([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  number_to_hex(1),
])
const hash = await writable(writer(SEPOLIA_CHAIN_ID))
// initial transaction state 
// with "type" key equal "pending"
const transaction = register_transaction(hash)
watch_transaction(hash, (transaction) => {
  // subsequent states that the transaction goes trough
})
```
