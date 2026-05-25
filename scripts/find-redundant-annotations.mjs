#!/usr/bin/env node
//
// Find variable declarations whose `: T` annotation is redundant
// against TypeScript's inference of the initializer.
//
// Reports two patterns banned by R2 (see skills/no-violations/SKILL.md):
//
//   1. `const X: T = parse(tSchema, raw)` where parse already returns T.
//   2. `const x: Foo = make_foo()` where make_foo returns Foo.
//
// Skips R2's allowed-list shapes:
//
//   - no initializer                 →  `let recovery: number`
//   - empty array / object seed      →  `const out: T[] = []`, `{}`
//   - nullable seed                  →  `let maker: Set<G> | null = null`
//   - object / array literal initializer (author-constructed)
//   - IIFE initializer  `(() => { ... })()`
//   - test files (.test.ts/.test.tsx)
//   - generator output: packages/chain/src/chain/eip155/**
//
// The check: declared type and inferred type must be EXACTLY the same
// (mutually assignable both ways). A widening or narrowing annotation
// stays — that's information TS couldn't otherwise express.

import { readFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "..")

const PACKAGES = [
  "abi",
  "chain",
  "cli",
  "core",
  "crypto",
  "ens",
  "eth",
  "eip",
  "erc",
  "transaction",
  "transport",
  "utils",
  "wallet",
]

function load_program(package_name) {
  const tsconfig_path = join(REPO_ROOT, "packages", package_name, "tsconfig.json")
  const parsed = ts.parseJsonConfigFileContent(
    ts.readConfigFile(tsconfig_path, ts.sys.readFile).config,
    ts.sys,
    join(REPO_ROOT, "packages", package_name),
  )
  return ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
  })
}

function is_skippable_initializer(initializer) {
  if (!initializer) return true
  if (ts.isObjectLiteralExpression(initializer)) return true
  if (ts.isArrayLiteralExpression(initializer)) return true
  if (initializer.kind === ts.SyntaxKind.NullKeyword) return true
  // Bare arrow / function expression: the annotation supplies the
  // parameter types that the arrow body can't infer on its own.
  // Removing it would cause implicit-any on each parameter.
  if (ts.isArrowFunction(initializer)) return true
  if (ts.isFunctionExpression(initializer)) return true
  // IIFE: author-constructed value wrapped in a self-invoking closure.
  if (
    ts.isCallExpression(initializer) &&
    ts.isParenthesizedExpression(initializer.expression) &&
    (ts.isArrowFunction(initializer.expression.expression) ||
      ts.isFunctionExpression(initializer.expression.expression))
  ) {
    return true
  }
  if (ts.isAsExpression(initializer)) {
    return is_skippable_initializer(initializer.expression)
  }
  return false
}

function has_any(type) {
  if (type.flags & ts.TypeFlags.Any) return true
  if (type.flags & ts.TypeFlags.Object) {
    const type_arguments = type.aliasTypeArguments ?? type.typeArguments
    if (type_arguments) {
      for (const argument of type_arguments) {
        if (has_any(argument)) return true
      }
    }
  }
  return false
}

function types_equal(checker, declared, inferred) {
  // `any` is mutually assignable with everything, so the assignability
  // check would falsely flag `: T = something_any` as redundant. Skip.
  if (has_any(declared) || has_any(inferred)) return false
  const a_to_b = checker.isTypeAssignableTo(declared, inferred)
  const b_to_a = checker.isTypeAssignableTo(inferred, declared)
  return a_to_b && b_to_a
}

function walk(node, visit) {
  visit(node)
  ts.forEachChild(node, (child) => walk(child, visit))
}

function scan_package(package_name) {
  const program = load_program(package_name)
  const checker = program.getTypeChecker()
  const findings = []

  for (const source_file of program.getSourceFiles()) {
    if (source_file.isDeclarationFile) continue
    const path = source_file.fileName
    if (path.includes("/node_modules/")) continue
    if (!path.includes(`/packages/${package_name}/src/`)) continue
    if (path.endsWith(".test.ts") || path.endsWith(".test.tsx")) continue
    if (path.includes("/chain/eip155/")) continue

    walk(source_file, (node) => {
      if (!ts.isVariableDeclaration(node)) return
      if (!node.type) return
      if (is_skippable_initializer(node.initializer)) return

      const declared_type = checker.getTypeFromTypeNode(node.type)
      const inferred_type = checker.getTypeAtLocation(node.initializer)

      if (!types_equal(checker, declared_type, inferred_type)) return

      const { line, character } = source_file.getLineAndCharacterOfPosition(
        node.getStart(),
      )
      findings.push({
        file: relative(REPO_ROOT, path),
        line: line + 1,
        column: character + 1,
        name: node.name.getText(source_file),
        annotation: node.type.getText(source_file),
        initializer: node.initializer.getText(source_file).slice(0, 80),
      })
    })
  }

  return findings
}

function main() {
  const count_only = process.argv.includes("--count")
  const all = []
  for (const pkg of PACKAGES) {
    try {
      const found = scan_package(pkg)
      all.push(...found)
    } catch (error) {
      if (!count_only) {
        console.error(`[${pkg}] scan failed: ${error.message}`)
      }
    }
  }

  if (count_only) {
    console.log(all.length)
    return
  }

  if (all.length === 0) {
    console.log("no redundant annotations found")
    return
  }

  console.log(`found ${all.length} redundant annotation${all.length === 1 ? "" : "s"}:\n`)
  for (const f of all) {
    console.log(`${f.file}:${f.line}:${f.column}`)
    console.log(`  const ${f.name}: ${f.annotation} = ${f.initializer}${f.initializer.length >= 80 ? "..." : ""}`)
    console.log()
  }
}

main()
