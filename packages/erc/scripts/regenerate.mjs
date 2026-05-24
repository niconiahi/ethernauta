// Regenerate ERC interface ABIs + method bindings from the Foundry workspace.
//
// Run: bun packages/erc/scripts/regenerate.mjs
//
// Source of truth: `contracts/src/I*.sol` files compiled by Foundry. Each
// file declares ONE interface whose name matches the file basename and
// carries a spec-link header `// https://eips.ethereum.org/EIPS/eip-<N>`.
// The link is what routes the file — host number comes from the EIP, the
// extension suffix comes from whatever's left of the basename after
// stripping the matching `IERC<N>` prefix (when present) or just the
// leading `I`.
//
//   contracts/src/IERC20.sol           (// eip-20) -> packages/erc/src/20/
//   contracts/src/IERC20Burnable.sol   (// eip-20) -> packages/erc/src/20/extensions/burnable/
//   contracts/src/IERC1155MetadataURI.sol (// eip-1155) -> packages/erc/src/1155/extensions/metadata-uri/
//   contracts/src/IERC137Resolver.sol  (// eip-137) -> packages/erc/src/137/extensions/resolver/
//   contracts/src/IOriginSettler.sol   (// eip-7683) -> packages/erc/src/7683/extensions/origin-settler/
//   contracts/src/IDestinationSettler.sol (// eip-7683) -> packages/erc/src/7683/extensions/destination-settler/
//
// Files with no spec-link comment are skipped only if explicitly listed in
// SKIP_FILES (e.g. BatchExecutor.sol — an implementation, not an interface).
// Any other file lacking a spec link is a hard error so a missing header
// can't silently drop an interface from the binding tree.
//
// Outputs (all overwritten on every run):
//   - <out>/<InterfaceName>.abi.json — extracted ABI array
//   - <out>/methods/<method>.ts      — generated bindings
//   - <out>/methods/index.ts         — barrel
//

import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import {
  emit_file_basename_for,
  generate,
} from "../../abi/src/generator/generator.ts"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repo_root = resolve(__dirname, "../../..")
const contracts_dir = join(repo_root, "contracts")
const forge_out = join(contracts_dir, "out")
const erc_src = join(repo_root, "packages/erc/src")

function run_forge_build() {
  console.log("→ forge build")
  execFileSync("forge", ["build"], {
    cwd: contracts_dir,
    stdio: "inherit",
  })
}

function read_artifact_abi(source_file, interface_name) {
  const path = join(
    forge_out,
    `${source_file}.sol`,
    `${interface_name}.json`,
  )
  if (!existsSync(path)) {
    throw new Error(
      `forge artifact not found: ${path} (run \`cd contracts && forge build\`)`,
    )
  }
  const artifact = JSON.parse(readFileSync(path, "utf8"))
  if (!Array.isArray(artifact.abi)) {
    throw new Error(`expected array \`abi\` at ${path}`)
  }
  return artifact.abi
}

function pascal_to_kebab(s) {
  // "MetadataURI" -> "metadata-uri", "Burnable" -> "burnable"
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
}

const SPEC_LINK_RE =
  /^\/\/\s*https:\/\/eips\.ethereum\.org\/EIPS\/eip-(\d+)\s*$/m
const INTERFACE_DECL_RE = /^interface\s+\w/m
const CONTRACT_DECL_RE = /^contract\s+\w/m

function read_source(filename) {
  return readFileSync(
    join(contracts_dir, "src", `${filename}.sol`),
    "utf8",
  )
}

function classify_file(filename) {
  // Decides whether to route the file based on two independent signals
  // that must agree:
  //
  //   filename:    starts with `I` (Solidity interface convention).
  //   declaration: top-level `interface X` vs `contract X` in the source.
  //
  //  | I-prefix | interface | contract | → action                              |
  //  |----------|-----------|----------|---------------------------------------|
  //  | yes      | yes       | no       | route                                  |
  //  | yes      | no        | yes      | error (I-prefix but declares contract) |
  //  | no       | no        | yes      | skip (implementation file)             |
  //  | no       | yes       | no       | error (interface without I-prefix)     |
  //  | any      | yes       | yes      | error (mixed — not supported)          |
  //  | any      | no        | no       | skip (no top-level declaration)        |
  const starts_with_i = filename.startsWith("I")
  const source = read_source(filename)
  const has_interface = INTERFACE_DECL_RE.test(source)
  const has_contract = CONTRACT_DECL_RE.test(source)
  if (has_interface && has_contract) {
    throw new Error(
      `${filename}.sol declares both an \`interface\` and a \`contract\`. ` +
        `Split into separate files so each one is routable or skippable on its own.`,
    )
  }
  if (has_interface && !starts_with_i) {
    throw new Error(
      `${filename}.sol declares an interface but its basename does not start ` +
        `with \`I\`. Rename the file (and the interface) to follow the Solidity convention.`,
    )
  }
  if (has_contract && starts_with_i) {
    throw new Error(
      `${filename}.sol's basename starts with \`I\` (interface convention) but ` +
        `the file declares a \`contract\`. Either rename to drop the \`I\` prefix ` +
        `or restructure the file as an interface.`,
    )
  }
  if (!has_interface) return "skip"
  return "interface"
}

