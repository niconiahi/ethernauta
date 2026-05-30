import { execFileSync } from "node:child_process"
import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { basename, dirname, join, resolve } from "node:path"
import {
  type Description,
  DescriptionSchema,
  to_selector,
} from "@ethernauta/abi"
import {
  emit_file_basename_for,
  emit_name_for,
  generate,
} from "@ethernauta/abi/generator"
import { type Bytes4, Bytes4Schema } from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  array,
  type InferOutput,
  object,
  parse,
  string,
} from "valibot"

function selector_hex(signature: string): Bytes4 {
  return parse(
    Bytes4Schema,
    bytes_to_hex(to_selector(signature)),
  )
}

function parse_flags(args: string[]) {
  let in_path: string | undefined
  let out_dir: string | undefined
  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string
    if (arg === "--in") {
      in_path = args[++i]
    } else if (arg === "--out") {
      out_dir = args[++i]
    }
  }
  if (!in_path || !out_dir) {
    throw new Error(
      "usage: ethernauta abi --in <path> --out <dir>",
    )
  }
  return {
    in_path: resolve(process.cwd(), in_path),
    out_dir: resolve(process.cwd(), out_dir),
  }
}

function load_abi(path: string): unknown[] {
  const raw = JSON.parse(readFileSync(path, "utf8"))
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw.abi)) return raw.abi
  throw new Error(
    `expected an ABI JSON array or a foundry artifact with an \`abi\` array at ${path}`,
  )
}

function is_solidity_source(path: string): boolean {
  return (
    path.endsWith(".abi") && !path.endsWith(".abi.json")
  )
}

function load_abi_source(path: string): Description[] {
  if (is_solidity_source(path)) {
    const contract_name = basename(path).replace(
      /\.abi$/,
      "",
    )
    const target = `${path}:${contract_name}`
    const stdout = execFileSync(
      "forge",
      ["inspect", target, "abi"],
      { encoding: "utf8" },
    )
    return parse(array(DescriptionSchema), JSON.parse(stdout))
  }
  return parse(array(DescriptionSchema), load_abi(path))
}

function signature_key(d: Description): string {
  if (d.type !== "function") return d.type
  const param_types = d.inputs.map((i) => i.type).join(",")
  return `${d.name}(${param_types})`
}

function _snake_or_kebab(name: string): string {
  if (name.includes("_")) return name
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
}

function dedupe_by_signature(
  descriptions: Description[],
): Description[] {
  const seen = new Set<string>()
  const out: Description[] = []
  for (const d of descriptions) {
    const key = signature_key(d)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(d)
  }
  return out
}

function write_barrel(
  out_dir: string,
  functions: Description[],
  generated_emit_names: Set<string>,
): void {
  const seen = new Set<string>()
  const lines: string[] = []
  for (const f of functions) {
    if (f.type !== "function") continue
    const js_name = emit_name_for(f, functions)
    if (seen.has(js_name)) continue
    if (!generated_emit_names.has(js_name)) continue
    seen.add(js_name)
    const file_basename = emit_file_basename_for(f, functions)
    lines.push(`export * from "./${file_basename}"`)
  }
  writeFileSync(
    join(out_dir, "methods", "index.ts"),
    `${lines.join("\n")}\n`,
  )
}

function is_generatable(d: Description): boolean {
  if (d.type !== "function") return false
  return true
}

function regenerate_one(source_path: string): void {
  const out_dir = dirname(source_path)
  const descriptions = load_abi_source(source_path)
  const functions = dedupe_by_signature(
    descriptions.filter((d) => d.type === "function"),
  )
  const generatable = functions.filter(is_generatable)
  const methods_dir = join(out_dir, "methods")
  if (existsSync(methods_dir)) {
    rmSync(methods_dir, { recursive: true, force: true })
  }
  const result = generate(generatable, out_dir)
  write_barrel(
    out_dir,
    generatable,
    new Set(result.generated),
  )
  console.log(
    `regenerated ${result.generated.length} methods into ${out_dir}/methods/`,
  )
  if (result.skipped.length > 0) {
    console.warn(
      `skipped ${result.skipped.length} method(s) in ${source_path}:`,
    )
    for (const s of result.skipped) {
      console.warn(`  - ${s.name}: ${s.reason}`)
    }
  }
}

export function execute_abi(args: string[]): void {
  if (args.length === 0) {
    execute_walk()
    return
  }
  const { in_path, out_dir } = parse_flags(args)
  const descriptions = load_abi_source(in_path)
  const functions = dedupe_by_signature(
    descriptions.filter((d) => d.type === "function"),
  )
  const generatable = functions.filter(is_generatable)
  const result = generate(generatable, out_dir)
  write_barrel(
    out_dir,
    generatable,
    new Set(result.generated),
  )
  console.log(
    `regenerated ${result.generated.length} methods into ${out_dir}/methods/`,
  )
  if (result.skipped.length > 0) {
    console.warn(
      `skipped ${result.skipped.length} method(s):`,
    )
    for (const s of result.skipped) {
      console.warn(`  - ${s.name}: ${s.reason}`)
    }
  }
}

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
])

function find_workspace_root(start: string): string {
  let dir = start
  while (true) {
    if (existsSync(join(dir, "pnpm-workspace.yaml"))) {
      return dir
    }
    const parent = dirname(dir)
    if (parent === dir) {
      throw new Error(
        `pnpm-workspace.yaml not found above ${start}`,
      )
    }
    dir = parent
  }
}

