import {
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { join, resolve } from "node:path"
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
import {
  type Bytes4,
  bytes4Schema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  array,
  type InferOutput,
  object,
  parse,
  string,
} from "valibot"

function selector_hex(signature: string): Bytes4 {
  return parse(bytes4Schema, bytes_to_hex(to_selector(signature)))
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
): void {
  const seen = new Set<string>()
  const lines: string[] = []
  for (const f of functions) {
    if (f.type !== "function") continue
    const js_name = emit_name_for(f, functions)
    if (seen.has(js_name)) continue
    seen.add(js_name)
    const basename = emit_file_basename_for(f, functions)
    lines.push(`export { ${js_name} } from "./${basename}"`)
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

export function execute_abi(args: string[]): void {
  const { in_path, out_dir } = parse_flags(args)
  const raw = load_abi(in_path)
  const descriptions = parse(array(DescriptionSchema), raw)
  const functions = dedupe_by_signature(
    descriptions.filter((d) => d.type === "function"),
  )
  const generatable = functions.filter(is_generatable)
  generate(generatable, out_dir)
  write_barrel(out_dir, generatable)
  console.log(
    `regenerated ${generatable.length} methods into ${out_dir}/methods/`,
  )
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

const registryEntrySchema = object({
  signature: string(),
  name: string(),
  types: array(string()),
  param_names: array(string()),
  source: string(),
})
type RegistryEntry = InferOutput<typeof registryEntrySchema>

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
