# Valibot Import Resolution Issue Investigation

## Problem Statement

External test playground consuming published `@ethernauta` packages fails with:
```
Cannot find module '/Users/niconiahi/Documents/repos/test-playground/node_modules/@ethernauta/chain/dist/node_modules/.pnpm/valibot@1.1.0_typescript@5.8.3/node_modules/valibot/dist/index.js'
```

Error occurs in both npm and pnpm environments, both development and build modes.

## Current Configuration

- **tsdown config**: `external: [/^@ethernauta\//, "valibot"]`, `unbundle: true`
- **package.json**: valibot moved to `peerDependencies: {"valibot": "^1.1.0"}`
- **test-playground**: valibot installed as direct dependency `"valibot": "^1.1.0"`

## Test Results

### Test 1: Check Built Package Imports
**Command**: `grep -r "from.*valibot" packages/*/dist/`

**Result**: ✅ **MOSTLY CORRECT** - Most built files contain clean imports:
```javascript
packages/transport/dist/chain/encode-chain-id.js:import { parse } from "valibot"
packages/transport/dist/chain/caip-19/reference.d.ts:import * as valibot122 from "valibot"
packages/transport/dist/chain/caip-19/reference.d.ts:import { InferOutput } from "valibot"
// ... many more clean "valibot" imports
```

### Test 2: Check Specific Problem File
**Command**: `cat packages/chain/dist/chain/shared.js | grep "from.*valibot"`

**Result**: ❌ **INCORRECT** - This specific file contains mangled path:
```javascript
} from "../node_modules/.pnpm/valibot@1.1.0_typescript@5.8.3/node_modules/valibot/dist/index.js"
```

### Test 3: Source vs Built Comparison
**Source File Command**: `grep "from.*valibot" packages/chain/src/chain/shared.ts`

**Source Result**: ✅ **CORRECT**
```typescript
import type { InferOutput } from "valibot"
} from "valibot"
```

**Built File Command**: `grep "from.*valibot" packages/chain/dist/chain/shared.js`

**Built Result**: ❌ **INCORRECT**
```javascript
} from "../node_modules/.pnpm/valibot@1.1.0_typescript@5.8.3/node_modules/valibot/dist/index.js"
```

### Test 4: Node Resolution Verification
**Clean import test**: `node -e "console.log(require.resolve('valibot'))"`

**Result**: ✅ **WORKS**
```
/Users/niconiahi/Documents/repos/test-playground/node_modules/valibot/dist/index.cjs
```

**Mangled path test**: `node -e "console.log(require.resolve('/Users/niconiahi/Documents/repos/test-playground/node_modules/@ethernauta/chain/dist/node_modules/.pnpm/valibot@1.1.0_typescript@5.8.3/node_modules/valibot/dist/index.js'))"`

**Result**: ❌ **FAILS** (SyntaxError: Invalid or unexpected token)

## Key Affirmations

1. ✅ **tsdown external configuration is working** for most files
2. ✅ **Published packages mostly contain correct clean imports**
3. ❌ **One specific file has incorrect mangled imports**: `packages/chain/dist/chain/shared.js`
4. ✅ **valibot is correctly installed and resolvable** in test-playground
5. ❌ **Inconsistent tsdown processing** - some files get external treatment, others don't

## Root Cause Analysis

**The problem is NOT:**
- ❌ tsdown external configuration (it works for most files)
- ❌ Published package structure (most imports are clean)
- ❌ Consumer environment setup (valibot resolves correctly)
- ❌ pnpm vs npm difference (fails in both)

**The problem IS:**
- 🚨 **Inconsistent tsdown processing** of external dependencies
- 🚨 **File-specific build issue** where `chain/shared.js` gets different treatment
- 🚨 **Possible build race condition** or configuration inheritance problem

## Next Steps

1. **Investigate why `chain/shared.js` specifically** gets different tsdown processing
2. **Check if other files in the same package** have similar issues
3. **Verify tsdown configuration inheritance** across different source files
4. **Consider file-specific or import-specific conditions** that might trigger different behavior
5. **Test rebuild consistency** - does the same file always get mangled or is it random?

## Files to Investigate Further

- `packages/chain/src/chain/shared.ts` - source file
- `packages/chain/dist/chain/shared.js` - problematic built file  
- `packages/chain/tsdown.config.ts` - build configuration
- Other files in the same directory for comparison

## Technical Context

- **Monorepo**: pnpm workspace
- **Build tool**: tsdown with unbundle mode
- **Target**: ES modules with external dependencies
- **Consumer**: React Router application with npm/pnpm

---

*Investigation conducted on 2025-01-08*
*Built files checked against source files show inconsistent external dependency processing*