## Philosophy

This module is the Chrome extension that signs Ethernauta transactions. The wallet is only in charge of **signing** — broadcasting is delegated to the consumer (via `eth_sendRawTransaction` through a writer). This separation makes the wallet a generic signing surface that any chain or any dApp can use, without imposing a transport stack on it.

## Install

Add to Chrome from the [Chrome Web Store listing](https://chromewebstore.google.com/detail/ethernauta/lpjalkakmdgkepcogmaoipjjeahnpdjp).

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## Security model

The wallet stores the mnemonic encrypted in IndexedDB:

1. The user's password is fed into PBKDF2 (SHA-256, 100 000 iterations) with a random salt to derive an encryption key
2. The mnemonic is encrypted with AES-GCM (authenticated encryption) using a random IV
3. Only `{ salt, iv, cipher }` is persisted

Keys never leave the extension. Signing happens in the popup process; the consumer only ever sees the signed raw transaction.

Sessions time out after 5 minutes of inactivity — after that, the user has to re-enter their password before any signing happens.

## Views

The popup routes between five views:

- `password` — initial unlock prompt (when a vault exists)
- `mnemonics` — first-time setup, generates and confirms a new mnemonic
- `wallet` — main interface (account, balance, chain)
- `connect` — approve a dApp connection request (`eth_requestAccounts`)
- `sign` — approve a transaction signing request, showing the decoded function name and parameters when a `FunctionSidecar` is supplied

## Wire protocol

The wallet communicates with consumers over `window.postMessage`. The flow is:

```
dApp page  →  content script  →  background service worker  →  popup
                                                              ↓
dApp page  ←  content script  ←  background service worker  ←  popup
```

Requests use a tagged envelope. Today there is one request type:

```ts
type SignTransactionRequest = {
  id: string
  type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION"
  method: string                // "eth_requestAccounts" | "eth_signTransaction" | …
  chainId: string               // CAIP-2 chain id
  params?: unknown[] | Record<string, unknown>
  _function?: FunctionSidecar
}
```

The wallet replies with one of three responses:

- `ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION` — `{ id, signed_transaction }`
- `ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED` — user clicked reject (consumer sees error code `4001`)
- `ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE` — popup was closed without a decision (also surfaces as `4001`)

Consumers don't write to this protocol directly — `create_signer` in `@ethernauta/transport` wraps the `postMessage` plumbing behind the `Signable<T>` interface.

## `FunctionSidecar`

The wallet renders the decoded function name and parameter names when a `Signable` method passes a `FunctionSidecar` alongside the JSON-RPC request:

```ts
type FunctionSidecar = {
  signature: string   // e.g. "transfer(address,uint256)"
  names: string[]     // e.g. ["to", "value"]
}
```

The wallet **verifies** `keccak256(signature)[0:4] === input[0:4]` before showing anything. `names` is display-only — the wallet never trusts it for authorization decisions. If the keccak check fails, the sidecar is dropped and the wallet falls back to displaying the raw call data.

## Files to pay attention

- [controller.tsx](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/src/controller.tsx) — popup entry, message handling, view routing
- [utils/vault.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/src/utils/vault.ts) — encrypted mnemonic storage
- [utils/crypto.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/src/utils/crypto.ts) — mnemonic → seed → key → address
- [utils/sign-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/src/utils/sign-transaction.ts) — EIP-1559 transaction signing
- [utils/authentication.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/src/utils/authentication.ts) — 5-minute session timeout
- [utils/event.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/src/utils/event.ts) — request / response envelope schemas
- [manifest/extension.entry.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/manifest/extension.entry.ts) — background service worker
- [public/manifest.json](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/public/manifest.json) — Chrome extension manifest v3