function route_for(filename) {
  // Returns { source_file, host_number, suffix, out_dir } or null when
  // the file is not a routable interface. Steps:
  //
  //   1. classify_file → interface | skip | (throws on convention break).
  //   2. Spec-link header → hard error if missing on an interface file
  //      (every routed file must declare which EIP it implements).
  //   3. Filename prefix:
  //      - starts with `IERC<host_number>` → strip → suffix.
  //      - starts with `I` only → strip the `I` → suffix.
  //      - Empty suffix → host route; non-empty → extension route.
  if (classify_file(filename) === "skip") return null
  const source = read_source(filename)
  const link_match = SPEC_LINK_RE.exec(source)
  if (!link_match) {
    throw new Error(
      `${filename}.sol declares an interface but has no ` +
        `\`// https://eips.ethereum.org/EIPS/eip-<N>\` header.`,
    )
  }
  const host_number = link_match[1]
  const ierc_prefix = `IERC${host_number}`
  const suffix = filename.startsWith(ierc_prefix)
    ? filename.slice(ierc_prefix.length)
    : filename.slice(1)
  const out_dir = suffix
    ? join(
        erc_src,
        host_number,
        "extensions",
        pascal_to_kebab(suffix),
      )
    : join(erc_src, host_number)
  return { source_file: filename, host_number, suffix, out_dir }
}

function signature_key(fn) {
  const param_types = fn.inputs.map((i) => i.type).join(",")
  return `${fn.name}(${param_types})`
}

run_forge_build()

const sources = readdirSync(join(contracts_dir, "src"))
  .filter((f) => f.endsWith(".sol"))
  .map((f) => f.replace(/\.sol$/, ""))
  .sort()

// Two-pass: process hosts first to build a per-host signature set. Then
// process extensions, subtracting their host's signatures so inherited
// methods don't duplicate (IERC20Burnable is IERC20 -> burn() only, not
// the full IERC20 surface).
const routes = sources
  .map((filename) => route_for(filename))
  .filter(Boolean)
const hosts = routes.filter((r) => !r.suffix)
const extensions = routes.filter((r) => r.suffix)

const host_signatures = new Map() // host_number -> Set<signature_key>
let processed = 0
const skipped = sources.length - routes.length
for (const f of sources) {
  if (classify_file(f) === "skip") {
    console.log(`  [skip] ${f}.sol (not an interface)`)
  }
}

// Tracks per-host the list of extension routes processed, so the host's
// top-level index.ts can re-export them at the end.
const host_extensions = new Map() // host_number -> Array<{ suffix, kebab }>

function process_route(route, host_set) {
  const { source_file, out_dir, host_number, suffix } = route
  mkdirSync(out_dir, { recursive: true })

  // Each route writes exactly one ABI file (named after the source file).
  // Wipe any stale `*.abi.json` first so a previous layout's leftovers
  // (e.g. the old `IERC<N>.abi.json` when the host has just been split
  // into per-interface files) don't linger.
  for (const entry of readdirSync(out_dir)) {
    if (entry.endsWith(".abi.json")) {
      rmSync(join(out_dir, entry))
    }
  }

  const abi = read_artifact_abi(source_file, source_file)
  writeFileSync(
    join(out_dir, `${source_file}.abi.json`),
    `${JSON.stringify(abi, null, 2)}\n`,
  )

  const seen = new Set()
  const functions = []
  for (const description of abi) {
    if (description.type !== "function") continue
    const key = signature_key(description)
    if (seen.has(key)) continue
    if (host_set?.has(key)) continue
    seen.add(key)
    functions.push(description)
  }

  if (!suffix) {
    host_signatures.set(
      host_number,
      new Set(functions.map(signature_key)),
    )
  } else {
    const list = host_extensions.get(host_number) ?? []
    list.push({ suffix, kebab: pascal_to_kebab(suffix) })
    host_extensions.set(host_number, list)
  }

  const methods_dir = join(out_dir, "methods")
  // Wipe methods/ before regen so orphaned files from earlier runs
  // (e.g. before the host-signature subtraction landed) don't linger.
  rmSync(methods_dir, { recursive: true, force: true })
  mkdirSync(methods_dir, { recursive: true })
  generate(functions, out_dir)
  writeFileSync(
    join(methods_dir, "index.ts"),
    `${functions
      .map(
        (f) =>
          `export * from "./${emit_file_basename_for(f, functions)}"`,
      )
      .join("\n")}\n`,
  )
  const rel = out_dir.slice(repo_root.length + 1)
  console.log(
    `  ${source_file} → ${rel}/  (${functions.length} methods)`,
  )
  processed++
}

