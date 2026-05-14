# Changelog

All notable changes to this repository are documented here.
Per-package changelogs live under `packages/*/CHANGELOG.md` and
are produced by the publish pipeline; this file captures the
shape of each release at a higher level.

## [0.0.42] — 2026-05-13

This release introduces the **calldata-decoding pipeline**: dapps
that call ethernauta-generated methods now ship a function-signature
sidecar on the transport envelope, and the wallet's Sign view
renders a decoded view (method name + named arguments) instead of
a wall of hex bytes.

### Added

- **`@ethernauta/abi`**
  - `decode_function_call(input_types, hex)` — slices the 4-byte
    selector off calldata and decodes the remaining args via the
    existing `decode_function_result`. Returns
    `{ selector, args }`.
  - Generator emits `export const SIGNATURE = { signature, names }`
    in every generated method file, colocated with the function.
    The exported `signature` is the canonical form
    (`"transfer(address,uint256)"`); `names` carry the original
    parameter labels from the ABI JSON.
  - Generator now disambiguates **function overloads** by
    appending the 4-byte selector hex as a suffix to both the JS
    identifier and the filename when (and only when) more than
    one function in the same ABI shares a name. ERC-721's two
    `safeTransferFrom` overloads now emit as
    `safeTransferFrom_42842e0e` and `safeTransferFrom_b88d4fde`;
    unique names stay clean. Original `description.name` is
    preserved on the wire (selectors continue to hash the
    canonical form).
  - Generator skips multi-output methods with a `console.warn`
    instead of throwing, so an ABI containing
    `royaltyInfo(uint256,uint256) → (address, uint256)` no longer
    blocks the whole batch. Selector still ends up in the
    registry; only the method file is omitted.

