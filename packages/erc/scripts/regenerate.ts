// Regenerate ERC interface ABIs + method bindings from the Foundry workspace.
//
// Run: bun packages/erc/scripts/regenerate.ts
//
// DEPRECATED: superseded by `@ethernauta/cli`'s walker mode
// (`ethernauta abi` with no flags). The walker discovers
// packages/**/*.abi.json + packages/**/*.abi and regenerates
// methods/ next to each ABI source. This script's source-of-truth
// directory (`contracts/src/I*.sol`) was dissolved in phase 01 — the
// .sol files now live colocated inside their matching package folder.
// Kept for historical reference; do not invoke until rewritten to
// walk the new colocated layout.
//
//   packages/erc/src/20/IERC20.sol           (// eip-20)
//   packages/erc/src/20/extensions/burnable/IERC20Burnable.sol
//   packages/erc/src/1155/extensions/metadata-uri/IERC1155MetadataURI.sol
//   packages/erc/src/137/extensions/resolver/IERC137Resolver.sol
//   packages/erc/src/7683/extensions/origin-settler/IOriginSettler.sol
//   packages/erc/src/7683/extensions/destination-settler/IDestinationSettler.sol
//
// Files with no spec-link comment are skipped only when they declare a
// `contract` (implementation) or no top-level declaration at all. Any
// file declaring an `interface` without a spec link is a hard error so a
// missing header can't silently drop an interface from the binding tree.
//
// Outputs (all overwritten on every run):
//   - <out>/<InterfaceName>.abi.json — extracted ABI array
//   - <out>/methods/<method>.ts      — generated bindings
//   - <out>/methods/index.ts         — barrel
//
// Test contract: every routing rule, convention error, and composer change
// MUST land with a fixture or unit test in `regenerate.test.ts` that
// exercises it. Pure helpers are exported below so tests can drive them
// without the full filesystem orchestration.

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
  type _Function,
  type Description,
  DescriptionSchema,
} from "@ethernauta/abi"
import {
  emit_file_basename_for,
  generate,
} from "@ethernauta/abi/generator"
import {
  array,
  type InferOutput,
  object,
  parse,
  picklist,
  string,
} from "valibot"

export const SPEC_LINK_RE =
  /^\/\/\s*https:\/\/eips\.ethereum\.org\/EIPS\/eip-(\d+)\s*$/m
export const INTERFACE_DECL_RE = /^interface\s+\w/m
export const CONTRACT_DECL_RE = /^contract\s+\w/m

const ClassificationSchema = picklist(["interface", "skip"])
export type Classification = InferOutput<
  typeof ClassificationSchema
>

const RouteSchema = object({
  source_file: string(),
  host_number: string(),
  suffix: string(),
  out_dir: string(),
})
export type Route = InferOutput<typeof RouteSchema>

const ForgeArtifactSchema = object({
  abi: array(DescriptionSchema),
})

const PathsSchema = object({
  contracts_dir: string(),
  forge_out: string(),
  erc_src: string(),
})
export type Paths = InferOutput<typeof PathsSchema>

const __dirname = dirname(fileURLToPath(import.meta.url))
const repo_root = resolve(__dirname, "../../..")

export function default_paths(): Paths {
  return parse(PathsSchema, {
    contracts_dir: join(repo_root, "contracts"),
    forge_out: join(repo_root, "contracts/out"),
    erc_src: join(repo_root, "packages/erc/src"),
  })
}

export function pascal_to_kebab(s: string): string {
  // "MetadataURI" -> "metadata-uri", "Burnable" -> "burnable"
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
}

export function signature_key(fn: _Function): string {
  const param_types = fn.inputs.map((i) => i.type).join(",")
  return `${fn.name}(${param_types})`
}

export function parse_spec_link(
  source: string,
): string | null {
  const match = SPEC_LINK_RE.exec(source)
  if (!match) return null
  return match[1] ?? null
}

export function derive_suffix(
  filename: string,
  host_number: string,
): string {
  const ierc_prefix = `IERC${host_number}`
  if (filename.startsWith(ierc_prefix)) {
    return filename.slice(ierc_prefix.length)
  }
  return filename.slice(1)
}

