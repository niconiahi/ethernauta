---
name: erc
description: Guidelines for adding a new Ethereum Request for Comment standard under packages/erc. Read this before introducing a new ERC-<n>/ folder, generating method bindings, or wiring an extension. Differs from the eip skill — ERCs are mostly token-contract standards with ABI-bound method generation.
---

# Adding an ERC — @ethernauta/erc

`@ethernauta/erc` ships **method bindings** for ERC token-contract standards (ERC-20, ERC-165, ERC-721, ERC-1155, ERC-4626, …) and adjacent contract-shaped standards (ENS / ERC-137 lives here). Every binding is generated from the standard's reference ABI and resolves into either a `Callable<T>` (view / pure) or a `Signable<Bytes>` (state-changing).

Subpath publishing: `packages/erc/package.json:14-19` declares `"./*": "./dist/*/index.js"`, so `packages/erc/src/<n>/` automatically becomes importable as `@ethernauta/erc/<n>` after build.

Currently shipped: `20` (with extensions `burnable`, `capped`, `flash-mint`, `mintable`, `pausable`, `permit`, `votes`, `wrapper`), `137` (ENS), `165`, `721` (with extensions), `1155`, `4626`, `5564`, `7683`.

## Folder shape

Each ERC follows the same shape. ERC-20 is the canonical template; ERC-165 is the minimal one.

```
packages/erc/src/<n>/
  index.ts                      # public surface — usually `export * from "./methods"`
  IERC<n>.sol                   # reference Solidity source (commented header notes upstream)
  IERC<n>.abi.json              # canonical ABI from the standard
  <n>.test.ts                   # behavioral test against the binding
  methods/
    index.ts                    # re-exports all generated methods
    <method-name>.ts            # one method per file (camelCase identifier, kebab-case filename)
  extensions/                   # OPTIONAL — for standards with optional extensions (ERC-20, ERC-721)
    <extension>/
      IERC<n><Extension>.abi.json
      methods/
        index.ts
        <method-name>.ts
```

Rules:

- **One generated method per file.** Tree-shaking gates on file granularity. `transfer.ts`, `balance-of.ts`, `total-supply.ts` are separate files.
- **Filenames in kebab-case, identifiers in camelCase.** `balance-of.ts` exports `balanceOf` — because the on-wire name in the ABI is `balanceOf`, and ABI casing is preserved in the public binding so signatures stay matchable.
- **The constant `<METHOD>_SIGNATURE`.** Every method file exports a sidecar `{ signature, names }` constant (see `balance-of.ts:24-30`, `transfer.ts:22-28`). The wallet uses these to render a human-readable confirmation: `keccak(signature)[0:4]` must equal `input[0:4]`.
- **Tests co-located.** Vitest picks up `packages/erc/src/<n>/<n>.test.ts`.

## `index.ts` — the public surface

For ERCs whose entire public API is the generated method list, the convention is one line:

```ts
// packages/erc/src/20/index.ts
export * from "./methods"
export * from "./extensions/burnable/methods"
export * from "./extensions/permit/methods"
// ...
```

For ERCs with additional helpers (ENS, where forward/reverse resolution is not a single method call), curate the exports — see `packages/erc/src/137/index.ts` for the pattern. Helpers exported from `index.ts` include `namehash`, `normalize`, `parse_avatar`, `get_ens_address`, `get_ens_name`, `get_ens_avatar`, `get_ens_text`, `get_ens_resolver`, `ENS_REGISTRY`, `get_registry_address`, `ZERO_ADDRESS`.

## The two method shapes

Every generated method is one of:

### View / pure — `Callable<T>`

Calldata-producer with a decoder. Resolved via `contract({ chain_id, to })`. Pattern from `packages/erc/src/20/methods/balance-of.ts:38-64`:

```ts
export function balanceOf(
  _parameters: Parameters,
): (_context: ContractContext) => Callable<Uint256> {
  return (_context: ContractContext): Callable<Uint256> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters : [parameters.account]
    const calldata = encode_function_call({
      name: "balanceOf",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): Uint256 => {
        const [decoded] = decode_function_result(OUTPUT_CODECS, _result)
        return parse(Uint256Schema, decoded)
      },
    }
  }
}
```

Note the double-curry shape `(parameters) => (context) => Callable`. The decoder is part of the `Callable` object so `eth_call` consumers don't need to know the output type.

### State-changing — `Signable<Bytes>`

Encodes calldata, calls `eth_signTransaction` with `{ to, value, input, _ethernauta: { function: SIGNATURE } }`, resolved via `signer({ chain_id, to })`. Pattern from `packages/erc/src/20/methods/transfer.ts:36-71`:

```ts
export function transfer(
  _parameters: Parameters,
): Signable<Bytes> {
  return async ([signer, _context]: ResolvedSigner): Promise<Bytes> => {
    if (!_context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters : [parameters.to, parameters.value]
    const calldata = encode_function_call({
      name: "transfer",
      args: PARAM_CODECS,
      values: values as never,
    })
    return eth_signTransaction([{
      to: _context.to,
      value: "0x0",
      input: bytes_to_hex(calldata),
      _ethernauta: { function: TRANSFER_SIGNATURE },
    }])([signer, _context])
  }
}
```

The wallet uses the `_ethernauta.function` sidecar to render a human-readable approval. **Always include it** — without it, the wallet shows raw calldata. Without it, the binding is incomplete.

