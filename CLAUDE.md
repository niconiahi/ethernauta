# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with the Cryptoman codebase.

## Objective

**Cryptoman** is a secure cryptocurrency wallet Chrome extension that provides:
- Wallet creation from mnemonic phrases with password protection
- Secure mnemonic storage using IndexedDB with AES-GCM encryption
- Transaction signing for Ethereum-compatible networks
- Clean, minimal UI built with Preact
- Extensible architecture supporting multiple blockchain networks

## Project Architecture

### Monorepo Structure
Cryptoman is organized as a pnpm workspace monorepo with the following packages:

#### Core Packages
- **@ethernauta/wallet** - Main Chrome extension with UI and crypto operations
- **@ethernauta/transport** - Transport layer for JSON-RPC communication and blockchain interactions
- **@ethernauta/chain** - Chain definitions and utilities (extensive EIP-155 chain support)
- **@ethernauta/eth** - Ethereum-specific functionality and methods
- **@ethernauta/connector** - External wallet connection utilities (WalletConnect support)

#### Development Packages  
- **playground** - React Router development environment for testing wallet integration

### Technology Stack

#### Frontend & State Management
- **Preact 10.26.9** - Lightweight React alternative for the extension UI
- **@preact/signals 2.2.1** - Reactive state management (replaces previous XState implementation)
- **Valibot 1.1.0** - Schema validation for forms and API data across all packages

#### Cryptography & Security
- **@noble/hashes 1.8.0** - Cryptographic hash functions (Keccak-256, SHA-256)
- **@noble/secp256k1 2.3.0** - Elliptic curve cryptography for key operations
- **@scure/bip39 1.6.0** - BIP39 mnemonic phrase generation and validation
- **@scure/bip32 1.7.0** - HD key derivation (BIP32/BIP44)
- **PBKDF2** (100,000 iterations) for password-based key derivation
- **AES-GCM** for mnemonic encryption in IndexedDB storage

#### Build & Development Tools
- **Vite 7.0.5** - Build tool with HMR for development
- **Biome 2.1.1** - Fast linter and formatter
- **Vitest 3.2.4** - Unit testing framework
- **TypeScript 5.8.3** - Type safety across all packages
- **pnpm** - Package manager with workspace support

### Package Details

#### @ethernauta/wallet (`packages/wallet/`)
The main Chrome extension package containing:

**Core Files:**
- `src/controller.tsx` - Main view controller with message handling
- `src/utils/view.ts` - View state management using Preact signals
- `src/utils/vault.ts` - Secure mnemonic storage with IndexedDB + encryption
- `src/utils/crypto.ts` - Cryptographic operations (mnemonic → seed → keys → addresses)
- `src/utils/authentication.ts` - Vault authentication and validation
- `src/utils/wallet.ts` - Wallet restoration and management
- `src/utils/transaction.ts` - Transaction signing and management
- `src/utils/sign-transaction.ts` - Transaction signature utilities

**Views:**
- `src/views/mnemonics/` - Initial wallet setup with mnemonic generation
- `src/views/password/` - Password entry for vault unlock
- `src/views/wallet/` - Main wallet interface
- `src/views/sign/` - Transaction signing interface

**Extension Architecture:**
- `manifest/extension.entry.ts` - Background script for message handling
- `manifest/browser.entry.ts` - Content script injection
- `manifest/cryptoman.ts` - Web-accessible resources
- `public/manifest.json` - Chrome extension manifest v3

#### @ethernauta/transport (`packages/transport/`)
Blockchain communication layer providing:
- JSON-RPC client implementation
- HTTP transport with error handling
- Transaction management and monitoring
- Chain ID encoding/decoding (CAIP-2, CAIP-10, CAIP-19 standards)
- Reader/Writer pattern for blockchain operations

#### @ethernauta/chain (`packages/chain/`)
Comprehensive chain definitions including:
- 500+ EIP-155 chain configurations (Ethereum, Polygon, BSC, L2s, testnets)
- Chain indexer for automatic updates
- Shared utilities for chain operations
- CAIP standard implementations

#### @ethernauta/eth (`packages/eth/`)
Ethereum-specific functionality:
- ABI encoding/decoding for functions, events, and errors
- Block, transaction, and receipt utilities
- Method implementations for common operations
- Fee market (EIP-1559) support
- State management utilities

#### @ethernauta/connector (`packages/connector/`)
External wallet integration:
- WalletConnect protocol implementation
- Cross-wallet compatibility layer

#### playground (`packages/playground/`)
Development testing environment:
- React Router 7.7.1 application
- Cloudflare Pages deployment configuration
- Integration examples and testing utilities
- Live wallet interaction demos

## Commands & Scripts

### Development
```bash
pnpm dev                 # Start wallet extension development build
pnpm test               # Run unit tests for all packages except connector
pnpm test:chain         # Run chain package tests specifically
pnpm test:eth           # Run eth package tests specifically
```

### Code Quality
```bash
biome check             # Run linter and formatter checks
biome format --write    # Format code according to project standards
```

### Extension Build & Distribution
```bash
# From packages/wallet/
pnpm build              # Production build (creates both manifest and extension)
pnpm zip                # Create extension.zip for Chrome Web Store (run from dist/)
```

### Package-Specific Scripts
```bash
# Transport, eth, connector packages
pnpm dev                # Watch mode builds with tsup
pnpm build              # Production builds

# Chain package  
pnpm run:indexer        # Update chain definitions from git repositories

# Playground
pnpm dev                # React Router development server
pnpm deploy             # Build and deploy to Cloudflare Pages
```

