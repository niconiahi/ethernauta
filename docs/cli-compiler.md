# CLI Compiler Implementation Plan

## Overview

This document outlines the detailed implementation plan for adding a CLI interface to the existing `compile` function in the `@ethernauta/eth` package. The CLI will allow users to generate TypeScript method files from ABI JSON files via the command line.

## Target CLI Interface

```bash
ethernauta compile IERC721.abi.json --out .
```

This command should:
1. Read the ABI JSON file `IERC721.abi.json`
2. Parse and validate it against the existing `Description` schema
3. Generate TypeScript method files in a `methods/` directory within the output directory
4. Support both view and nonpayable functions as per the existing compiler logic

## Current State Analysis

### Existing Architecture

**Compile Function Location**: `packages/eth/src/abi/compiler.ts:15-35`
- Already handles TypeScript file generation
- Creates `methods/` directory structure automatically
- Supports view functions (`stateMutability: "view"`) and nonpayable functions (`stateMutability: "nonpayable"`)
- Uses Node.js `fs` operations (`writeFileSync`, `mkdirSync`, `existsSync`)

**Type System**: 
- `Description` type defined in `packages/eth/src/abi/description.ts:22-24`
- Uses Valibot union schema with support for functions, constructors, events, errors
- `DescriptionSchema` validates ABI entries at runtime

**Dependencies**:
- `@ethernauta/transport` for transport schemas
- `valibot` for runtime validation and type inference
- Node.js built-in modules (`node:fs`, `node:path`)

### ABI Format Analysis

Based on `packages/eth/src/erc/721/IERC721.abi.json`, ABI files contain arrays of objects with:
- **Functions**: `{type: "function", name: string, inputs: [], outputs: [], stateMutability: "view"|"nonpayable"}`
- **Events**: `{type: "event", name: string, inputs: [], anonymous: boolean}`
- **Errors**: `{type: "error", name: string, inputs: []}`

The CLI needs to convert this JSON array format into `Description[]` that the compiler expects.

## Implementation Plan

### 1. CLI Entry Point (`packages/eth/src/cli.ts`)

**Purpose**: Main CLI entry point with argument parsing and orchestration.

**Implementation Details**:
```typescript
#!/usr/bin/env node

import { readFileSync } from "node:fs"
import { resolve, extname } from "node:path"
import { parse } from "valibot"
import { compile } from "./abi/compiler.js"
import { DescriptionSchema } from "./abi/description.js"

// CLI interface
interface CLIArgs {
  abiFile: string
  outDir: string
}

function parseArgs(args: string[]): CLIArgs {
  // Parse command line arguments
  // Handle: ethernauta compile <abi-file> --out <directory>
  // Validate required arguments
  // Provide helpful error messages
}

function validateAbiFile(filePath: string): void {
  // Check file exists
  // Check file extension is .json
  // Check file is readable
}

function readAndParseAbi(filePath: string): Description[] {
  // Read JSON file
  // Parse as JSON array
  // Validate each entry against DescriptionSchema
  // Filter for supported types (functions only for now)
  // Return Description[] for compiler
}

function main(): void {
  const args = parseArgs(process.argv.slice(2))
  validateAbiFile(args.abiFile)
  const descriptions = readAndParseAbi(args.abiFile)
  compile(descriptions, args.outDir)
}

main()
```

**Error Handling**:
- File not found errors with clear messaging
- Invalid JSON parsing errors
- Schema validation failures
- Missing required arguments
- Invalid output directory permissions

**Argument Parsing Strategy**:
- Use simple manual parsing (no external dependencies)
- Support `--out` and `-o` flags
- Validate positional arguments
- Provide `--help` and `--version` options

### 2. ABI Validation and Conversion (`packages/eth/src/abi/abi-parser.ts`)

**Purpose**: Convert raw ABI JSON to validated `Description[]` format.

