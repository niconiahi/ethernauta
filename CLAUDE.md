# CLAUDE.md

This file provides comprehensive guidance to Claude Code when working with the Ethernauta codebase.

## Project Overview

**Ethernauta** is a secure cryptocurrency wallet Chrome extension built with modern web technologies. The project focuses on:
- Secure wallet creation from mnemonic phrases with password protection
- Encrypted mnemonic storage using IndexedDB with AES-GCM encryption
- EIP-1559 transaction signing for Ethereum-compatible networks
- Clean, minimal UI built with Preact
- Extensible monorepo architecture supporting multiple blockchain networks

## Architecture & Structure

### Monorepo Organization
Ethernauta is organized as a pnpm workspace monorepo with the following packages:

```
packages/
├── wallet/          # Main Chrome extension (private)
├── transport/       # Blockchain communication layer (published)
├── chain/          # Chain definitions and utilities (published)
├── eth/            # Ethereum-specific functionality (published)
└── transaction/    # Transaction management utilities (published)

examples/
└── playground/     # React Router development environment
```

### Core Packages

#### @ethernauta/wallet (`packages/wallet/`)
The main Chrome extension package containing:

**Architecture Files:**
- `src/controller.tsx:16-76` - Main controller with message handling and view routing
- `src/utils/view.ts:1-5` - Simple signal-based view state management
- `manifest/extension.entry.ts:13-67` - Background script for Chrome extension messaging
- `public/manifest.json:1-28` - Chrome extension manifest v3 configuration

**Security & Crypto Files:**
- `src/utils/vault.ts:1-242` - Secure mnemonic storage with IndexedDB + AES-GCM encryption
- `src/utils/crypto.ts:1-70` - Cryptographic operations (mnemonic → seed → keys → addresses)
- `src/utils/authentication.ts:1-42` - Authentication flow with 5-minute session timeout
- `src/utils/sign-transaction.ts:1-310` - EIP-1559 transaction signing with ECDSA

**Views:**
- `src/views/mnemonics/` - Initial wallet setup with mnemonic generation
- `src/views/password/` - Password entry for vault unlock
- `src/views/wallet/` - Main wallet interface
- `src/views/sign/` - Transaction signing interface

#### @ethernauta/transport (`packages/transport/`)
Blockchain communication layer providing:
- JSON-RPC client implementation with HTTP transport
- Transaction management and monitoring utilities
- Chain ID encoding/decoding (CAIP-2, CAIP-10, CAIP-19 standards)
- Reader/Writer pattern for blockchain operations

#### @ethernauta/chain (`packages/chain/`)
Comprehensive chain definitions including:
- 500+ EIP-155 chain configurations (located in `src/chain/eip155/`)
- Ethereum mainnet, Polygon, BSC, L2s, testnets support
- Chain indexer for automatic updates via `scripts/indexer.ts:26`
- CAIP standard implementations

#### @ethernauta/eth (`packages/eth/`)
Ethereum-specific functionality:
- ABI encoding/decoding for functions, events, and errors
- Block, transaction, and receipt utilities
- Method implementations for common operations
- Fee market (EIP-1559) support

#### @ethernauta/transaction (`packages/transaction/`)
Transaction management utilities:
- Transaction state management
- Transaction watching and monitoring
- Type definitions for transaction operations

#### @ethernauta/playground (`examples/playground/`)
Development testing environment:
- React Router 7.7.1 application
- Cloudflare Pages deployment configuration
- Integration examples and testing utilities

## Technology Stack

### Frontend & State Management
- **Preact 10.26.9** - Lightweight React alternative for extension UI
- **@preact/signals 2.2.1** - Reactive state management (simple signal-based approach)
- **Valibot 1.1.0** - Schema validation for forms and API data across all packages

### Cryptography & Security
- **@noble/hashes 1.8.0** - Cryptographic hash functions (Keccak-256, SHA-256)
- **@noble/secp256k1 2.3.0** - Elliptic curve cryptography for key operations
- **@scure/bip39 1.6.0** - BIP39 mnemonic phrase generation and validation
- **@scure/bip32 1.7.0** - HD key derivation (BIP32/BIP44)
- **PBKDF2** (100,000 iterations) for password-based key derivation
- **AES-GCM** for authenticated encryption in IndexedDB storage

