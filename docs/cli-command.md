# Exposing `ethernauta compile` CLI Command

## Overview

Transform the current local CLI usage:
```bash
bun src/compiler/cli.ts --abi src/erc/165/IERC165.abi.json --out src/erc/165
```

Into a global command:
```bash
ethernauta compile --abi src/erc/165/IERC165.abi.json --out src/erc/165
```

## Current State Analysis

### Existing CLI Structure
- **No existing global CLI**: The workspace doesn't have a main `ethernauta` CLI binary
- **Current CLI location**: `packages/eth/src/compiler/cli.ts`
- **Current usage**: Via `bun` direct execution with `test:cli` script
- **Arguments**: Expects `--abi <path>` and `--out <path>` flags

### Current CLI Implementation
```typescript
// packages/eth/src/compiler/cli.ts
function validate_args(args: string[]) {
  // Expects exactly 4 args: [--abi, path, --out, path]
  // Simple positional argument parsing
}

async function get_descriptions(path: string): Promise<Description[]> {
  // Dynamically imports ABI JSON file
  // Parses and filters for functions only
}

async function run(): Promise<void> {
  // Main execution logic
  // Calls compile() function
}
```

## Implementation Plan

### Phase 1: Create Main CLI Structure

#### 1.1 Create Root CLI Package
**File**: `packages/cli/package.json`
```json
{
  "name": "@ethernauta/cli",
  "type": "module",
  "bin": {
    "ethernauta": "./dist/bin.js"
  },
  "main": "./dist/index.js",
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "dependencies": {
    "@ethernauta/eth": "workspace:*"
  },
  "devDependencies": {
    "tsdown": "^0.13.3"
  }
}
```

#### 1.2 Create CLI Entry Point
**File**: `packages/cli/src/bin.ts`
```typescript
#!/usr/bin/env node

import { parseArgs } from "node:util"
import { compile_command } from "./commands/compile.js"

const args = parseArgs({
  options: {
    help: { type: "boolean", short: "h" },
    version: { type: "boolean", short: "v" }
  },
  allowPositionals: true,
  strict: false
})

const command = args.positionals[0]

switch (command) {
  case "compile":
    await compile_command(process.argv.slice(3))
    break
  case "help":
  case undefined:
    console.log(`
Usage: ethernauta <command> [options]

Commands:
  compile    Generate TypeScript files from ABI

Options:
  -h, --help     Show help
  -v, --version  Show version
`)
    break
  default:
    console.error(`Unknown command: ${command}`)
    process.exit(1)
}
```

#### 1.3 Create Compile Command
**File**: `packages/cli/src/commands/compile.ts`
```typescript
import { parseArgs } from "node:util"
import { resolve } from "node:path"
import { array, parse, string } from "valibot"
import { 
  type Description,
  DescriptionSchema,
  compile 
} from "@ethernauta/eth"

interface CompileArgs {
  abi: string
  out: string
}

function parse_compile_args(args: string[]): CompileArgs {
  const parsed = parseArgs({
    args,
    options: {
      abi: { type: "string" },
      out: { type: "string" }
    },
    strict: true
  })

  if (!parsed.values.abi || !parsed.values.out) {
    throw new Error("Both --abi and --out arguments are required")
  }

  return {
    abi: parsed.values.abi,
    out: parsed.values.out
  }
}

async function get_descriptions(path: string): Promise<Description[]> {
  const absolute_path = resolve(process.cwd(), path)
  const module = await import(absolute_path)
  const JSON_ABI = module.default
  const descriptions = parse(array(DescriptionSchema), JSON_ABI)
  
  return descriptions.filter((description) => {
    return description.type === "function"
  })
}

function pluralize(word: string, count: number) {
  return count > 1 ? `${word}s` : word
}

export async function compile_command(args: string[]): Promise<void> {
  try {
    const { abi, out } = parse_compile_args(args)
    const descriptions = await get_descriptions(abi)
    
    compile(descriptions, out)
    
    const count = descriptions.length
    console.log(
      `✅ Compiled ${count} ${pluralize("function", count)} to ${out}/methods/`
    )
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    console.log(`
Usage: ethernauta compile --abi <path> --out <directory>

Examples:
  ethernauta compile --abi ./IERC20.abi.json --out ./src/erc/20
  ethernauta compile --abi src/erc/165/IERC165.abi.json --out src/erc/165
`)
    process.exit(1)
  }
}
```

### Phase 2: Update Root Package Configuration

#### 2.1 Update Root package.json
**File**: `package.json`
```json
{
  "name": "ethernauta",
  "workspaces": [
    "packages/*",
    "examples/*"
  ],
  "scripts": {
    "build": "pnpm --filter @ethernauta/cli --filter @ethernauta/transaction... run build"
  }
}
```