**Implementation Details**:
```typescript
import { array, parse } from "valibot"
import { DescriptionSchema, type Description } from "./description.js"

interface RawAbiEntry {
  type: string
  name?: string
  inputs?: any[]
  outputs?: any[]
  stateMutability?: string
  anonymous?: boolean
}

export function parseAbiArray(rawAbi: unknown): Description[] {
  // Validate input is array
  if (!Array.isArray(rawAbi)) {
    throw new Error("ABI must be an array of entries")
  }

  const descriptions: Description[] = []
  
  for (const [index, entry] of rawAbi.entries()) {
    try {
      // Skip non-function entries for now (events, errors)
      if (entry.type !== "function") {
        continue
      }

      // Validate entry against DescriptionSchema
      const description = parse(DescriptionSchema, entry)
      descriptions.push(description)
    } catch (error) {
      throw new Error(
        `Invalid ABI entry at index ${index}: ${error.message}`
      )
    }
  }

  if (descriptions.length === 0) {
    throw new Error("No valid function entries found in ABI")
  }

  return descriptions
}

export function validateAbiFile(content: string): unknown {
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new Error(`Invalid JSON in ABI file: ${error.message}`)
  }
}
```

**Validation Strategy**:
- Use existing `DescriptionSchema` for runtime validation
- Provide detailed error messages with entry indices
- Skip unsupported entry types gracefully
- Ensure at least one valid function is found

### 3. Package Configuration Updates

#### `packages/eth/package.json`

**Add Binary Field**:
```json
{
  "bin": {
    "ethernauta": "./dist/cli.js"
  },
  "scripts": {
    "dev": "tsdown --watch",
    "build": "tsdown && biome format --write dist && chmod +x dist/cli.js",
    // ... existing scripts
  }
}
```

**Rationale**:
- `bin` field makes CLI globally installable via `npm install -g @ethernauta/eth`
- `chmod +x` ensures executable permissions on Unix systems
- Maintains existing build pipeline with tsdown

#### TypeScript Build Configuration

**CLI Entry Point**: Ensure `src/cli.ts` is included in build output
**Executable Shebang**: `#!/usr/bin/env node` in CLI file
**Module Resolution**: Ensure `.js` extensions in imports for ES modules

### 4. Error Handling and User Experience

#### Comprehensive Error Messages
```typescript
class CLIError extends Error {
  constructor(
    message: string, 
    public readonly code: 'FILE_NOT_FOUND' | 'INVALID_JSON' | 'INVALID_ABI' | 'PERMISSION_ERROR'
  ) {
    super(message)
    this.name = 'CLIError'
  }
}

function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
  
  console.error('Unexpected error:', error)
  process.exit(1)
}
```

#### Help Text
```typescript
function showHelp(): void {
  console.log(`
ethernauta compile - Generate TypeScript methods from ABI files

USAGE:
  ethernauta compile <abi-file> --out <output-directory>
  ethernauta compile <abi-file> -o <output-directory>

ARGUMENTS:
  <abi-file>           Path to ABI JSON file (e.g., IERC721.abi.json)

OPTIONS:
  --out, -o <dir>      Output directory for generated methods
  --help, -h           Show this help message
  --version, -v        Show version number

EXAMPLES:
  ethernauta compile IERC721.abi.json --out .
  ethernauta compile ./contracts/Token.abi.json -o ./generated

The compiler generates TypeScript method files in a 'methods/' subdirectory
within the specified output directory.
  `)
}
```

### 5. Integration Testing Strategy

#### Test ABI Files
Create test fixtures in `packages/eth/src/abi/__fixtures__/`:
- `valid-erc721.abi.json` - Complete ERC721 interface
- `view-only.abi.json` - Only view functions
- `nonpayable-only.abi.json` - Only nonpayable functions  
- `invalid-schema.abi.json` - Schema validation failures
- `empty.abi.json` - Empty array
- `malformed.json` - Invalid JSON

#### CLI Integration Tests
```typescript
// packages/eth/src/cli.test.ts
import { execSync } from "node:child_process"
import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

describe("CLI Integration", () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ethernauta-cli-test-"))
  })

  test("compiles valid ABI file", () => {
    const result = execSync(
      `node dist/cli.js __fixtures__/valid-erc721.abi.json --out ${tempDir}`,
      { encoding: "utf-8" }
    )
    
    // Verify methods directory created
    // Verify expected TypeScript files generated
    // Verify file contents match expected templates
  })

  test("handles file not found error", () => {
    expect(() => {
      execSync(
        `node dist/cli.js nonexistent.abi.json --out ${tempDir}`,
        { encoding: "utf-8" }
      )
    }).toThrow()
  })

  test("shows help with --help flag", () => {
    const result = execSync("node dist/cli.js --help", { encoding: "utf-8" })
    expect(result).toContain("ethernauta compile - Generate TypeScript methods")
  })
})
```

