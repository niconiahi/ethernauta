[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/erc&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/erc&treeshake=[*])

## Philosophy

This module ships ERC method bindings ready to be used to read or write the blockchain. Each method is generated from the standard's reference ABI and is either a `Callable<T>` (view / pure) or a `Signable<Bytes>` (state-changing). One ERC per subpath, one method per file — so a dapp pays only for what it imports.

References:

- [EIPs](https://eips.ethereum.org/all#final)
- [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts)

## Currently supports

| Standard | Subpath | What it covers |
| -------- | ------- | -------------- |
| [ERC-20](https://eips.ethereum.org/EIPS/eip-20) | `@ethernauta/erc/20` | Token Standard + `burnable`, `capped`, `metadata`, `mintable`, `pausable`, `wrapper` extensions |
| [ERC-137](https://eips.ethereum.org/EIPS/eip-137) | `@ethernauta/erc/137` | ENS registry + resolver + `namehash` / `normalize` |
| [ERC-165](https://eips.ethereum.org/EIPS/eip-165) | `@ethernauta/erc/165` | Standard Interface Detection |
| [ERC-181](https://eips.ethereum.org/EIPS/eip-181) | `@ethernauta/erc/181` | ENS reverse resolution |
| [ERC-634](https://eips.ethereum.org/EIPS/eip-634) | `@ethernauta/erc/634` | ENS text records |
| [ERC-721](https://eips.ethereum.org/EIPS/eip-721) | `@ethernauta/erc/721` | Non-Fungible Token Standard + `burnable`, `enumerable`, `metadata`, `pausable` extensions |
| [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155) | `@ethernauta/erc/1155` | Multi Token Standard + `metadata-uri` extension |
| [ERC-1577](https://eips.ethereum.org/EIPS/eip-1577) | `@ethernauta/erc/1577` | ENS `contenthash` records |
| [ERC-2304](https://eips.ethereum.org/EIPS/eip-2304) | `@ethernauta/erc/2304` | ENS multi-coin addr |
| [ERC-2612](https://eips.ethereum.org/EIPS/eip-2612) | `@ethernauta/erc/2612` | ERC-20 permit |
| [ERC-2981](https://eips.ethereum.org/EIPS/eip-2981) | `@ethernauta/erc/2981` | NFT royalty info |
| [ERC-3156](https://eips.ethereum.org/EIPS/eip-3156) | `@ethernauta/erc/3156` | Flash loans (`flash-borrower`, `flash-lender`) |
| [ERC-4494](https://eips.ethereum.org/EIPS/eip-4494) | `@ethernauta/erc/4494` | ERC-721 permit |
| [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) | `@ethernauta/erc/4626` | Tokenized Vault Standard |
| [ERC-5564](https://eips.ethereum.org/EIPS/eip-5564) | `@ethernauta/erc/5564` | Stealth address announcer + scheme-1 |
| [ERC-5805](https://eips.ethereum.org/EIPS/eip-5805) | `@ethernauta/erc/5805` | Voting with delegation |
| [ERC-6372](https://eips.ethereum.org/EIPS/eip-6372) | `@ethernauta/erc/6372` | Contract clock mode |
| [ERC-7683](https://eips.ethereum.org/EIPS/eip-7683) | `@ethernauta/erc/7683` | Cross-chain intents (origin / destination settler, order hash, sign-order) |

### Want one added?

Please file an issue.

### Want to generate them yourself?

You can generate methods from any valid ABI `.json` file. See [`@ethernauta/cli`](https://github.com/niconiahi/ethernauta/tree/main/packages/cli).

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### Reading an ERC-20 view method — `balanceOf`

```ts
import { balanceOf } from "@ethernauta/erc/20"
import { contract, SEPOLIA_CHAIN_ID } from "./contract"

const TOKEN_ADDRESS = "0x…"
const balance = await balanceOf({ owner: account })(
  contract({ chain_id: SEPOLIA_CHAIN_ID, to: TOKEN_ADDRESS }),
)
```

### Writing an ERC-20 state-changing method — `transfer`

```ts
import { transfer } from "@ethernauta/erc/20"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import { number_to_hex } from "@ethernauta/utils"
import { signer, writer, SEPOLIA_CHAIN_ID } from "./resolvers"

const signed = await transfer([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  number_to_hex(1),
])(signer({ chain_id: SEPOLIA_CHAIN_ID, to: TOKEN_ADDRESS }))

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Executing an ERC-721 method — `approve`

```ts
import { approve } from "@ethernauta/erc/721"

const signed = await approve([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  "1",
])(signer({ chain_id: SEPOLIA_CHAIN_ID, to: NFT_ADDRESS }))

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Detecting interface support — ERC-165

```ts
import { supportsInterface } from "@ethernauta/erc/165"

const ERC721_INTERFACE_ID = "0x80ac58cd"
const supported = await supportsInterface({ interfaceId: ERC721_INTERFACE_ID })(
  contract({ chain_id: SEPOLIA_CHAIN_ID, to: NFT_ADDRESS }),
)
```

### Reading a tokenized vault — ERC-4626

```ts
import { totalAssets, convertToShares } from "@ethernauta/erc/4626"

const tvl = await totalAssets()(contract({ chain_id, to: VAULT }))
const shares = await convertToShares({ assets: number_to_hex(1n * 10n ** 18n) })(
  contract({ chain_id, to: VAULT }),
)
```

### ENS forward + reverse resolution — ERC-137 / ERC-181

```ts
import { addr, namehash, normalize, resolver, get_registry_address, ZERO_ADDRESS } from "@ethernauta/erc/137"
import { name } from "@ethernauta/erc/181"

const node = namehash(normalize("vitalik.eth"))
const resolver_address = await resolver({ node })(
  contract({ chain_id, to: get_registry_address(chain_id) }),
)
const address = await addr({ node })(
  contract({ chain_id, to: resolver_address }),
)
```

For the high-level multi-step orchestrators (`get_ens_address`, `get_ens_name`, `get_ens_text`, `get_ens_avatar`), see [`@ethernauta/ens`](https://github.com/niconiahi/ethernauta/tree/main/packages/ens).

### ERC-7683 — cross-chain intents

```ts
import {
  hash_gasless_order, sign_gasless_order,
  build_gasless_order, compute_deadlines, random_nonce,
  address_to_bytes32, strip_hex_zeros,
  open, openFor, resolve, resolveFor,        // origin-settler methods
  fill,                                       // destination-settler method
  GASLESS_PRIMARY_TYPE, GASLESS_CROSS_CHAIN_ORDER_FIELDS,
  make_gasless_order_typed_data,
  type GaslessCrossChainOrder, type OnchainCrossChainOrder,
  type ResolvedCrossChainOrder, type Output, type FillInstruction,
} from "@ethernauta/erc/7683"

const order = build_gasless_order({ /* … */ })
const hash = hash_gasless_order({ order, settler })
const signed = await sign_gasless_order({ order })(signer({ chain_id }))

// Origin chain — open the order
const opened = await open([order, signature, originFillerData])(
  signer({ chain_id, to: ORIGIN_SETTLER }),
)
// Destination chain — fill the order
const filled = await fill([orderId, originData, fillerData])(
  signer({ chain_id: destination_chain_id, to: DESTINATION_SETTLER }),
)
```

### Selector registry

```ts
import { REGISTRY } from "@ethernauta/erc/registry"

// REGISTRY: Record<Bytes4, { signature, names, source }>
//   — every selector for every method shipped by this package.
// The wallet uses this to surface human-readable function names
// for transactions whose call data carries a known selector.
```

Regenerate via `pnpm --filter @ethernauta/erc generate`.