#### 2.2 Create CLI Build Configuration
**File**: `packages/cli/tsdown.config.ts`
```typescript
import { defineConfig } from "tsdown"

export default defineConfig({
  entry: {
    bin: "src/bin.ts",
    index: "src/index.ts"
  },
  format: ["esm"],
  target: "node18",
  clean: true,
  shims: true
})
```

### Phase 3: Workspace Integration

#### 3.1 Add CLI to Workspace
**File**: `pnpm-workspace.yaml`
```yaml
packages:
  - 'packages/*'
  - 'examples/*'
```

#### 3.2 Update Build Dependencies
Ensure `@ethernauta/cli` builds after `@ethernauta/eth`:
```json
{
  "scripts": {
    "build": "pnpm --filter @ethernauta/transaction... --filter @ethernauta/cli run build"
  }
}
```

### Phase 4: Global Installation

#### 4.1 Install CLI Globally
```bash
# Development
pnpm --filter @ethernauta/cli build
pnpm --filter @ethernauta/cli link --global

# Production
pnpm publish @ethernauta/cli
pnpm install -g @ethernauta/cli
```

#### 4.2 Test Installation
```bash
ethernauta --help
ethernauta compile --abi src/erc/165/IERC165.abi.json --out src/erc/165
```

## Alternative Approaches

### Option A: Add bin to @ethernauta/eth Package
**Pros**: Simpler, fewer packages
**Cons**: Mixes library with CLI concerns

Add to `packages/eth/package.json`:
```json
{
  "bin": {
    "ethernauta": "./dist/cli/bin.js"
  }
}
```

### Option B: Standalone CLI Repository
**Pros**: Complete separation
**Cons**: More complex dependency management

Create separate repository with `@ethernauta/eth` as dependency.

### Option C: Root Package CLI (Recommended)
**Pros**: Clean separation, easy workspace integration
**Cons**: Additional package to maintain

Follow the main implementation plan above.

## Migration Strategy

### Step 1: Backward Compatibility
Keep existing `test:cli` script working:
```json
{
  "scripts": {
    "test:cli": "bun src/compiler/cli.ts --abi src/erc/165/IERC165.abi.json --out src/erc/165"
  }
}
```

### Step 2: Parallel Implementation
Build new CLI while maintaining old one.

### Step 3: Update Documentation
Update all references from `bun src/compiler/cli.ts` to `ethernauta compile`.

### Step 4: Deprecation Notice
Add deprecation warning to old CLI:
```typescript
console.warn("⚠️  Direct CLI usage is deprecated. Use 'ethernauta compile' instead.")
```

## Testing Strategy

### Unit Tests
**File**: `packages/cli/src/commands/compile.test.ts`
```typescript
import { describe, it, expect } from "vitest"
import { compile_command } from "./compile.js"

describe("compile command", () => {
  it("should parse arguments correctly", () => {
    // Test argument parsing
  })
  
  it("should handle missing arguments", () => {
    // Test error cases
  })
})
```

### Integration Tests
```bash
# Test actual CLI execution
ethernauta compile --abi test/fixtures/IERC20.abi.json --out tmp/test
```

### CI/CD Updates
```yaml
# .github/workflows/test.yml
- name: Test CLI
  run: |
    pnpm build
    pnpm --filter @ethernauta/cli link --global
    ethernauta compile --abi packages/eth/src/erc/20/IERC20.abi.json --out tmp/cli-test
    # Verify files were generated
```

## Documentation Updates

### README Updates
Add CLI usage section:
```markdown
## CLI Usage

Install globally:
```bash
pnpm install -g @ethernauta/cli
```

Generate TypeScript files from ABI:
```bash
ethernauta compile --abi ./IERC20.abi.json --out ./src/contracts
```

### API Documentation
Document programmatic usage remains unchanged:
```typescript
import { compile } from "@ethernauta/eth"

compile(descriptions, "./output/dir")
```

## Success Criteria

- [ ] `ethernauta compile --abi <path> --out <dir>` works globally
- [ ] Existing programmatic API remains unchanged
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Backward compatibility maintained
- [ ] CI/CD pipeline updated
- [ ] Package published successfully

## Timeline

- **Week 1**: Implement CLI package structure
- **Week 2**: Test and refine argument parsing
- **Week 3**: Update documentation and CI/CD
- **Week 4**: Publish and announce

## Dependencies

- `@ethernauta/eth` must be built before CLI
- Node.js 18+ for proper `parseArgs` support
- TypeScript 5+ for modern module resolution

