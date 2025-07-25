# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Objective

**Cryptoman** is a cryptocurrency wallet Chrome extension that allows users to:
- Create a wallet from mnemonic words while setting a password
- Store mnemonics securely in IndexedDB with encryption
- Access wallet functionality through a simple UI

## Project Overview

**Cryptoman** is built as a multi-package monorepo using pnpm workspaces. The main extension is built with Preact and uses Preact Signals for state management, replacing the previous XState implementation.

## Commands

### Development
- `pnpm dev` - Start development build for the extension (runs `pnpm --filter extension run dev`)
- `pnpm test` - Run unit tests for all packages except connector
- `pnpm test:chain` - Run tests specifically for the chain package
- `pnpm test:eth` - Run tests specifically for the eth package

### Code Quality
- `biome check` - Run linter and formatter checks
- `biome format --write` - Format code according to project standards

### Extension Build
- From extension package: `pnpm build` - Creates production build and zips extension for Chrome Web Store upload (run from dist directory)

## Architecture

### Monorepo Structure
The project is organized as a pnpm workspace with multiple packages:
- **@cryptoman/extension** - Main Chrome extension with UI
- **@cryptoman/chain** - Chain abstractions and utilities
- **@cryptoman/eth** - Ethereum-specific functionality
- **@cryptoman/transport** - Transport layer for blockchain communication
- **@cryptoman/connector** - External wallet connection utilities

### State Management
The application uses **Preact Signals** for state management with a simple controller pattern:
- **View signal** (`src/utils/view.ts`) - Controls which view is displayed (mnemonics/password/wallet)
- **Controller** (`src/controller.tsx`) - Simple switch-based view rendering
- No complex state machines - straightforward signal-based state

### Key Libraries
- **Preact** & **@preact/signals** - UI framework and state management
- **@scure/bip39** & **@scure/bip32** - Mnemonic and HD wallet utilities
- **@noble/hashes** & **@noble/secp256k1** - Cryptographic operations
- **Valibot** - Schema validation for forms and data

### Secure Storage
The `packages/extension/src/utils/vault.ts` file implements secure mnemonic storage:
- **IndexedDB** for persistent storage
- **PBKDF2** (100,000 iterations) for key derivation from password
- **AES-GCM** encryption for mnemonic protection
- **Base64 encoding** for data serialization
- Database: `cryptoman/signer` with store `vault`

### Cryptographic Operations
The `packages/extension/src/utils/crypto.ts` file provides:
- Mnemonic validation using @scure/bip39
- Mnemonic to seed conversion with validation
- HD key derivation (BIP32/BIP44 paths, default: `m/44'/60'/0'/0/0`)
- Private key to Ethereum address generation using Keccak-256

### TypeScript Configuration
- Root tsconfig extends `@total-typescript/tsconfig/tsc/dom/library`
- Path aliases for clean imports: `@cryptoman/transport`, `@cryptoman/eth`, etc.
- JSX configured for Preact with `react-jsx` transform

### Build Configuration
- **Vite** for extension builds with Preact preset
- Manual chunking separates vendor libraries by package and version
- ES modules output format for modern browsers
- Chrome extension structure with manifest in public directory

## Development Notes

### Code Style (Biome Configuration)
- **60 character line width** for compact code
- **Snake_case** for variable names and functions
- **Semicolons as needed** (asNeeded)
- **Self-closing elements** enforced
- **No parameter reassignment** allowed
- **2 space indentation**

### Testing
- **Vitest** for unit tests with `fake-indexeddb` for vault testing
- Test files alongside source code (e.g., `crypto.test.ts`, `vault.test.ts`)
- Tests configured at workspace root with vitest.config.mjs

### Extension Development
- Source in `packages/extension/src/` builds to `packages/extension/dist/`
- Three main views: mnemonics (initial setup), password (unlock), wallet (main)
- Views switch based on vault existence and authentication state
- Simple signal-based navigation between views