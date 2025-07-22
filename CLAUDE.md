# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Objective

Be a wallet that allows the user: 
- to open a wallet from it's mnemonics words while setting a password for it
- store this mnemonics in indexedDB for later retrieval (an example can be found in "examples/vault.js" (read the comments found in that file)

## Project Overview

**Morfar** is a Chrome extension built with Preact and Robot3 state machines. The project uses a finite state machine architecture for UI state management with strong TypeScript typing.

## Commands

### Development
- `pnpm dev` - Start development build with watch mode (builds continuously)
- `pnpm build` - Create production build and zip extension for Chrome Web Store upload

### Code Quality
- `biome check` - Run linter and formatter checks
- `biome format --write` - Format code according to project standards

## Architecture

### State Machine Pattern
The application uses Robot3 for state management with a clean separation between:
- **Machine definitions** (`src/machines/`) - Define states, transitions, and context
- **View components** (`src/views/`) - Pure components that receive state and send functions
- **Controller** (`src/controller.tsx`) - Coordinates state machine with UI rendering

### Type Safety
- Custom type definitions in `patches/preact-robot.d.ts` provide full type inference
- Export `ControllerSend` and `ControllerState` types from machine definitions for prop typing
- State machine events are fully typed - only valid transitions are allowed

### Component Patterns
```tsx
// Export typed send and state from machine
export type ControllerSend = SendFunction<GetMachineTransitions<ControllerMachine>>
export type ControllerState = ControllerMachine["state"] & { context: ControllerMachine["context"] }

// Components receive state and send as props
export function ViewComponent({ state, send }: { state: ControllerState; send: ControllerSend }) {
  // Component implementation
}
```

### Build Configuration
- **Vite config** builds unminified, readable output for debugging
- **Manual chunking** separates vendor libraries by version
- **Path aliases** `@views/*` and `@machines/*` for clean imports
- **emptyOutDir: true** clears old assets on each build

### Chrome Extension Structure
- Built files go to `dist/` directory
- Build process creates `extension.zip` ready for Chrome Web Store upload
- Extension uses ES modules with Preact for lightweight footprint

## Development Notes

### Adding New States
1. Update machine definition in `src/machines/controller.ts`
2. Add corresponding view component in `src/views/`
3. Update controller switch statement
4. Types are automatically inferred for new transitions

### Code Style
- Uses Biome with custom rules (60 character line width, space indentation)
- Semicolons only as needed
- Self-closing elements enforced
- No parameter reassignment allowed
- Use snake_case for names

