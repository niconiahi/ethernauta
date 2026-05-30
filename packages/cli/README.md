[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/cli&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/cli&treeshake=[*])

## Philosophy

This module ships a CLI for working with ABIs in an Ethernauta codebase. Two subcommands:

- `ethernauta abi` — generate ready-to-use TypeScript methods from an ABI JSON, a Foundry artifact, or a Solidity source (`.abi`). With no flags it walks `packages/**/*.abi.json` and `packages/**/*.abi` and regenerates `methods/` next to each ABI source.
- `ethernauta registry` — walk a directory of ABI JSONs and emit a 4-byte selector → method-metadata map (used by the wallet to surface human-readable function names)

## Prerequisites

- **Node 20+** — runtime for the CLI itself.
- **Foundry's `forge`** — required when the walker encounters a `.abi` (Solidity) source, since the ABI is extracted inline via `forge inspect <path>:<Contract> abi`. Install:

  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```

  Not required when only `.abi.json` files are walked.

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

### `ethernauta abi`

Regenerate contract method TypeScript files. Two modes:

#### Walker mode (no flags)

```bash
npx ethernauta abi
```

Discovers every `packages/**/*.abi.json` and `packages/**/*.abi` under the workspace root (the directory holding `pnpm-workspace.yaml`), skipping `node_modules`, `dist`, and `.git`. One ABI per folder is required; multiple ABIs in the same folder is an error. `methods/` is fully overwritten next to each ABI source. For `.abi` files (Solidity sources) the walker invokes `forge inspect <path>:<ContractName> abi` — the contract name must match the filename.

This is the common case in the Ethernauta monorepo. A repo-level `regen` script chains it with a Biome format pass to keep generated files canonical.

#### Single-file mode

```bash
npx ethernauta abi --in abis/IERC20.abi.json --out app/methods
```

Each function in the ABI emits one file under `<out>/methods/`. View / pure functions emit `Callable<T>`; state-changing functions emit `Signable<Bytes>`. A barrel file at `<out>/methods/index.ts` re-exports everything. Use this form when consuming the CLI from outside the monorepo, or for one-off regeneration of a single contract.

A typical setup wires this into a `package.json` script so generated methods stay in sync with the contract:

```json
{
  "scripts": {
    "regen:methods": "ethernauta abi --in contracts/out/MyContract.sol/MyContract.json --out app/generated/my-contract"
  }
}
```

Flags:

| Flag    | Description                                                                  |
| ------- | ---------------------------------------------------------------------------- |
| `--in`  | Path to a raw ABI JSON array **or** a Foundry artifact with an `abi` field   |
| `--out` | Output directory; the generator writes `<out>/methods/*.ts` + a barrel file  |

### `ethernauta registry`

Walk a directory for `*.abi.json` files and emit a single `REGISTRY` mapping 4-byte selectors to method metadata.

```bash
npx ethernauta registry --in src --out src/registry/registry.generated.ts
```

The registry is used by the wallet to verify and display function names for transactions whose call data carries an unknown selector.

Flags:

| Flag    | Description                                                       |
| ------- | ----------------------------------------------------------------- |
| `--in`  | Directory walked recursively for `*.abi.json` files               |
| `--out` | Output file path for the generated `REGISTRY` TypeScript module   |
