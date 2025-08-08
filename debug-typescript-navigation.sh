#!/bin/bash

# Debug TypeScript CMD+Click Navigation Issues
# This script analyzes packages to find why some allow navigation to .ts sources
# while others only go to .d.ts declaration files

echo "=== TypeScript Navigation Debug Analysis ==="
echo ""

echo "1. Finding packages with target functions..."
echo "Transport packages with createWriter:"
find . -name "*.d.ts" -path "*/transport/dist/*" -exec grep -l "createWriter" {} \;

echo ""
echo "Transaction packages with register_transaction:"
find . -name "*.d.ts" -path "*/transaction/dist/*" -exec grep -l "register_transaction" {} \;

echo ""
echo "2. Checking source map references..."
echo "Source map URLs:"
grep -H "sourceMappingURL" ./transport/dist/writer.d.ts ./transaction/dist/transaction.d.ts 2>/dev/null

echo ""
echo "3. Comparing source map contents..."
echo "Transport writer source map sources:"
if command -v jq >/dev/null 2>&1; then
    cat ./transport/dist/writer.d.ts.map | jq -r '.sources'
else
    grep -o '"sources":\[.*\]' ./transport/dist/writer.d.ts.map
fi

echo ""
echo "Transaction source map sources:"
if command -v jq >/dev/null 2>&1; then
    cat ./transaction/dist/transaction.d.ts.map | jq -r '.sources'
else
    grep -o '"sources":\[.*\]' ./transaction/dist/transaction.d.ts.map
fi

echo ""
echo "4. Checking file timestamps (stale builds)..."
echo "Source map build times:"
find ./transport/dist ./transaction/dist ./eth/dist ./chain/dist -name "*.d.ts.map" -exec ls -la {} \; 2>/dev/null | head -5

echo ""
echo "5. Verifying source files exist..."
echo "Source file timestamps:"
ls -la ./transport/src/writer.ts ./transaction/src/transaction.ts 2>/dev/null

echo ""
echo "6. Comparing tsdown configurations..."
echo "Config differences:"
find . -maxdepth 2 -name "tsdown.config.ts" -exec grep -H "entry\|external\|bundle\|unbundle" {} \;

echo ""
echo "7. Analyzing import patterns..."
echo "Valibot import styles:"
grep "import.*valibot" ./transport/src/writer.ts ./transaction/src/transaction.ts 2>/dev/null

echo ""
echo "8. Checking .d.ts structure..."
echo "Transport writer.d.ts structure:"
wc -l ./transport/dist/writer.d.ts 2>/dev/null
echo "Region markers in transport:"
grep -n "#region\|#endregion" ./transport/dist/writer.d.ts 2>/dev/null

echo ""
echo "Transaction .d.ts structure:"
wc -l ./transaction/dist/transaction.d.ts 2>/dev/null
echo "Region markers in transaction:"
grep -n "#region\|#endregion" ./transaction/dist/transaction.d.ts 2>/dev/null

echo ""
echo "9. Export analysis..."
echo "Export count comparison:"
grep -c "^export" ./transport/src/writer.ts ./transaction/src/transaction.ts 2>/dev/null

echo ""
echo "Function declaration locations in .d.ts files:"
grep -n "declare function createWriter\|declare function register_transaction" ./transport/dist/writer.d.ts ./transaction/dist/transaction.d.ts 2>/dev/null

echo ""
echo "=== Analysis Complete ==="
echo "Look for:"
echo "- Stale build timestamps"
echo "- Different import patterns (namespace vs named imports)"
echo "- Complex .d.ts files with many declarations"
echo "- Missing or incorrect source map references"