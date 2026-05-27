---
title: Vault
section: Wallet
section_order: 8
order: 4
---

# Vault

How the wallet's secrets are stored and accessed. Three rules, two boundaries, one storage layer.

## The three rules

1. **The mnemonic is the only secret.** Private keys are derived from it via BIP-32/39/44 on demand. The vault stores the encrypted mnemonic, nothing else.
2. **The mnemonic never leaves the popup process.** Not over `postMessage`, not over `chrome.runtime`, not into any log. (Hard rule 10 in CLAUDE.md.)
3. **No key cache.** Private keys are derived per signing operation and never held in long-lived memory.

## Storage

The encrypted mnemonic lives in IndexedDB inside the extension's origin. Encryption: AES-GCM with a key derived from the user's password via PBKDF2 (high iteration count, per-vault salt).

On unlock:

1. User enters their password.
2. PBKDF2 derives the symmetric key.
3. AES-GCM decrypts the mnemonic.
4. The plaintext mnemonic lives in popup-process memory for the duration of the unlock window.
5. When the wallet locks (idle timeout or explicit lock), the plaintext is wiped.

## Two boundaries

```
                  popup process            background service worker
                  ─────────────            ─────────────────────────
  IndexedDB
  (encrypted blob)  ◄── read on unlock
                        │
                        ▼
                  mnemonic (plaintext)
                        │
                        ▼ derive on demand
                  private key (ephemeral)
                        │
                        ▼ sign
                  signature ─────────────►  envelope.response
                                                   │
                                                   ▼
                                            dapp via 1193
```

The arrow that crosses the process boundary carries only signatures or signed bytes — never the mnemonic, never a derived key.

## Derivation

Default account path: BIP-44 `m/44'/60'/0'/0/0` (the standard Ethereum derivation). Additional accounts increment the final index: `m/44'/60'/0'/0/1`, `m/44'/60'/0'/0/2`, etc.

The wallet stores the **next-derivation index** in IndexedDB alongside the encrypted mnemonic, so the user's account list survives reloads even though private keys don't.

## Locking

The vault locks under three triggers:

- **Idle timeout** (configurable, default 5 minutes since last user interaction).
- **Explicit lock** (the `wallet` view's lock button).
- **Browser close** — IndexedDB persists, but in-memory plaintext is gone with the popup process.

After lock, every tier-3 method triggers the `password` view before proceeding.

## Multi-account

The vault supports multiple BIP-44 indices on the same mnemonic. The `select-account` view lists them all. Account labels (user-set names like "Trading", "Cold") are stored alongside the index in IndexedDB. Labels are not secret and not encrypted.

## Import

Importing a 12- or 24-word mnemonic happens in the `mnemonics` view. The mnemonic is validated against BIP-39 wordlist + checksum before being accepted and encrypted.

## Recovery

The wallet has no recovery mechanism — losing the mnemonic and the password means losing the accounts. Users are prompted to back up the mnemonic during the `mnemonics` view's generate flow with an explicit "I have written this down" confirmation step.

## What's NOT in the vault

- **Private keys.** Derived on demand.
- **Transaction history.** Read from chain via tier 2.
- **Token lists.** Read from chain via tier 2.
- **Permissions.** Stored separately in extension storage, plaintext (they don't compromise the vault if leaked).
- **Active chain.** Stored separately, plaintext.

Keeping the vault to just the encrypted mnemonic minimizes the audit surface for "what could go wrong with the secrets layer."

## See also

- [@ethernauta/crypto → key derivation](/crypto/overview) — the BIP-32/39/44 primitives.
- [Views → mnemonics](/wallet/views) — the import / generate flow.
- [Views → password](/wallet/views) — the unlock flow.