export function classify_source(
  filename: string,
  source: string,
): Classification {
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
  const has_interface = INTERFACE_DECL_RE.test(source)
  const has_contract = CONTRACT_DECL_RE.test(source)
  if (has_interface && has_contract) {
    throw new Error(
      `${filename}.sol declares both an \`interface\` and a \`contract\`. ` +
        "Split into separate files so each one is routable or skippable on its own.",
    )
  }
  if (has_interface && !starts_with_i) {
    throw new Error(
      `${filename}.sol declares an interface but its basename does not start ` +
        "with \`I\`. Rename the file (and the interface) to follow the Solidity convention.",
    )
  }
  if (has_contract && starts_with_i) {
    throw new Error(
      `${filename}.sol's basename starts with \`I\` (interface convention) but ` +
        "the file declares a \`contract\`. Either rename to drop the \`I\` prefix " +
        "or restructure the file as an interface.",
    )
  }
  if (!has_interface) return "skip"
  return "interface"
}

function read_source(
  contracts_dir: string,
  filename: string,
): string {
  return readFileSync(
    join(contracts_dir, "src", `${filename}.sol`),
    "utf8",
  )
}

export function classify_file(
  contracts_dir: string,
  filename: string,
): Classification {
  return classify_source(
    filename,
    read_source(contracts_dir, filename),
  )
}

export function route_for(
  paths: Paths,
  filename: string,
): Route | null {
  // Returns a Route or null when the file is not a routable interface.
  //   1. classify_source → interface | skip | (throws on convention break).
  //   2. parse_spec_link → hard error if missing on an interface file
  //      (every routed file must declare which EIP it implements).
  //   3. derive_suffix:
  //      - starts with `IERC<host_number>` → strip → suffix.
  //      - starts with `I` only → strip the `I` → suffix.
  //      - Empty suffix → host route; non-empty → extension route.
  const source = read_source(paths.contracts_dir, filename)
  if (classify_source(filename, source) === "skip")
    return null
  const host_number = parse_spec_link(source)
  if (!host_number) {
    throw new Error(
      `${filename}.sol declares an interface but has no ` +
        "\`// https://eips.ethereum.org/EIPS/eip-<N>\` header.",
    )
  }
  const suffix = derive_suffix(filename, host_number)
  const out_dir = suffix
    ? join(
        paths.erc_src,
        host_number,
        "extensions",
        pascal_to_kebab(suffix),
      )
    : join(paths.erc_src, host_number)
  return {
    source_file: filename,
    host_number,
    suffix,
    out_dir,
  }
}

export function read_artifact_abi(
  forge_out: string,
  source_file: string,
  interface_name: string,
): { abi: Description[]; functions: _Function[] } {
  // Pulled out as a public helper so tests can assert the "missing
  // artifact" error message references the resolved path. Returns both
  // the raw abi (events + functions + everything — written to disk) and
  // the function-only filtered list (fed into the binding generator).
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
  const artifact = parse(
    ForgeArtifactSchema,
    JSON.parse(readFileSync(path, "utf8")),
  )
  const functions: _Function[] = []
  for (const description of artifact.abi) {
    if (description.type === "function")
      functions.push(description)
  }
  return { abi: artifact.abi, functions }
}

export function discover_sibling_modules(
  dir: string,
): string[] {
  // Hand-written sibling .ts files at a host folder root (non-test,
  // non-directory). These are spec content the autogen can't produce —
  // e.g. erc/137 keeps `namehash.ts`, `registry.ts`, `get-ens-resolver.ts`,
  // `normalize.ts` because EIP-137 specifies them but they aren't ABI
  // methods. The convention: anything sitting next to `methods/` and
  // `extensions/` is exported through the host barrel.
  if (!existsSync(dir)) return []
  const names: string[] = []
  for (const entry of readdirSync(dir, {
    withFileTypes: true,
  })) {
    if (!entry.isFile()) continue
    if (!entry.name.endsWith(".ts")) continue
    if (entry.name.endsWith(".test.ts")) continue
    // `index.ts` IS the file we're regenerating here.
    // Re-exporting it from itself would loop.
    if (entry.name === "index.ts") continue
    names.push(entry.name.slice(0, -".ts".length))
  }
  return names.sort()
}

export function run_forge_build(
  contracts_dir: string,
): void {
  console.log("→ forge build")
  execFileSync("forge", ["build"], {
    cwd: contracts_dir,
    stdio: "inherit",
  })
}

const RegenerateOptionsSchema = object({
  paths: PathsSchema,
})

