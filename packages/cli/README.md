[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/cli&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/cli&treeshake=[*])

## Philosophy

This module ships a CLI for working with ABIs in an Ethernauta codebase. Two subcommands:

- `ethernauta abi` — generate ready-to-use TypeScript methods from an ABI JSON or a Foundry artifact
- `ethernauta registry` — walk a directory of ABI JSONs and emit a 4-byte selector → method-metadata map (used by the wallet to surface human-readable function names)

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

### `ethernauta abi`

Regenerate contract method TypeScript files from an ABI JSON or a Foundry artifact.

```bash
npx ethernauta abi --in abis/IERC20.abi.json --out app/methods
```

Each function in the ABI emits one file under `<out>/methods/`. View / pure functions emit `Callable<T>`; state-changing functions emit `Signable<Bytes>`. A barrel file at `<out>/methods/index.ts` re-exports everything.

A typical setup wires this into a `package.json` script so generated methods stay in sync with the contract:

```json
{
  "scripts": {
    "regen:methods": "ethernauta abi --in contracts/out/MyContract.sol/MyContract.json --out app/generated/my-contract"
  }
}
```

### `ethernauta registry`

Walk a directory for `*.abi.json` files and emit a single `REGISTRY` mapping 4-byte selectors to method metadata.

```bash
npx ethernauta registry --in src --out src/registry/registry.generated.ts
```

The registry is used by the wallet to verify and display function names for transactions whose call data carries an unknown selector.
