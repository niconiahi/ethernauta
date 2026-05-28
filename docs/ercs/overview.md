---
title: Overview
section: ERCs
section_order: 6
order: 1
---

# ERCs

Token standards and contract-interface standards. Each lives at `@ethernauta/erc/<n>`, with method bindings generated from the canonical ABI. Most are `Callable<T>` reads or `Signable<T>` writes.

```ts
import { transfer, balanceOf } from "@ethernauta/erc/20";
import { tokens_of_owner } from "@ethernauta/erc/721/extensions/enumerable";
import { balanceOfBatch } from "@ethernauta/erc/1155";
```

## What's shipped

| ERC | Title | Purpose |
|---|---|---|
| [20](/ercs/20) | Fungible token | The token. |
| [137](/ercs/137) | ENS — domains | Name registry. |
| [165](/ercs/165) | Standard interface detection | `supportsInterface`. |
| [181](/ercs/181) | Reverse ENS resolution | Address → name. |
| [721](/ercs/721) | Non-fungible token | NFTs. |
| [1155](/ercs/1155) | Multi-token standard | Mixed FT / NFT in one contract. |
| [1577](/ercs/1577) | ENS — content hash | IPFS / Swarm content for ENS names. |
| [2304](/ercs/2304) | ENS — multichain addresses | Non-Ethereum addresses on ENS. |
| [2612](/ercs/2612) | Permit | Gasless ERC-20 approvals. |
| [2981](/ercs/2981) | NFT royalty | Royalty info per NFT. |
| [3156](/ercs/3156) | Flash loans | Borrower / lender interfaces. |
| [4494](/ercs/4494) | Permit for ERC-721 | Gasless NFT approvals. |
| [4626](/ercs/4626) | Tokenized vaults | Yield vaults. |
| [5564](/ercs/5564) | Stealth addresses | One-time receiving addresses. |
| [5805](/ercs/5805) | Voting delegation | Delegation API for governance. |
| [6372](/ercs/6372) | Contract clock | Block- or time-based mode. |
| [7683](/ercs/7683) | Cross-chain orders | Cross-chain intent format. |

## Generation

Almost every method file in this package is **auto-generated** by the CLI from the canonical ABI. The selector registry (`@ethernauta/erc/registry`) is also generated:

```bash
pnpm --filter @ethernauta/erc generate
```

See [Tooling → ERC codegen](/tooling/erc-codegen) for the regeneration flow and [Tooling → Adding a new ERC](/tooling/adding-a-standard) for the manual portion.

## See also

- [@ethernauta/abi](/abi/overview) — codec the generated methods use.
- [@ethernauta/erc/registry](/ercs/registry) — selector → method-name lookup.
