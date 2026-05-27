---
title: Views
section: Wallet
section_order: 8
order: 3
---

# Views

Every confirmation view in `packages/wallet/src/views/`. Each entry documents what triggers the view, what the user sees, and what the view returns to the dispatcher.

## `connect`

**Trigger:** `eth_requestAccounts` (EIP-1102), `wallet_requestPermissions` (EIP-2255) for `eth_accounts`.

**Shows:** A list of accounts in the user's vault. Origin URL. Permission scope being requested.

**Returns:** Array of selected addresses. Persists an EIP-2255 permission record so subsequent `eth_accounts` calls return immediately without re-prompting.

## `select-account`

**Trigger:** Account picker — invoked when the dapp has multiple accounts available and wants the user to choose between them.

**Shows:** Account list with balance and name.

**Returns:** The chosen address.

## `select-chain`

**Trigger:** `wallet_switchEthereumChain` (EIP-3326) on first switch to a chain.

**Shows:** Source chain → target chain. Confirmation prompt.

**Returns:** `null` on accept, error 4001 on reject.

Subsequent switches to the same chain don't prompt — the prior approval is remembered.

## `add-chain`

**Trigger:** `wallet_addEthereumChain` (EIP-3085).

**Shows:** Proposed chain definition — name, ID, RPC URL, native currency, explorer URL. Warns if the chain ID conflicts with a known chain in `@ethernauta/chain`.

**Returns:** `null` on accept. Persists the chain definition for future switches.

## `send`

**Trigger:** `eth_sendTransaction` (path 1) or `eth_signTransaction` (path 2).

**Shows:** From / to / value / data preview. Decoded method call if the selector matches `@ethernauta/erc/registry`. Estimated gas cost in native units.

**Wallet fills in:** `nonce`, `gas`, `maxFeePerGas`, `maxPriorityFeePerGas`. The dapp **never** sets these (hard rule 5 in CLAUDE.md).

**Returns:**
- Path 1 (`eth_sendTransaction`): broadcast hash.
- Path 2 (`eth_signTransaction`): signed bytes.

## `personal-sign`

**Trigger:** `personal_sign` (EIP-191).

**Shows:** The message text (UTF-8 decoded). Highlights ASCII vs binary content. Includes a warning if the message is unusually long or contains suspicious patterns.

**Returns:** 65-byte ECDSA signature.

## `sign-typed-data`

**Trigger:** `eth_signTypedData_v4` (EIP-712).

**Shows:** Domain breakdown (name, version, chain ID, verifying contract). Field-by-field typed payload, recursively expanded. Warns when the domain's `chainId` doesn't match the active chain.

**Returns:** 65-byte ECDSA signature.

## `sign` (legacy)

**Trigger:** `eth_sign` — gated behind explicit user opt-in.

**Shows:** Raw bytes being signed, with a **prominent warning** that `eth_sign` permits arbitrary digest signing (including transaction digests) — the user is signing a 32-byte hash without knowing what it represents.

**Returns:** Signature, or error if the user hasn't opted in to legacy signing.

The Ethernauta wallet ships with `eth_sign` off by default. Dapps that need it must instruct the user to enable it in settings.

## `send-calls`

**Trigger:** `wallet_sendCalls` (EIP-5792).

**Shows:** The batch as a numbered list of `(to, value, data)` items. Each item's data is decoded against `@ethernauta/erc/registry` to surface the method name (`transfer`, `approve`, `permit`, …) if known. The user sees the **execution strategy** the wallet has chosen (multicall, EIP-7702 set-code, smart-account UserOp) so they know what's actually happening.

**Returns:** Batch ID for `wallet_getCallsStatus` polling.

## `authorize-delegation`

**Trigger:** `wallet_sendSetCodeTransaction` (EIP-7702) or `wallet_signAuthorization`.

**Shows:** The delegate contract address. Whether this is **first-time delegation** (the EOA's code becomes the delegate's) or a **clear** (delegate is zero). Source code link if the delegate is on a known explorer. Chain ID. Nonce.

This is the highest-stakes view in the wallet — a set-code authorization is functionally equivalent to giving the delegate full control of the EOA. The view treats it as such with explicit warnings.

**Returns:** Signed authorization or broadcast hash, depending on the calling method.

## `mnemonics`

**Trigger:** First-run / vault management UI. Not RPC-triggered.

**Shows:** Mnemonic generation (24-word BIP-39) or import. Password setup for vault encryption.

**Returns:** Sets up the vault. Mnemonic never leaves this view.

## `password`

**Trigger:** Vault unlock prompt — shown whenever the wallet has been idle past the unlock timeout.

**Shows:** Password field. No "remember me" — the unlock window is bounded.

**Returns:** Unlocks the vault for the current session.

## `wallet` (frame)

**Trigger:** Wallet UI entrypoint. Not RPC-triggered.

**Shows:** Account list, balance, recent transactions, settings.

This is the popup's home view when opened from the toolbar icon.

## See also

- [Dispatch](/wallet/dispatch) — which methods trigger which view.
- [Vault](/wallet/vault) — how the mnemonic is stored.
