[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/eth@0.0.10&treeshake=[*])](https://deno.bundlejs.com/badge?q=@ethernauta/eth@0.0.10&treeshake=[*])

## Philosophy

This module aims to be an un-opinionated representation of the defined:

- [abi-spec](https://docs.soliditylang.org/en/latest/abi-spec.html)

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

## API

### Generate ABI functions with CLI

```bash
npx ethernauta generate --abi abis/IERC20.abi.json --out app
```
