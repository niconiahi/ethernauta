[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/eth@0.0.10&treeshake=[*])](https://deno.bundlejs.com/badge?q=@ethernauta/eth@0.0.10&treeshake=[*])

## Philosophy

This module aims to be an set of useful utilities to be used within a crypto context:

## Modules

- [abi](https://github.com/niconiahi/ethernauta/blob/main/packages/abi) [NPM](https://www.npmjs.com/package/@ethernauta/abi)
- [chain](https://github.com/niconiahi/ethernauta/blob/main/packages/chain) [NPM](https://www.npmjs.com/package/@ethernauta/chain)
- [cli](https://github.com/niconiahi/ethernauta/blob/main/packages/cli) [NPM](https://www.npmjs.com/package/@ethernauta/cli)
- [erc](https://github.com/niconiahi/ethernauta/blob/main/packages/erc) [NPM](https://www.npmjs.com/package/@ethernauta/erc)
- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth) [NPM](https://www.npmjs.com/package/@ethernauta/eth)
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction) [NPM](https://www.npmjs.com/package/@ethernauta/transaction)
- [utils](https://github.com/niconiahi/ethernauta/blob/main/packages/utils) [NPM](https://www.npmjs.com/package/@ethernauta/utils)
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet) [NPM](https://www.npmjs.com/package/@ethernauta/wallet)

## Table of contents

- [API](#api)

## API

### came-to-kebab

```ts
import { camel_to_kebab } from "@ethernauta/utils";

const input = "helloWorld"
const kebab = camel_to_kebab(input) // hello-world
```

### invariant

```ts
import { invariant } from "@ethernauta/utils";

const input: string | null = "helloWorld"
invariant(typeof input === 'string', "input must be a string")
// input: string
```
