[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/erc&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/erc&treeshake=[*])

## What will you find here?

ERC method bindings ready to be used to read or write the blockchain. Each method is generated from the standard's reference ABI and is either a `Callable<T>` (view / pure) or a `Signable<Bytes>` (state-changing).

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [EIPs](https://eips.ethereum.org/all#final)
- [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts)

## Currently supports

- [x] Token Standard ([ERC-20](https://eips.ethereum.org/EIPS/eip-20))
- [x] Standard Interface Detection ([ERC-165](https://eips.ethereum.org/EIPS/eip-165))
- [x] Non-Fungible Token Standard ([ERC-721](https://eips.ethereum.org/EIPS/eip-721))
- [x] Multi Token Standard ([ERC-1155](https://eips.ethereum.org/EIPS/eip-1155))
- [x] Tokenized Vault Standard ([ERC-4626](https://eips.ethereum.org/EIPS/eip-4626))

### ERC-20 extensions

- `burnable`, `capped`, `flash-mint`, `mintable`, `pausable`, `permit`, `votes`, `wrapper`

### ERC-721 extensions

- `burnable`, `pausable`, `permit`, `royalty`, `votes`

### Want to see one added?

Please, if this is the case, ask for it in an issue.

### Want to generate them yourself?

You can generate your own methods (ready to be used) if you provide a valid ABI in `.json` format. Check the [CLI package](https://github.com/niconiahi/ethernauta/tree/main/packages/cli).

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### Executing an ERC-20 state-changing method

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

### Reading an ERC-20 view method

```ts
import { balanceOf } from "@ethernauta/erc/20"
import { contract, SEPOLIA_CHAIN_ID } from "./contract"

const TOKEN_ADDRESS = "0x..."
const balance = await balanceOf({ owner: account })(
  contract({ chain_id: SEPOLIA_CHAIN_ID, to: TOKEN_ADDRESS }),
)
```

### Executing an ERC-721 state-changing method

```ts
import { approve } from "@ethernauta/erc/721"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import { signer, writer, SEPOLIA_CHAIN_ID } from "./resolvers"

const NFT_ADDRESS = "0x..."
const signed = await approve([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  "1",
])(signer({ chain_id: SEPOLIA_CHAIN_ID, to: NFT_ADDRESS }))

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Detecting interface support (ERC-165)

```ts
import { supportsInterface } from "@ethernauta/erc/165"
import { contract, SEPOLIA_CHAIN_ID } from "./contract"

const ERC721_INTERFACE_ID = "0x80ac58cd"
const supported = await supportsInterface({
  interfaceId: ERC721_INTERFACE_ID,
})(contract({ chain_id: SEPOLIA_CHAIN_ID, to: NFT_ADDRESS }))
```
