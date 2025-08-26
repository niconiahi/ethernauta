[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/eth@0.0.10&treeshake=[*])](https://deno.bundlejs.com/badge?q=@ethernauta/eth@0.0.10&treeshake=[*])

## What will you find here?

In here you will find many ERC functions ready to be used, either to read the blockchain or to write to it

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [EIPs](https://eips.ethereum.org/all#final)
- [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts)

## Currently supports

- [x] Token Standard ([EIP-20](https://eips.ethereum.org/EIPS/eip-20))
- [x] Standard Interface Detection ([EIP-165](https://eips.ethereum.org/EIPS/eip-165))
- [x] Non-Fungible Token Standard ([EIP-721](https://eips.ethereum.org/EIPS/eip-721))

### Want to see one added?

Please, if this is the case, ask for it in an issue

### Want to generate them yourself?

That said, you can generate your own functions (ready to be used) if you provide a valid ABI in `.json` format. Check the [CLI package](https://github.com/niconiahi/ethernauta/blob/main/packages/cli)

## Modules

- [abi](https://github.com/niconiahi/ethernauta/blob/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/blob/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/blob/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [erc](https://github.com/niconiahi/ethernauta/blob/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [utils](https://github.com/niconiahi/ethernauta/blob/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet)

## Table of contents

1. [API](#api)
2. [core](#core)
5. [method](#method)

## API

### Executing ERC20 method

```ts
import { transfer } from "@ethernauta/erc/20";
import { writer, SEPOLIA_CHAIN_ID } from "./writer";

const writable = transfer([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  number_to_hex(1),
])
const hash = await writable(
  writer(SEPOLIA_CHAIN_ID),
)
```

### Executing ERC721 method

```ts
import { approve } from "@ethernauta/erc/721";
import { writer, SEPOLIA_CHAIN_ID } from "./writer";

const writable = approve([
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
  "57896044618658097711785492504343953926634992332820282019728792003956564819967",
])
const hash = await writable(
  writer(SEPOLIA_CHAIN_ID),
)
```
