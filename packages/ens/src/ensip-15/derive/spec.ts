// Derivation script — downloads ENS's canonical
// ENSIP-15 validation spec and emits typed TS data files.
//
// The source of truth for ENSIP-15 validation tables is
// adraffy/ens-normalize.js — the ENS Foundation
// references this as the reference normalizer. The
// `spec.json` and `nf.json` files in that repo are
// themselves derived from Unicode UCD (16.0) + ENSIP-15
// spec amendments via their `derive/` toolchain.
//
// We download those JSON files (MIT-licensed) as our data
// input and emit our own typed TS modules. The validation
// algorithm in `../normalize.ts` is implemented from the
// ENSIP-15 spec text, not from adraffy's code.

import { execSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  array,
  boolean,
  type InferOutput,
  literal,
  looseObject,
  number,
  object,
  optional,
  parse,
  string,
  tuple,
} from "valibot"

const SPEC_URL =
  "https://raw.githubusercontent.com/adraffy/ens-normalize.js/main/derive/output/spec.json"
const TESTS_URL =
  "https://raw.githubusercontent.com/adraffy/ens-normalize.js/main/validate/tests.json"

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(HERE, "..", "data", "spec.ts")
const TESTS_PATH = join(
  HERE,
  "..",
  "data",
  "ens-vectors.ts",
)
const CACHE_DIR = join(HERE, ".cache")

const rawSpecGroupSchema = object({
  name: string(),
  primary: array(number()),
  secondary: array(number()),
  cm: optional(array(number())),
  restricted: optional(boolean()),
})

const rawSpecWholeSchema = object({
  target: optional(string()),
  valid: array(number()),
  confused: array(number()),
})

const rawSpecSchema = object({
  created: string(),
  unicode: string(),
  cldr: string(),
  mapped: array(tuple([number(), array(number())])),
  ignored: array(number()),
  fenced: array(tuple([number(), string()])),
  nsm: array(number()),
  nsm_max: number(),
  cm: array(number()),
  emoji: array(array(number())),
  nfc_check: array(number()),
  groups: array(rawSpecGroupSchema),
  wholes: array(rawSpecWholeSchema),
})
type RawSpec = InferOutput<typeof rawSpecSchema>

function fetch_json(_url: string, _name: string): string {
  mkdirSync(CACHE_DIR, { recursive: true })
  const cache_path = join(CACHE_DIR, _name)
  if (!existsSync(cache_path)) {
    console.log(`fetching ${_url}`)
    execSync(`curl -sSL ${_url} -o ${cache_path}`, {
      stdio: "inherit",
    })
  } else {
    console.log(`cached  ${cache_path}`)
  }
  return readFileSync(cache_path, "utf8")
}

function format_flat(
  _name: string,
  _data: number[],
): string {
  const chunks: string[] = []
  const CHUNK = 12
  for (let i = 0; i < _data.length; i += CHUNK) {
    const slice = _data.slice(i, i + CHUNK)
    chunks.push(
      `  ${slice.map((n) => `0x${n.toString(16)}`).join(", ")},`,
    )
  }
  return `export const ${_name}: readonly number[] = [\n${chunks.join("\n")}\n]`
}

function format_mapped(
  _entries: [number, number[]][],
): string {
  const lines = _entries.map(
    ([cp, repl]) =>
      `  [0x${cp.toString(16)}, [${repl
        .map((r) => `0x${r.toString(16)}`)
        .join(",")}]],`,
  )
  return [
    "export const MAPPED: readonly (readonly [",
    "  number,",
    "  readonly number[],",
    "])[] = [",
    ...lines,
    "]",
  ].join("\n")
}

function format_fenced(
  _entries: [number, string][],
): string {
  const lines = _entries.map(
    ([cp, name]) =>
      `  [0x${cp.toString(16)}, ${JSON.stringify(name)}],`,
  )
  return [
    "export const FENCED: readonly (readonly [",
    "  number,",
    "  string,",
    "])[] = [",
    ...lines,
    "]",
  ].join("\n")
}

function format_emoji(_seqs: number[][]): string {
  const lines = _seqs.map(
    (seq) =>
      `  [${seq.map((cp) => `0x${cp.toString(16)}`).join(",")}],`,
  )
  return [
    "export const EMOJI: readonly (readonly number[])[] = [",
    ...lines,
    "]",
  ].join("\n")
}

function format_groups(_groups: RawSpec["groups"]): string {
  const lines: string[] = []
  for (const g of _groups) {
    const primary = g.primary
      .map((c) => `0x${c.toString(16)}`)
      .join(",")
    const secondary = g.secondary
      .map((c) => `0x${c.toString(16)}`)
      .join(",")
    const cm = (g.cm ?? [])
      .map((c) => `0x${c.toString(16)}`)
      .join(",")
    lines.push(
      `  { name: ${JSON.stringify(g.name)}, primary: [${primary}], secondary: [${secondary}], cm: [${cm}], restricted: ${
        g.restricted ?? false
      } },`,
    )
  }
  return [
    `import { array, boolean, type InferOutput, number, object, string } from "valibot"`,
    "",
    "export const groupSchema = object({",
    "  name: string(),",
    "  primary: array(number()),",
    "  secondary: array(number()),",
    "  cm: array(number()),",
    "  restricted: boolean(),",
    "})",
    "export type Group = InferOutput<typeof groupSchema>",
    "",
    "export const GROUPS: readonly Group[] = [",
    ...lines,
    "]",
  ].join("\n")
}