function discover_abi_sources(packages_root: string): string[] {
  const found: string[] = []
  const stack = [packages_root]
  while (stack.length > 0) {
    const dir = stack.pop()
    if (!dir) break
    for (const entry of readdirSync(dir, {
      withFileTypes: true,
    })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue
        stack.push(full)
        continue
      }
      if (entry.name.endsWith(".abi.json")) {
        found.push(full)
      } else if (entry.name.endsWith(".abi")) {
        found.push(full)
      }
    }
  }
  return found.sort()
}

function group_by_directory(
  sources: string[],
): Map<string, string[]> {
  const groups = new Map<string, string[]>()
  for (const source of sources) {
    const dir = dirname(source)
    const existing = groups.get(dir)
    if (existing) {
      existing.push(source)
    } else {
      groups.set(dir, [source])
    }
  }
  return groups
}

function ensure_forge_available(): void {
  try {
    execFileSync("forge", ["--version"], {
      stdio: ["ignore", "ignore", "ignore"],
    })
  } catch {
    throw new Error(
      "forge is required to compile .abi (Solidity) sources but was not found on PATH.\n" +
        "Install Foundry: curl -L https://foundry.paradigm.xyz | bash && foundryup",
    )
  }
}

export function execute_walk(): void {
  const root = find_workspace_root(process.cwd())
  const packages_root = join(root, "packages")
  if (!existsSync(packages_root)) {
    throw new Error(
      `packages/ not found at workspace root ${root}`,
    )
  }
  const sources = discover_abi_sources(packages_root)
  if (sources.length === 0) {
    console.log("no .abi.json or .abi files found under packages/")
    return
  }
  const groups = group_by_directory(sources)
  for (const [dir, files] of groups) {
    if (files.length > 1) {
      const names = files.map((f) => basename(f)).join(", ")
      throw new Error(
        `multiple ABI sources in ${dir}: ${names}. One ABI per folder — split each into its own subfolder.`,
      )
    }
  }
  const has_solidity = sources.some((s) =>
    is_solidity_source(s),
  )
  if (has_solidity) {
    ensure_forge_available()
  }
  for (const source of sources) {
    regenerate_one(source)
  }
}

function parse_registry_flags(args: string[]) {
  let in_dir: string | undefined
  let out_file: string | undefined
  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string
    if (arg === "--in") {
      in_dir = args[++i]
    } else if (arg === "--out") {
      out_file = args[++i]
    }
  }
  if (!in_dir || !out_file) {
    throw new Error(
      "usage: ethernauta registry --in <dir> --out <file>",
    )
  }
  return {
    in_dir: resolve(process.cwd(), in_dir),
    out_file: resolve(process.cwd(), out_file),
  }
}

function walk_abi_jsons(root: string): string[] {
  const found: string[] = []
  const stack = [root]
  while (stack.length > 0) {
    const dir = stack.pop() as string
    for (const entry of readdirSync(dir, {
      withFileTypes: true,
    })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
      } else if (entry.name.endsWith(".abi.json")) {
        found.push(full)
      }
    }
  }
  return found.sort()
}

const RegistryEntrySchema = object({
  signature: string(),
  name: string(),
  types: array(string()),
  param_names: array(string()),
  source: string(),
})
type RegistryEntry = InferOutput<typeof RegistryEntrySchema>

function collect_entries(
  files: string[],
  root: string,
): Map<Bytes4, RegistryEntry> {
  const out = new Map<Bytes4, RegistryEntry>()
  for (const file of files) {
    const raw = load_abi(file)
    const descriptions = parse(
      array(DescriptionSchema),
      raw,
    )
    for (const d of descriptions) {
      if (d.type !== "function") continue
      const types = d.inputs.map((i) => i.type)
      const param_names = d.inputs.map((i) => i.name)
      const signature = `${d.name}(${types.join(",")})`
      const selector = selector_hex(signature)
      const relative = file.startsWith(`${root}/`)
        ? file.slice(root.length + 1)
        : file
      const existing = out.get(selector)
      if (existing) {
        if (existing.signature !== signature) {
          throw new Error(
            `selector collision ${selector}: '${existing.signature}' (${existing.source}) vs '${signature}' (${relative})`,
          )
        }
        continue
      }
      out.set(selector, {
        signature,
        name: d.name,
        types,
        param_names,
        source: relative,
      })
    }
  }
  return out
}

function format_registry(
  entries: Map<Bytes4, RegistryEntry>,
): string {
  const sorted = Array.from(entries.entries()).sort(
    ([a], [b]) => (a < b ? -1 : a > b ? 1 : 0),
  )
  const rows = sorted.map(([selector, entry]) => {
    const types = entry.types
      .map((t) => JSON.stringify(t))
      .join(", ")
    const names = entry.param_names
      .map((n) => JSON.stringify(n))
      .join(", ")
    return `  ${JSON.stringify(selector)}: { name: ${JSON.stringify(entry.name)}, signature: ${JSON.stringify(entry.signature)}, types: [${types}], param_names: [${names}] },`
  })
  return `// AUTO-GENERATED — do not edit. Run \`pnpm --filter @ethernauta/erc generate\`.

export const REGISTRY = {
${rows.join("\n")}
} as const

export type RegistrySelector = keyof typeof REGISTRY
export type RegistryEntry = (typeof REGISTRY)[RegistrySelector]
`
}

export function execute_registry(args: string[]): void {
  const { in_dir, out_file } = parse_registry_flags(args)
  const files = walk_abi_jsons(in_dir)
  const entries = collect_entries(files, in_dir)
  writeFileSync(out_file, format_registry(entries))
  console.log(
    `wrote ${entries.size} registry entries from ${files.length} ABI JSONs to ${out_file}`,
  )
}