### 6. File Structure Changes

```
packages/eth/
├── src/
│   ├── cli.ts                    # NEW: CLI entry point
│   ├── abi/
│   │   ├── compiler.ts           # EXISTING: Core compile function
│   │   ├── description.ts        # EXISTING: Type definitions
│   │   ├── abi-parser.ts         # NEW: ABI validation and conversion
│   │   └── __fixtures__/         # NEW: Test ABI files
│   │       ├── valid-erc721.abi.json
│   │       ├── view-only.abi.json
│   │       ├── nonpayable-only.abi.json
│   │       ├── invalid-schema.abi.json
│   │       ├── empty.abi.json
│   │       └── malformed.json
│   └── cli.test.ts               # NEW: CLI integration tests
├── dist/                         # GENERATED
│   ├── cli.js                    # Built CLI with shebang
│   └── ...                       # Other built files
└── package.json                  # MODIFIED: Add bin field
```

### 7. Development Workflow

#### Local Development
```bash
# In packages/eth/
pnpm dev                          # Watch mode build
chmod +x dist/cli.js              # Make executable
./dist/cli.js --help              # Test CLI locally
```

#### Global Installation Testing
```bash
# From repo root
pnpm --filter @ethernauta/eth build
cd packages/eth
npm link                          # Create global symlink
ethernauta compile --help         # Test globally
npm unlink                        # Clean up
```

#### CI/CD Considerations
- Ensure executable permissions preserved in npm package
- Test CLI in CI environment with different ABI files
- Verify generated TypeScript files compile correctly

### 8. Implementation Phases

#### Phase 1: Core CLI Infrastructure
1. Create `src/cli.ts` with basic argument parsing
2. Implement file reading and JSON parsing
3. Add basic error handling and help text
4. Update package.json with bin field

#### Phase 2: ABI Processing
1. Create `src/abi/abi-parser.ts` with validation logic
2. Integrate with existing `DescriptionSchema`
3. Add comprehensive error messages for validation failures
4. Filter to function entries only

#### Phase 3: Integration and Testing
1. Wire CLI to existing compiler function
2. Create test fixtures and integration tests
3. Test with real ABI files (ERC721, ERC20)
4. Verify generated TypeScript compiles correctly

#### Phase 4: Polish and Documentation
1. Add comprehensive help text and examples
2. Handle edge cases and error scenarios
3. Performance optimization for large ABI files
4. Documentation updates

### 9. Technical Considerations

#### Module System Compatibility
- Use `.js` extensions in imports for ES modules
- Ensure Node.js compatibility with `type: "module"`
- Handle shebang line in TypeScript build output

#### Performance
- Stream large ABI files for memory efficiency
- Batch file operations where possible
- Provide progress indication for large compilations

#### Security
- Validate file paths to prevent directory traversal
- Sanitize output directory creation
- Limit file size for ABI inputs

#### Future Extensions
- Support for error and event generation
- Multiple ABI file processing
- Custom output templates
- Integration with package.json scripts
- Watch mode for development

### 10. Success Criteria

1. **Functional Requirements**:
   - CLI successfully parses ABI JSON files
   - Generates correct TypeScript method files
   - Creates proper directory structure
   - Handles both view and nonpayable functions

2. **User Experience**:
   - Clear error messages for common mistakes
   - Helpful documentation and examples
   - Fast execution for typical ABI files
   - Consistent with existing Ethernauta conventions

3. **Technical Quality**:
   - Full TypeScript type safety
   - Comprehensive test coverage
   - Integration with existing build pipeline
   - No breaking changes to existing API

4. **Installation**:
   - Works with `npm install -g @ethernauta/eth`
   - Executable from command line as `ethernauta compile`
   - Compatible across platforms (Unix, Windows)

This plan leverages the existing, well-tested compiler infrastructure while adding a minimal CLI layer that follows Node.js and TypeScript best practices. The implementation focuses on robustness, clear error handling, and seamless integration with the current codebase architecture.