export function regenerate(input?: {
  paths?: Paths
  skip_forge_build?: boolean
  quiet?: boolean
}): void {
  const opts = parse(RegenerateOptionsSchema, {
    paths: input?.paths ?? default_paths(),
  })
  const { contracts_dir, forge_out, erc_src } = opts.paths
  const quiet = input?.quiet ?? false
  const log = (msg: string) => {
    if (!quiet) console.log(msg)
  }

  if (!input?.skip_forge_build)
    run_forge_build(contracts_dir)

  const sources = readdirSync(join(contracts_dir, "src"))
    .filter((f) => f.endsWith(".sol"))
    .map((f) => f.replace(/\.sol$/, ""))
    .sort()

  // Two-pass: process hosts first to build a per-host signature set. Then
  // process extensions, subtracting their host's signatures so inherited
  // methods don't duplicate (IERC20Burnable is IERC20 -> burn() only, not
  // the full IERC20 surface).
  const routes: Route[] = []
  for (const filename of sources) {
    const route = route_for(opts.paths, filename)
    if (route) routes.push(route)
  }
  const hosts = routes.filter((r) => !r.suffix)
  const extensions = routes.filter((r) => r.suffix)

  const host_signatures = new Map<string, Set<string>>()
  const host_extensions = new Map<
    string,
    { suffix: string; kebab: string }[]
  >()
  let processed = 0
  const skipped = sources.length - routes.length
  for (const f of sources) {
    if (classify_file(contracts_dir, f) === "skip") {
      log(`  [skip] ${f}.sol (not an interface)`)
    }
  }

  function process_route(
    route: Route,
    host_set: Set<string> | null,
  ): void {
    const { source_file, out_dir, host_number, suffix } =
      route
    mkdirSync(out_dir, { recursive: true })

    // Each route writes exactly one ABI file (named after the source
    // file). Wipe any stale `*.abi.json` first so a previous layout's
    // leftovers (e.g. the old `IERC<N>.abi.json` when the host has just
    // been split into per-interface files) don't linger.
    for (const entry of readdirSync(out_dir)) {
      if (entry.endsWith(".abi.json")) {
        rmSync(join(out_dir, entry))
      }
    }

    const { abi, functions } = read_artifact_abi(
      forge_out,
      source_file,
      source_file,
    )
    writeFileSync(
      join(out_dir, `${source_file}.abi.json`),
      `${JSON.stringify(abi, null, 2)}\n`,
    )

    const seen = new Set<string>()
    const unique_functions: _Function[] = []
    for (const fn of functions) {
      const key = signature_key(fn)
      if (seen.has(key)) continue
      if (host_set?.has(key)) continue
      seen.add(key)
      unique_functions.push(fn)
    }

    if (!suffix) {
      host_signatures.set(
        host_number,
        new Set(unique_functions.map(signature_key)),
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
    generate(unique_functions, out_dir)
    writeFileSync(
      join(methods_dir, "index.ts"),
      `${unique_functions
        .map(
          (f) =>
            `export * from "./${emit_file_basename_for(f, unique_functions)}"`,
        )
        .join("\n")}\n`,
    )
    const rel = out_dir.startsWith(repo_root)
      ? out_dir.slice(repo_root.length + 1)
      : out_dir
    log(
      `  ${source_file} → ${rel}/  (${unique_functions.length} methods)`,
    )
    processed++
  }

  for (const route of hosts) process_route(route, null)
  for (const route of extensions) {
    process_route(
      route,
      host_signatures.get(route.host_number) ?? null,
    )
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
    const lines: string[] = [
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
  const implicit_host_numbers: string[] = []
  for (const n of host_extensions.keys()) {
    if (!explicit_host_numbers.has(n))
      implicit_host_numbers.push(n)
  }
  implicit_host_numbers.sort()
  for (const host_number of implicit_host_numbers) {
    const out_dir = join(erc_src, host_number)
    const extensions_for_host =
      host_extensions.get(host_number) ?? []
    const stale_methods = join(out_dir, "methods")
    if (existsSync(stale_methods)) {
      rmSync(stale_methods, {
        recursive: true,
        force: true,
      })
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
    const lines: string[] = [
      `// https://eips.ethereum.org/EIPS/eip-${host_number}`,
      "",
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
    const rel = out_dir.startsWith(repo_root)
      ? out_dir.slice(repo_root.length + 1)
      : out_dir
    log(
      `  (implicit host) → ${rel}/index.ts  (extensions-only)`,
    )
  }

  log(`\ndone: ${processed} processed, ${skipped} skipped`)
}

if (
  process.argv[1] !== undefined &&
  process.argv[1] === fileURLToPath(import.meta.url)
) {
  regenerate()
}