for (const route of hosts) process_route(route, null)
for (const route of extensions) {
  process_route(
    route,
    host_signatures.get(route.host_number),
  )
}

// Discover hand-written sibling .ts files at the folder root (non-test,
// non-directory). These are spec content the autogen can't produce —
// e.g. erc/137 keeps `namehash.ts`, `registry.ts`, `get-ens-resolver.ts`,
// `normalize.ts` because EIP-137 specifies them but they aren't ABI
// methods. The convention: anything sitting next to `methods/` and
// `extensions/` is exported through the host barrel.
function discover_sibling_modules(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".test.ts") &&
        // `index.ts` IS the file we're regenerating here.
        // Re-exporting it from itself would loop.
        entry.name !== "index.ts",
    )
    .map((entry) => entry.name.slice(0, -".ts".length))
    .sort()
}

// Each folder ships exactly two files:
//   - index.ts  — spec-URL header + the actual exports (THIS is the
//                 implementation; `/erc/<n>/index.ts` answers
//                 "what implements ERC-<n>?")
//   - PAPER.md  — verbatim spec (left untouched by regen)
//
// Host folders include extension barrels and any hand-written sibling
// modules. Extension folders just re-export their methods.
for (const route of hosts) {
  const { host_number, out_dir } = route
  const extensions_for_host =
    host_extensions.get(host_number) ?? []
  const lines = [
    `// https://eips.ethereum.org/EIPS/eip-${host_number}`,
    "",
    `export * from "./methods"`,
  ]
  for (const { kebab } of extensions_for_host.sort(
    (a, b) => (a.kebab < b.kebab ? -1 : 1),
  )) {
    lines.push(`export * from "./extensions/${kebab}"`)
  }
  for (const basename of discover_sibling_modules(
    out_dir,
  )) {
    lines.push(`export * from "./${basename}"`)
  }
  writeFileSync(
    join(out_dir, "index.ts"),
    `${lines.join("\n")}\n`,
  )
}
for (const route of extensions) {
  const { out_dir } = route
  writeFileSync(
    join(out_dir, "index.ts"),
    `export * from "./methods"\n`,
  )
}

// Implicit hosts: host numbers that own extensions but no host .sol
// (e.g. IERC5564 lives in IERC5564Announcer.sol, so `5564/` itself has
// no IERC5564.sol — it routes through the extension). They still need
// their top-level `index.ts` regenerated so the extension barrel + any
// hand-written sibling modules are re-exported, and any stale
// `methods/` folder from a previous host-as-.sol layout is wiped.
const explicit_host_numbers = new Set(
  hosts.map((r) => r.host_number),
)
const implicit_host_numbers = [...host_extensions.keys()]
  .filter((n) => !explicit_host_numbers.has(n))
  .sort()
for (const host_number of implicit_host_numbers) {
  const out_dir = join(erc_src, host_number)
  const extensions_for_host =
    host_extensions.get(host_number) ?? []
  const stale_methods = join(out_dir, "methods")
  if (existsSync(stale_methods)) {
    rmSync(stale_methods, { recursive: true, force: true })
  }
  // Implicit hosts never own an ABI of their own — extensions write
  // theirs inside `extensions/<kebab>/`. Anything matching `*.abi.json`
  // at the host root is a leftover from a previous host-as-.sol layout.
  if (existsSync(out_dir)) {
    for (const entry of readdirSync(out_dir)) {
      if (entry.endsWith(".abi.json")) {
        rmSync(join(out_dir, entry))
      }
    }
  }
  const lines = [
    `// https://eips.ethereum.org/EIPS/eip-${host_number}`,
    "",
  ]
  for (const { kebab } of extensions_for_host.sort(
    (a, b) => (a.kebab < b.kebab ? -1 : 1),
  )) {
    lines.push(`export * from "./extensions/${kebab}"`)
  }
  for (const basename of discover_sibling_modules(out_dir)) {
    lines.push(`export * from "./${basename}"`)
  }
  writeFileSync(
    join(out_dir, "index.ts"),
    `${lines.join("\n")}\n`,
  )
  console.log(
    `  (implicit host) → ${out_dir.slice(repo_root.length + 1)}/index.ts  (extensions-only)`,
  )
}

console.log(
  `\ndone: ${processed} processed, ${skipped} skipped`,
)