## Development Workflow

### State Management Pattern
The extension uses a simple, signal-based architecture:

1. **View Signal** (`packages/wallet/src/utils/view.ts`):
   ```typescript
   export const INITIAL_VIEW = "password"
   export const view = signal(INITIAL_VIEW)
   ```

2. **Controller Pattern** (`packages/wallet/src/controller.tsx`):
   - Message handling for Chrome extension communication
   - Simple switch-based view rendering
   - Authentication flow management

3. **Views Navigation**:
   - `"password"` - Initial view for vault unlock
   - `"mnemonics"` - New wallet setup (if no vault exists)
   - `"wallet"` - Main wallet interface (after authentication)
   - `"sign"` - Transaction signing interface

### Extension Communication Flow
1. **Content Script** → **Background Script** → **Popup**
2. **Message Types**:
   - `ETHERNAUTA_REQUEST_CONNECT` - Wallet connection request
   - `ETHERNAUTA_REQUEST_SIGN_TRANSACTION` - Transaction signing request
   - `ETHERNAUTA_RESPONSE_*` - Response messages back to content script

### Secure Storage Implementation
The vault system (`packages/wallet/src/utils/vault.ts`) provides:

**Encryption Process**:
1. User password + random salt → PBKDF2 (100,000 iterations) → encryption key
2. Mnemonic + random IV → AES-GCM encryption → encrypted cipher
3. Store: `{salt, iv, cipher}` in IndexedDB (`cryptoman/signer` database)

**Security Features**:
- Password-based key derivation (PBKDF2 with SHA-256)
- Authenticated encryption (AES-GCM)
- Secure random number generation for salts and IVs
- Base64 encoding for storage serialization

### Build Configuration

#### TypeScript Configuration
- **Root tsconfig**: Extends `@total-typescript/tsconfig/tsc/dom/library`
- **Path Aliases**:
  ```json
  {
    "@ethernauta/transport": ["./packages/transport/src"],
    "@ethernauta/eth": ["./packages/eth/src"],
    "@ethernauta/chain": ["./packages/chain/src"],
    "@ethernauta/connector": ["./packages/connector/src"],
    "@ethernauta/wallet": ["./packages/wallet/src"],
    "@utils/*": ["./utils/*"]
  }
  ```
- **JSX**: Configured for Preact with `react-jsx` transform
- **Types**: Includes Vitest globals and Chrome extension APIs

#### Vite Build Configuration
**Extension Build** (`packages/wallet/vite.extension.config.ts`):
- Preact preset with tsconfig paths
- ES modules output format
- Manual chunking for vendor libraries
- Hash-based file names in production
- Watch mode support for development

**Manifest Build** (`packages/wallet/vite.manifest.config.ts`):
- Separate build for extension background script
- Service worker output format

#### Biome Configuration
**Code Style Standards**:
- **Line Width**: 60 characters for compact, readable code
- **Naming Convention**: snake_case for variables and functions
- **Semicolons**: As needed (asNeeded)
- **Indentation**: 2 spaces
- **Rules**: No parameter reassignment, self-closing elements, enum initializers

**Linting Rules**:
- Recommended rules enabled
- Accessibility rules customized for extension context
- Style rules enforced (const assertions, number namespace, etc.)

### Testing Strategy

#### Test Configuration
- **Framework**: Vitest with edge-runtime environment
- **Root Config**: `vitest.config.mjs` includes all `packages/**/*.test.ts`
- **Mocking**: `fake-indexeddb` for vault storage testing
- **Coverage**: Unit tests for cryptographic functions and utilities

#### Test Patterns
```typescript
// Example test structure
describe('crypto utilities', () => {
  test('mnemonic validation', () => {
    expect(validateMnemonic('valid mnemonic phrase...')).toBe(true)
  })
})
```

### Package Dependencies

#### Workspace Dependencies
- All packages use `valibot@1.1.0` for schema validation
- Crypto packages share `@noble/*` and `@scure/*` libraries
- Internal packages reference each other via `workspace:*`

#### Development Dependencies
- `tsup` for package builds (transport, eth, connector)
- `npm-run-all` for parallel script execution
- `fake-indexeddb` for IndexedDB testing
- `@types/chrome` for extension API types

## Development Guidelines

### Code Organization
- **Test files**: Co-located with source files (`.test.ts` suffix)
- **Utils**: Shared utilities in each package's `utils/` directory  
- **Types**: TypeScript interfaces and schemas alongside implementation
- **Index files**: Clean re-exports for package APIs

### Security Best Practices
- **Never log sensitive data**: Mnemonics, private keys, passwords
- **Validate all inputs**: Use Valibot schemas for runtime validation
- **Secure random generation**: Use `crypto.getRandomValues()` for salts/IVs
- **Constant-time operations**: Use timing-safe equality checks where needed

### Extension Development
- **Manifest V3**: Uses service workers instead of background pages
- **Permissions**: Minimal permissions (`storage`, `activeTab`)
- **Content Security Policy**: Strict CSP for security
- **Message Passing**: Structured communication between contexts

### Performance Considerations
- **Code Splitting**: Manual chunks for vendor libraries
- **Tree Shaking**: ES modules for optimal bundling
- **Lazy Loading**: Views loaded only when needed
- **Memory Management**: Signals for efficient reactivity