> Do not set `nonce`, `gas`, `maxFeePerGas`, `maxPriorityFeePerGas`. The wallet fills them from `eth_getTransactionCount` + `eth_estimateGas` + `eth_feeHistory`. The contract with the wallet is: generator emits `to`, `value`, `input`, `_ethernauta`. Wallet does the rest. The comment in `transfer.ts:56-59` is the canonical reminder.

## Schemas — the project-wide convention

Same as everywhere else in the workspace: schema first, type via `InferOutput`, `parse` at entry. Read `skills/conventions/SKILL.md`.

The recurring shape for parameterized methods is a `union(tuple, object)` — see `packages/erc/src/20/methods/transfer.ts:30-34` and `packages/erc/src/137/methods/addr.ts:36-40`:

```ts
const ParametersSchema = union([
  tuple([AddressSchema, Uint256Schema]),
  object({ to: AddressSchema, value: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
```

This is what gives `@ethernauta/erc` consumers the freedom to call `transfer(["0x...", value])` or `transfer({ to: "0x...", value })` interchangeably. **Match this exactly in every new method file** — anything else is a regression in the public API.

## The selector registry

`packages/erc/src/registry/registry.generated.ts` is an auto-generated map from 4-byte selector → `{ name, signature, types, param_names }`. It is produced by `pnpm --filter @ethernauta/erc generate`, which runs the CLI command declared in `packages/erc/package.json:26`:

```
ethernauta registry --in src --out src/registry/registry.generated.ts
```

The script walks `packages/erc/src/**` for `<METHOD>_SIGNATURE` exports and rebuilds the registry. It runs automatically before `build` via the `prebuild` hook.

**Do not hand-edit `registry.generated.ts`.** When you add a new method file with a `<METHOD>_SIGNATURE` constant, regenerate. The wallet uses this registry to look up unknown selectors when rendering confirmations.

## Step-by-step — adding `erc-<n>`

1. **Get the canonical ABI.** Copy `IERC<n>.abi.json` from the OpenZeppelin reference implementation or the EIP itself. Place at `packages/erc/src/<n>/IERC<n>.abi.json`. Copy the Solidity reference as `IERC<n>.sol` for documentation.
2. **Generate the bindings.** The CLI command is in `packages/cli/`. Either run codegen or, for small ABIs, hand-write the method files following the template in `packages/erc/src/20/methods/`. Each method must:
   - Export the function (`camelCase`, matching the ABI).
   - Export the `<METHOD>_SIGNATURE` constant.
   - Declare a `ParametersSchema` as `union(tuple, object)` if the method takes args.
   - Use `encode_function_call` from `@ethernauta/abi` for input encoding.
   - Use `decode_function_result` from `@ethernauta/abi` for output decoding.
   - Return either `(context) => Callable<T>` (view/pure) or `Signable<Bytes>` (state-changing).
3. **Wire `methods/index.ts`** with `export * from "./<method>"` for each new method.
4. **Wire `<n>/index.ts`** with `export * from "./methods"` (plus any helpers).
5. **Write `<n>.test.ts`.** Behavioral tests — typically: build calldata for a known input, assert against the expected hex; for `Callable`, also call `decode` against a known result.
6. **Regenerate the registry.** `pnpm --filter @ethernauta/erc generate`.
7. **Update `packages/erc/README.md`** — add the ERC to the "Currently supports" list with a checkbox and link.
8. **Verify the build.** `pnpm --filter @ethernauta/erc build`. Confirm `dist/<n>/index.js` and `dist/<n>/methods/<method>.js` exist.

### Adding an extension to an existing ERC

ERC-20 and ERC-721 have optional extension sets (e.g. ERC-20 Permit, ERC-20 Votes, ERC-721 Enumerable).

```
packages/erc/src/20/extensions/<extension>/
  IERC20<Extension>.abi.json
  methods/
    index.ts
    <method>.ts
```

Then re-export from `packages/erc/src/20/index.ts`:

```ts
export * from "./extensions/<extension>/methods"
```

## Cross-package imports — what you can and cannot import

Permitted:

- `@ethernauta/core` — primitive schemas.
- `@ethernauta/abi` — `encode_function_call`, `decode_function_result`, codec helpers (`address`, `uint256`, `bytes32`, etc.).
- `@ethernauta/eip/<n>` — only when the ERC builds on an EIP (e.g. an ERC-20 permit binding might import the EIP-712 schemas).
- `@ethernauta/ens` — only inside `erc/137`.
- `@ethernauta/eth` — `eth_signTransaction`, `eth_call`. Required for `Signable` methods.
- `@ethernauta/transport` — `Callable`, `Signable`, `ContractContext`, `ResolvedSigner`, etc.
- `@ethernauta/utils` — pure helpers.
- `valibot`, `@noble/hashes`, `@noble/secp256k1`.

Forbidden:

- `@ethernauta/wallet` — wallet is a consumer.
- DOM-only globals — these run in the wallet popup, the service worker, and dapp code.

## Note on filename casing

Most ERC method files are kebab-case (`balance-of.ts`, `transfer-from.ts`), and the exports are camelCase to match the ABI (`balanceOf`, `transferFrom`). This is the project rule — **do not deviate**. Some legacy ENS resolver files (`addr.ts`, `name.ts`, `text.ts`, `resolver.ts`) are short and single-word; same rule applies (filename matches identifier when it's already lower-only).