### Build & Development Tools
- **Vite 7.0.5** - Build tool with HMR for development
- **Biome 2.1.1** - Fast linter and formatter
- **Vitest 3.2.4** - Unit testing framework with edge-runtime environment
- **TypeScript 5.8.3** - Type safety across all packages
- **tsdown 0.13.3** - TypeScript bundler for published packages
- **pnpm** - Package manager with workspace support

## Development Workflow

### State Management Pattern
The extension uses a simple, signal-based architecture:

```typescript
// packages/wallet/src/utils/view.ts:3-4
export const INITIAL_VIEW = "password"
export const view = signal(INITIAL_VIEW)
```

### View Navigation Flow
1. **"password"** - Initial view for vault unlock
2. **"mnemonics"** - New wallet setup (if no vault exists)
3. **"wallet"** - Main wallet interface (after authentication)
4. **"sign"** - Transaction signing interface

### Extension Communication Flow
```
Content Script → Background Script → Popup
```

**Message Types:**
- `ETHERNAUTA_REQUEST_CONNECT` - Wallet connection request
- `ETHERNAUTA_REQUEST_SIGN_TRANSACTION` - Transaction signing request
- `ETHERNAUTA_RESPONSE_*` - Response messages back to content script

### Authentication System
Authentication is managed via `packages/wallet/src/utils/authentication.ts:20-32`:
- 5-minute session timeout
- Timestamp-based authentication checks
- Automatic vault validation and view routing

## Security Implementation

### Secure Storage (packages/wallet/src/utils/vault.ts)
The vault system provides encrypted mnemonic storage:

**Encryption Process:**
1. User password + random salt → PBKDF2 (100,000 iterations) → encryption key
2. Mnemonic + random IV → AES-GCM encryption → encrypted cipher
3. Store: `{salt, iv, cipher}` in IndexedDB (`ethernauta/signer` database)

**Security Features:**
- Password-based key derivation (PBKDF2 with SHA-256)
- Authenticated encryption (AES-GCM)
- Secure random number generation for salts and IVs
- Base64 encoding for storage serialization

### Cryptographic Operations (packages/wallet/src/utils/crypto.ts)
- **Mnemonic Validation:** BIP39 wordlist validation with English wordlist
- **Seed Generation:** `mnemonicToSeedSync` for deterministic seed creation
- **Key Derivation:** HD key derivation using path `m/44'/60'/0'/0/0`
- **Address Generation:** Keccak-256 hash of public key for Ethereum addresses

### Transaction Signing (packages/wallet/src/utils/sign-transaction.ts)
- **EIP-1559 Support:** Type 2 transactions with dynamic fees
- **ECDSA Signing:** secp256k1 signatures with recovery
- **Chain ID:** Sepolia testnet (chain ID 11155111) by default
- **RLP Encoding:** Custom implementation for transaction serialization

## Build Configuration

### TypeScript Configuration
- **Root tsconfig:** Extends `@total-typescript/tsconfig/tsc/dom/library`
- **Path Aliases:** Configured for `@ethernauta/*` packages
- **JSX:** Configured for Preact with `react-jsx` transform
- **Types:** Includes Vitest globals and Chrome extension APIs

### Vite Build Configuration
**Extension Build** (`packages/wallet/vite.extension.config.ts`):
- Preact preset with tsconfig paths
- ES modules output format
- Manual chunking for vendor libraries
- Watch mode support for development

**Manifest Build** (`packages/wallet/vite.manifest.config.ts`):
- Separate build for extension components
- Library format for background script and content script

### Biome Configuration
**Code Style Standards:**
- **Line Width:** 60 characters for compact, readable code
- **Naming Convention:** snake_case for variables and functions
- **Semicolons:** As needed (asNeeded)
- **Indentation:** 2 spaces
- **Rules:** Enhanced style rules for consistent code quality

## Testing Strategy

