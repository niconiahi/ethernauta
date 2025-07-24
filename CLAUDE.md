# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Objective

Be a wallet that allows the user: 
- to open a wallet from it's mnemonics words while setting a password for it
- store this mnemonics in indexedDB for later retrieval (an example can be found in "examples/vault.js" (read the comments found in that file)

## Project Overview

**Morfar** is a Chrome extension built with Preact and XState state machines. The project uses a finite state machine architecture for UI state management with strong TypeScript typing.

## Commands

### Development
- `pnpm dev` - Start development build with watch mode (builds continuously)
- `pnpm dev:web` - Start development server for web preview
- `pnpm build` - Create production build and zip extension for Chrome Web Store upload (run from dist directory)
- `pnpm test` - Run tests with Vitest

### Code Quality
- `biome check` - Run linter and formatter checks
- `biome format --write` - Format code according to project standards

## Architecture

### State Machine Pattern
The application uses XState v5 for state management with a clean separation between:
- **Machine definitions** (`src/machines/`) - Define states, transitions, and context using XState
- **View components** (`src/views/`) - Pure components that receive state and send functions
- **Controller** (`src/controller.tsx`) - Coordinates state machine with UI rendering
- **Custom hook** (`src/hooks/useMachine.ts`) - Wraps XState actor management for Preact

### Dual State Machine Architecture
The app uses two coordinated state machines:
1. **View Machine** (`src/machines/view.ts`) - Controls which view is displayed (mnemonics/password/wallet)
2. **Authentication Machine** (`src/machines/authentication.ts`) - Handles authentication flow and vault operations

The authentication machine receives the view machine actor as input and controls navigation by sending events to it.

### Key Libraries
- **XState v5** - State management with typed actors and guards
- **@formisch/preact** - Form handling library
- **@scure/bip39** & **@scure/bip32** - Mnemonic and HD wallet utilities
- **@noble/hashes** & **@noble/secp256k1** - Cryptographic operations
- **Valibot** - Schema validation for forms and data

### Secure Storage
The `src/utils/vault.ts` file implements secure mnemonic storage using:
- **IndexedDB** for persistent storage
- **PBKDF2** (100,000 iterations) for key derivation
- **AES-GCM** encryption for mnemonic protection
- **Base64 encoding** for data serialization

### Type Safety
- Custom hook returns typed state and send function: `[snapshot, send, actor]`
- Export typed interfaces from machine files for component props
- XState provides full type inference for events and context
- Path aliases for clean imports: `@views/*`, `@machines/*`, `@utils/*`, `@hooks/*`

### Component Patterns
```tsx
// Machine exports typed interfaces
export type Authentication = ReturnType<typeof useAuthenticationMachine>

// Components receive authentication object with state and send
export function PasswordView({ authentication }: { authentication: Authentication }) {
  const [state, send] = authentication
  // Component implementation using state.matches() and send()
}
```

### Build Configuration
- **Vite** builds unminified ES modules for debugging
- **Manual chunking** separates vendor libraries (preact, xstate)
- **TypeScript paths** resolve `@views/*`, `@machines/*`, etc.
- **Chrome extension structure** with manifest and background scripts

### Cryptographic Operations
The `src/utils/crypto.ts` file provides:
- Mnemonic to seed conversion with validation
- HD key derivation (BIP32/BIP44 paths)
- Private key to Ethereum address generation
- Secp256k1 public key operations

## Development Notes

### State Machine Development
1. Use XState v5 `setup()` function for machine configuration
2. Define typed events, context, and input interfaces
3. Use `fromPromise` actors for async operations (vault access, validation)
4. Guards validate events before transitions occur
5. Actions update context and trigger side effects

### Adding New Features
1. Update machine definitions with new states/events
2. Add corresponding view components
3. Update controller switch statement for new views
4. Types are automatically inferred from machine definitions

### Testing
- **Vitest** for unit tests with fake-indexeddb for vault testing
- Test files alongside source code (e.g., `crypto.test.ts`, `vault.test.ts`)
- Mock IndexedDB operations for consistent testing environment

### Code Style
- **Biome** configuration with 60 character line width
- Snake_case for variable names and functions
- Semicolons only as needed (asNeeded)
- Self-closing elements enforced
- No parameter reassignment allowed
- Space indentation (2 spaces)

### Chrome Extension Structure
- Source in `src/` directory builds to `dist/`
- Extension manifest and assets in build output
- Build creates `extension.zip` for Chrome Web Store upload
- Uses ES modules for modern JavaScript features