function format_wholes(_wholes: RawSpec["wholes"]): string {
  const lines: string[] = []
  for (const w of _wholes) {
    const valid = w.valid
      .map((c) => `0x${c.toString(16)}`)
      .join(",")
    const confused = w.confused
      .map((c) => `0x${c.toString(16)}`)
      .join(",")
    const target = w.target
      ? JSON.stringify(w.target)
      : "null"
    lines.push(
      `  { target: ${target}, valid: [${valid}], confused: [${confused}] },`,
    )
  }
  return [
    "export const wholeSchema = object({",
    "  target: nullable(string()),",
    "  valid: array(number()),",
    "  confused: array(number()),",
    "})",
    "export type Whole = InferOutput<typeof wholeSchema>",
    "",
    "export const WHOLES: readonly Whole[] = [",
    ...lines,
    "]",
  ].join("\n")
}

// Three-shape union (error case / norm case / version marker
// record). Uses looseObject so the version-marker record passes
// even when it has none of the known keys.
const rawTestSchema = looseObject({
  name: optional(string()),
  error: optional(literal(true)),
  norm: optional(string()),
  comment: optional(string()),
})
type RawTest = InferOutput<typeof rawTestSchema>

function format_tests(_tests: RawTest[]): string {
  const lines: string[] = []
  for (const t of _tests) {
    if (typeof t.name !== "string") continue
    const name = JSON.stringify(t.name)
    if ((t as { error?: true }).error === true) {
      lines.push(`  { name: ${name}, error: true },`)
    } else {
      const norm_value = (t as { norm?: string }).norm
      const norm = JSON.stringify(
        norm_value === undefined ? t.name : norm_value,
      )
      lines.push(`  { name: ${name}, norm: ${norm} },`)
    }
  }
  return [
    `import { boolean, type InferOutput, literal, object, string, variant } from "valibot"`,
    "",
    "const ensErrorTestSchema = object({",
    "  name: string(),",
    "  error: literal(true),",
    "})",
    "const ensNormTestSchema = object({",
    "  name: string(),",
    "  norm: string(),",
    "})",
    `export const ensTestSchema = variant("name", [`,
    "  ensErrorTestSchema,",
    "  ensNormTestSchema,",
    "])",
    "export type EnsTest = InferOutput<typeof ensTestSchema>",
    "",
    "export const ENS_TESTS: readonly EnsTest[] = [",
    ...lines,
    "]",
  ].join("\n")
}

function main(): void {
  const spec_text = fetch_json(SPEC_URL, "spec.json")
  const spec = parse(rawSpecSchema, JSON.parse(spec_text))
  const tests_text = fetch_json(TESTS_URL, "tests.json")
  const tests = parse(
    array(rawTestSchema),
    JSON.parse(tests_text),
  )

  const header = [
    "// Auto-generated by src/derive/spec.ts. DO NOT EDIT.",
    "//",
    `// Source:        ENSIP-15 reference data, ${spec.created}`,
    `// Unicode:       ${spec.unicode}`,
    `// CLDR:          ${spec.cldr}`,
    `// Upstream JSON: ${SPEC_URL}`,
    "//",
    "// The upstream JSON itself is derived from public",
    "// Unicode UCD + the ENSIP-15 spec text. We re-emit it",
    "// as typed TS so consumers ship readable data, not",
    "// opaque blobs. Validation algorithm lives in",
    "// ../normalize.ts and is written from the spec.",
  ].join("\n")

  const body = [
    header,
    "",
    `export const SPEC_CREATED = ${JSON.stringify(spec.created)} as const`,
    `export const SPEC_UNICODE = ${JSON.stringify(spec.unicode)} as const`,
    "",
    `export const NSM_MAX = ${spec.nsm_max} as const`,
    "",
    format_flat("IGNORED", spec.ignored),
    "",
    format_flat("NSM", spec.nsm),
    "",
    format_flat("ALL_CM", spec.cm),
    "",
    format_flat("NFC_CHECK", spec.nfc_check),
    "",
    format_mapped(spec.mapped),
    "",
    format_fenced(spec.fenced),
    "",
    format_emoji(spec.emoji),
    "",
    format_groups(spec.groups),
    "",
    format_wholes(spec.wholes),
    "",
  ].join("\n")

  mkdirSync(dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, body)

  const tests_header = [
    "// Auto-generated by src/derive/spec.ts. DO NOT EDIT.",
    "//",
    `// Source: ${TESTS_URL}`,
    "//",
    "// ENS official validation suite. Each entry either",
    "// expects a normalised output or expects an error.",
  ].join("\n")
  writeFileSync(
    TESTS_PATH,
    `${tests_header}\n\n${format_tests(tests)}\n`,
  )

  console.log(`wrote ${OUT_PATH}`)
  console.log(`  mapped:  ${spec.mapped.length}`)
  console.log(`  ignored: ${spec.ignored.length}`)
  console.log(`  fenced:  ${spec.fenced.length}`)
  console.log(`  emoji:   ${spec.emoji.length}`)
  console.log(`  groups:  ${spec.groups.length}`)
  console.log(`  cm:      ${spec.cm.length}`)
  console.log(`  nsm:     ${spec.nsm.length}`)
  console.log(`  wholes:  ${spec.wholes.length}`)
  console.log(`wrote ${TESTS_PATH}`)
  console.log(`  tests:   ${tests.length}`)
}

try {
  main()
} catch (error: unknown) {
  console.error(error)
  process.exit(1)
}