- **`@ethernauta/cli`**
  - Subcommand layout reworked. The old single `generate`
    command is renamed to `abi`, and a sibling `registry`
    command is introduced. The bin file now hand-parses
    `process.argv` and dispatches to `execute_abi` /
    `execute_registry` (the `node:util` `parseArgs` helper was
    dropped — it didn't compose well across subcommands).
  - `ethernauta abi --in <abi-or-artifact.json> --out <dir>` —
    same generator behaviour as before, exposed under the new
    name.
  - `ethernauta registry --in <dir> --out <file>` — walks
    `*.abi.json` recursively, builds canonical signatures,
    computes selectors via `to_selector`, and emits a single
    typed `REGISTRY` map keyed by selector hex with
    `{ name, signature, types, param_names }` entries. Throws on
    selector collisions.

- **`@ethernauta/erc`**
  - New ABI JSONs and generated methods for ERC-20 extensions
    (Burnable, Pausable, Permit/EIP-2612, Wrapper, FlashMint/
    EIP-3156, Capped, Votes, Mintable) and ERC-721 extensions
    (Burnable, Pausable, Royalty/EIP-2981, Votes, Permit/
    EIP-4494).
  - New standards: ERC-4626 (full interface) and ERC-1155
    (single-token methods — batch ops intentionally omitted
    pending array decoder support).
  - `@ethernauta/erc/registry` exports a bundled `REGISTRY`
    auto-generated from every shipped ABI JSON. 63 selectors at
    publish time. Regenerated on `prebuild` via
    `pnpm --filter @ethernauta/erc generate`.

- **`@ethernauta/transport`**
  - `create_reader` / `create_writer` / `create_signer` now
    accept a single **input object** (`{ chain_id, to? }` for
    reader/signer; `{ chain_id }` for writer) instead of a bare
    chain id string. Each returns a resolved tuple
    `[transports, context]` (reader/writer) or
    `[signer, context]` (signer). The `Readable<T>`,
    `Writable<T>`, and `Signable<T>` types were updated to
    destructure this tuple, so every JSON-RPC method downstream
    receives the originating context without a side channel.
    This was the prerequisite for forwarding the function
    sidecar end-to-end.
  - New `FunctionSidecar` type and schema (`signature: string`,
    `names: string[]`).
  - New `SignerContext` type carrying an optional `_function`
    sidecar.
  - `Signer` gains an optional third argument of type
    `SignerContext`; existing two-argument call sites continue to
    work unchanged.
  - `create_signer` reads `context._function` and attaches it to
    the `ETHERNAUTA_REQUEST_SIGN_TRANSACTION` postMessage envelope
    — *outside* the JSON-RPC payload, so the standard transaction
    object stays spec-compliant.

- **`@ethernauta/eth`**
  - `eth_signTransaction` migrated from `Writable<Bytes>` to
    `Signable<Bytes>` — it goes through the connected signer
    instead of broadcasting a JSON-RPC call to transports. This
    reflects what wallets actually do for this method and is
    what lets the function sidecar be attached.
  - `eth_signTransaction(parameters, context?)` accepts an
    optional second curry argument and forwards `context` to the
    underlying `signer(method, params, context)` call. Generated
    method files pass `{ _function: SIGNATURE }` here.
  - `genericTransactionSchema` fields all marked `optional()`,
    matching the execution-apis spec: callers pin only what they
    care about, the wallet / managed-key node fills the rest.

- **`@ethernauta/wallet`**
  - New dedicated **Connect view** (`src/views/connect/`).
    `eth_requestAccounts` no longer reuses the Wallet view —
    it now routes to a purpose-built screen with explicit
    Connect and Reject buttons. The Wallet view is reverted to
    a pure account/balance display.
  - New `TransactionRejectedResponse`
    (`ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED`) message type
    so the connect/sign flows can signal user rejection
    distinctly from a signed-transaction response.
  - Sign view recognises `_function` on the inbound envelope and
    verifies it by re-hashing: `keccak256(signature)[0:4]` must
    match `input[0:4]`. Mismatch silently discards the sidecar
    and falls back.
  - Decoded view promotes the function call to first-class
    rendering: `TO`, optional `VALUE` (hidden when `0x0`),
    `METHOD` (the ABI function name), and `PARAMS` (decoded args
    with names). Raw hex is preserved under a collapsible
    `<details>`.
  - Wallet ships a bundled fallback `REGISTRY` (re-exported from
    `@ethernauta/erc/registry`) so standard ERC-20/721/1155/4626
    calls decode even when no sidecar arrives.
  - Lookup order: `_function` sidecar (verified) → bundled
    `REGISTRY` → raw hex.

- **`@ethernauta/playground`**
  - Local `app/contracts/` directory carrying an example
    `MyContract.abi.json` plus a generated `mint(string)`
    method, used to exercise the sidecar flow end-to-end from a
    real dapp surface.
  - Home route gains a "Sign mint(string) — sidecar demo"
    button that calls the generated method and routes the call
    through the wallet so the decoded view can be inspected.
  - Existing send-transfer call site migrated to the new
    `writer({ chain_id })` / `signer({ chain_id })` input-object
    shape and to `eth_signTransaction(...)( signer(...) )`
    instead of calling the bare signer.

### Changed

- All published packages bumped from `0.0.41` to `0.0.42`.
- Root `build` script switched from a narrow filter to
  `pnpm --recursive --filter '!@ethernauta/wallet' --filter
  '!@ethernauta/playground' --filter '!@ethernauta/testing' run
  build` so the package set built matches the package set
  published. Previously, `@ethernauta/eip`, `@ethernauta/erc`,
  and `@ethernauta/cli` were not being rebuilt before publish.
- `pnpm-workspace.yaml`: removed `sharp` from
  `onlyBuiltDependencies` (its postinstall fallback fails on
  source build; the platform-specific prebuilt binary is
  installed regardless).
- Generator's barrel writer emits explicit named re-exports
  (`export { transfer } from "./transfer"`) instead of
  `export *`. Surface duplicate-name conflicts visibly rather
  than silently re-exporting the same symbol.

### Fixed

- `@ethernauta/wallet`'s Sign view no longer truncates field
  values with `…` — the highest-trust UI now shows full
  arguments without elision.
- `decode.ts` previously rejected calldata shorter than 4 bytes
  by index error; now throws a clear `calldata too short`
  message via `decode_function_call`.

### Deferred

- Array (`T[]`) and tuple (`(T,U)`) decode support in
  `@ethernauta/abi`. Tracked separately; unblocks ERC-1155 batch
  ops and Multicall. See plan notes for the migration shape.
- Sidecar metadata for *user-generated* registries pushed to the
  wallet at runtime (currently each ethernauta-generated method
  attaches its own `SIGNATURE`; aggregating into a runtime-fetched
  registry is future work).

### Example

For an animatronik mint call, the dapp's generated `mint(string)`
method attaches its `SIGNATURE` to the transport envelope.
The wallet receives:

```
{ _function: { signature: "mint(string)", names: ["data"] } }
```

verifies `keccak256("mint(string)")[0:4] === 0xd85d3d27`, decodes
the args against `["string"]`, and renders:

```
TO       0x0B47…FED52
METHOD   mint
PARAMS
  data   <decoded string>
▶ raw
```

No JSON-RPC pollution; the inner transaction object is
spec-compliant.
