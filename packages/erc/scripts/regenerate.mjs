// Regenerate ERC interface ABIs + method bindings from the Foundry workspace.
//
// Run: bun packages/erc/scripts/regenerate.mjs
//
// Source of truth: `contracts/src/IERC<N>[<Suffix>].sol` files compiled by
// Foundry. Routing is 100% convention-driven from the filename:
//
//   contracts/src/IERC<N>.sol            -> packages/erc/src/<N>/
//   contracts/src/IERC<N><Suffix>.sol    -> packages/erc/src/<N>/extensions/<suffix>/
//
//   <suffix> is converted from PascalCase to kebab-case. Examples:
//     IERC20.sol            -> packages/erc/src/20/
//     IERC20Burnable.sol    -> packages/erc/src/20/extensions/burnable/
//     IERC20Metadata.sol    -> packages/erc/src/20/extensions/metadata/
//     IERC1155MetadataURI.sol -> packages/erc/src/1155/extensions/metadata-uri/
//     IERC137.sol           -> packages/erc/src/137/
//     IERC137Resolver.sol   -> packages/erc/src/137/extensions/resolver/
//     IERC2304.sol          -> packages/erc/src/2304/
//
// `IERC7683.sol` is a multi-interface file (IOriginSettler +
// IDestinationSettler). The route is still derived from the filename
// (`packages/erc/src/7683/`), and ABIs from BOTH interfaces are merged into
// the host folder. Methods are deduped by signature.
//
// Outputs (all overwritten on every run):
//   - <out>/<InterfaceName>.abi.json — extracted ABI array per interface
//   - <out>/methods/<method>.ts      — generated bindings
//   - <out>/methods/index.ts         — barrel
//
// Skip list (need follow-up; the abi generator doesn't yet handle dynamic
// array types like `address[]` / `uint256[]`):
//   - IERC1155.sol (balanceOfBatch, safeBatchTransferFrom)
//   - IERC1155MetadataURI.sol (depends on 1155 being skipped to stay coherent)

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

import {
  emit_file_basename_for,
  generate,
} from "../../abi/src/generator/generator.ts"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repo_root = resolve(__dirname, "../../..")
const contracts_dir = join(repo_root, "contracts")
const forge_out = join(contracts_dir, "out")
const erc_src = join(repo_root, "packages/erc/src")

// Interfaces blocked on the generator gaining type support it doesn't yet
// have. ERC-1155 needs dynamic arrays (`address[]`, `uint256[]`). ERC-7683
// needs Solidity structs (encoded as ABI `tuple`s). Add `array` + `tuple`
// support to packages/abi/src/generator/generator.ts and remove these.
const SKIP_INTERFACES = new Set([
  "IERC1155",
  "IERC1155MetadataURI",
  "IERC7683",
  "IOriginSettler",
  "IDestinationSettler",
])

// Map from "host interface name with no suffix" to "set of extra interfaces
// whose ABIs merge into the same `methods/` folder". Today only IERC7683's
// two interfaces co-locate in one .sol file.
const MULTI_INTERFACE_FILES = {
  IERC7683: ["IOriginSettler", "IDestinationSettler"],
}

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

function route_for(filename) {
  // filename without ".sol". Returns { source_file, host_number, suffix, out_dir, interfaces }.
  // Skips non-IERC files. Skips files in SKIP_INTERFACES.
  const match = /^IERC(\d+)(.*)$/.exec(filename)
  if (!match) return null
  const host_number = match[1]
  const suffix = match[2] // possibly empty
  const source_file = filename
  const out_dir = suffix
    ? join(erc_src, host_number, "extensions", pascal_to_kebab(suffix))
    : join(erc_src, host_number)
  const interfaces =
    MULTI_INTERFACE_FILES[source_file] ?? [source_file]
  if (interfaces.some((i) => SKIP_INTERFACES.has(i))) return null
  return {
    source_file,
    host_number,
    suffix,
    out_dir,
    interfaces,
  }
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
let skipped =
  sources.filter(
    (f) => f.startsWith("IERC") && !route_for(f),
  ).length

for (const f of sources) {
  if (f.startsWith("IERC") && !route_for(f)) {
    console.log(`  [skip] ${f}.sol (in SKIP_INTERFACES)`)
  }
}

// Tracks per-host the list of extension routes processed, so the host's
// top-level index.ts can re-export them at the end.
const host_extensions = new Map() // host_number -> Array<{ suffix, kebab }>

function process_route(route, host_set) {
  const { source_file, out_dir, interfaces, host_number, suffix } = route
  mkdirSync(out_dir, { recursive: true })

  for (const interface_name of interfaces) {
    const abi = read_artifact_abi(source_file, interface_name)
    writeFileSync(
      join(out_dir, `${interface_name}.abi.json`),
      `${JSON.stringify(abi, null, 2)}\n`,
    )
  }

  const seen = new Set()
  const functions = []
  for (const interface_name of interfaces) {
    const abi = read_artifact_abi(source_file, interface_name)
    for (const description of abi) {
      if (description.type !== "function") continue
      const key = signature_key(description)
      if (seen.has(key)) continue
      if (host_set && host_set.has(key)) continue
      seen.add(key)
      functions.push(description)
    }
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
  process_route(route, host_signatures.get(route.host_number))
}

// Write each folder's top-level index.ts. Host folders include extension
// barrels; extension folders just re-export their methods.
for (const route of hosts) {
  const { host_number, out_dir } = route
  const extensions_for_host =
    host_extensions.get(host_number) ?? []
  const lines = [
    `// https://eips.ethereum.org/EIPS/eip-${host_number}`,
    "",
    `export * from "./methods"`,
  ]
  for (const { kebab } of extensions_for_host.sort((a, b) =>
    a.kebab < b.kebab ? -1 : 1,
  )) {
    lines.push(`export * from "./extensions/${kebab}/methods"`)
  }
  writeFileSync(join(out_dir, "index.ts"), `${lines.join("\n")}\n`)
}
for (const route of extensions) {
  const { out_dir } = route
  writeFileSync(
    join(out_dir, "index.ts"),
    `export * from "./methods"\n`,
  )
}

console.log(`\ndone: ${processed} processed, ${skipped} skipped`)