### Test Configuration
- **Framework:** Vitest with edge-runtime environment
- **Root Config:** `vitest.config.mjs:8-15` includes all `packages/**/*.test.ts`
- **Mocking:** `fake-indexeddb` for vault storage testing
- **Coverage:** Unit tests for cryptographic functions and utilities

### Test Examples
Key test files demonstrate security-critical functionality:
- `packages/wallet/src/utils/vault.test.ts:1-180` - Comprehensive vault encryption tests
- `packages/wallet/src/utils/crypto.test.ts` - Cryptographic operation tests
- `packages/wallet/src/utils/sign-transaction.test.ts` - Transaction signing tests

## Commands & Scripts

### Development Commands
```bash
pnpm dev                 # Start wallet extension + playground development
pnpm test               # Run unit tests (excludes connector package)
pnpm build              # Build all packages in dependency order
```

### Code Quality Commands
```bash
biome check             # Run linter and formatter checks
biome format --write    # Format code according to project standards
```

### Extension-Specific Commands (from packages/wallet/)
```bash
pnpm build              # Production build (manifest + extension)
pnpm zip                # Create extension.zip for Chrome Web Store
pnpm dev                # Watch mode builds for development
```

### Package-Specific Commands
```bash
# Transport, eth, transaction packages
pnpm dev                # Watch mode builds with tsdown
pnpm build              # Production builds

# Chain package
pnpm run indexer        # Update chain definitions from repositories

# Playground
pnpm dev                # React Router development server
pnpm deploy             # Build and deploy to Cloudflare Pages
```

## Package Dependencies

### Workspace Dependencies
- All packages use `valibot@1.1.0` for consistent schema validation
- Crypto packages share `@noble/*` and `@scure/*` libraries
- Internal packages reference each other via `workspace:*`

### Development Dependencies
- `tsdown` for efficient package builds (transport, eth, transaction)
- `fake-indexeddb` for IndexedDB testing without browser environment
- `@types/chrome` for Chrome extension API types

## Development Guidelines

### Code Organization
- **Test files:** Co-located with source files (`.test.ts` suffix)
- **Utils:** Shared utilities in each package's `utils/` directory
- **Types:** TypeScript interfaces and schemas alongside implementation
- **Index files:** Clean re-exports for package APIs

### Security Best Practices
- **Never log sensitive data:** Mnemonics, private keys, passwords
- **Validate all inputs:** Use Valibot schemas for runtime validation
- **Secure random generation:** Use `crypto.getRandomValues()` for salts/IVs
- **Constant-time operations:** Use timing-safe equality checks where needed

### Chrome Extension Development
- **Manifest V3:** Uses service workers instead of background pages
- **Permissions:** Minimal permissions (`storage`, `activeTab`)
- **Content Security Policy:** Strict CSP for security
- **Message Passing:** Structured communication between extension contexts

### Performance Considerations
- **Code Splitting:** Manual chunks for vendor libraries
- **Tree Shaking:** ES modules for optimal bundling
- **Lazy Loading:** Views loaded only when needed
- **Memory Management:** Signals for efficient reactivity

## Key File References

### Core Architecture
- Controller: `packages/wallet/src/controller.tsx:16-76`
- View State: `packages/wallet/src/utils/view.ts:1-5`
- Extension Entry: `packages/wallet/manifest/extension.entry.ts:13-67`

### Security Implementation
- Vault Storage: `packages/wallet/src/utils/vault.ts:83-128` (set_vault)
- Vault Retrieval: `packages/wallet/src/utils/vault.ts:130-185` (get_vault)
- Authentication: `packages/wallet/src/utils/authentication.ts:20-32`
- Transaction Signing: `packages/wallet/src/utils/sign-transaction.ts:138-171`

### Testing
- Vault Tests: `packages/wallet/src/utils/vault.test.ts:57-65`
- Test Config: `vitest.config.mjs:8-15`

### Build Configuration
- Extension Build: `packages/wallet/vite.extension.config.ts:9-42`
- TypeScript: `tsconfig.json:15-20` (path aliases)
- Biome: `biome.json:15-27` (formatter settings)
