// Derivation script — downloads the Unicode UCD inputs we
// need to implement NFC and emits a single readable TS
// data module at `src/data/nfc.ts`.
//
// Inputs (public, hosted by unicode.org):
//   - UnicodeData.txt              (decompositions, ccc)
//   - CompositionExclusions.txt    (exclusions)
//
// Output:
//   - src/data/nfc.ts
//
// Rerun via `pnpm derive` when bumping UCD_VERSION below.

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
  type InferOutput,
  nullable,
  number,
  object,
} from "valibot"

const UCD_VERSION = "16.0.0"
const UCD_BASE = `https://www.unicode.org/Public/${UCD_VERSION}/ucd`

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(HERE, "..", "data", "nfc.ts")
const VECTORS_PATH = join(
  HERE,
  "..",
  "data",
  "nfc-vectors.ts",
)
const CACHE_DIR = join(HERE, ".cache")

const rowSchema = object({
  cp: number(),
  ccc: number(),
  decomp: nullable(array(number())),
})
type Row = InferOutput<typeof rowSchema>

function parse_unicode_data(_text: string): Row[] {
  const rows: Row[] = []
  for (const raw_line of _text.split("\n")) {
    const line = raw_line.trim()
    if (line.length === 0) continue
    const fields = line.split(";")
    const cp = Number.parseInt(fields[0] as string, 16)
    const ccc = Number.parseInt(fields[3] as string, 10)
    const decomp_field = (fields[5] as string).trim()
    let decomp: number[] | null = null
    if (decomp_field.length > 0) {
      // Skip compatibility decompositions (those tagged
      // like `<compat>`, `<font>`, etc.). NFC only uses
      // canonical decompositions.
      if (!decomp_field.startsWith("<")) {
        decomp = decomp_field
          .split(" ")
          .map((cp_hex) => Number.parseInt(cp_hex, 16))
      }
    }
    rows.push({ cp, ccc, decomp })
  }
  return rows
}

function parse_exclusions(_text: string): Set<number> {
  const out = new Set<number>()
  for (const raw_line of _text.split("\n")) {
    const line = raw_line.split("#")[0]?.trim() ?? ""
    if (line.length === 0) continue
    out.add(Number.parseInt(line, 16))
  }
  return out
}

function build_ccc_data(_rows: Row[]): number[] {
  const out: number[] = []
  for (const row of _rows) {
    if (row.ccc !== 0) {
      out.push(row.cp, row.ccc)
    }
  }
  return out
}

function build_decomp_data(_rows: Row[]): number[] {
  const out: number[] = []
  for (const row of _rows) {
    if (row.decomp === null) continue
    out.push(row.cp, row.decomp.length, ...row.decomp)
  }
  return out
}

function build_comp_data(
  _rows: Row[],
  _exclusions: Set<number>,
): number[] {
  const ccc_of = new Map<number, number>()
  for (const row of _rows) {
    if (row.ccc !== 0) ccc_of.set(row.cp, row.ccc)
  }
  const out: number[] = []
  for (const row of _rows) {
    if (row.decomp === null) continue
    // NFC composition only inverts decompositions that:
    //   1. are a length-2 sequence (excludes singletons)
    //   2. are not in the composition exclusions list
    //   3. do not start with a non-starter (those are
    //      "non-starter decompositions", also excluded)
    if (row.decomp.length !== 2) continue
    if (_exclusions.has(row.cp)) continue
    const [a, b] = row.decomp as [number, number]
    if ((ccc_of.get(a) ?? 0) !== 0) continue
    out.push(a, b, row.cp)
  }
  return out
}

function format_array(
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

function fetch_text(_url: string, _name: string): string {
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

const vectorSchema = object({
  source: array(number()),
  nfc: array(number()),
  nfd: array(number()),
})
type Vector = InferOutput<typeof vectorSchema>

function parse_cps(_field: string): number[] {
  const trimmed = _field.trim()
  if (trimmed.length === 0) return []
  return trimmed
    .split(/\s+/)
    .map((cp) => Number.parseInt(cp, 16))
}

function parse_normalization_test(_text: string): Vector[] {
  const out: Vector[] = []
  for (const raw_line of _text.split("\n")) {
    const without_comment = raw_line.split("#")[0] ?? ""
    const line = without_comment.trim()
    if (line.length === 0) continue
    if (line.startsWith("@")) continue
    const fields = line.split(";")
    if (fields.length < 5) continue
    out.push({
      source: parse_cps(fields[0] as string),
      nfc: parse_cps(fields[1] as string),
      nfd: parse_cps(fields[2] as string),
    })
  }
  return out
}

function format_vectors(_vectors: Vector[]): string {
  const lines: string[] = []
  for (const v of _vectors) {
    const src = v.source
      .map((cp) => `0x${cp.toString(16)}`)
      .join(",")
    const nfc = v.nfc
      .map((cp) => `0x${cp.toString(16)}`)
      .join(",")
    const nfd = v.nfd
      .map((cp) => `0x${cp.toString(16)}`)
      .join(",")
    lines.push(`  [[${src}],[${nfc}],[${nfd}]],`)
  }
  return [
    "export const NFC_VECTORS: readonly (readonly [",
    "  readonly number[],",
    "  readonly number[],",
    "  readonly number[],",
    "])[] = [",
    ...lines,
    "]",
  ].join("\n")
}

function main(): void {
  const unicode_data_text = fetch_text(
    `${UCD_BASE}/UnicodeData.txt`,
    "UnicodeData.txt",
  )
  const exclusions_text = fetch_text(
    `${UCD_BASE}/CompositionExclusions.txt`,
    "CompositionExclusions.txt",
  )
  const normalization_test_text = fetch_text(
    `${UCD_BASE}/NormalizationTest.txt`,
    "NormalizationTest.txt",
  )

  const rows = parse_unicode_data(unicode_data_text)
  const exclusions = parse_exclusions(exclusions_text)
  const vectors = parse_normalization_test(
    normalization_test_text,
  )

  const ccc_data = build_ccc_data(rows)
  const decomp_data = build_decomp_data(rows)
  const comp_data = build_comp_data(rows, exclusions)

  const header = [
    "// Auto-generated by src/derive/nfc.ts. DO NOT EDIT.",
    `// Source: Unicode UCD ${UCD_VERSION}`,
    "//   https://www.unicode.org/Public/" +
      UCD_VERSION +
      "/ucd/UnicodeData.txt",
    "//   https://www.unicode.org/Public/" +
      UCD_VERSION +
      "/ucd/CompositionExclusions.txt",
    "//",
    "// Layout:",
    "//   CCC_DATA    — flat pairs of (codepoint, ccc)",
    "//   DECOMP_DATA — packed (cp, len, ...sequence)",
    "//   COMP_DATA   — flat triples of (a, b, composed)",
    "// All values are decoded by src/nfc.ts at module load.",
  ].join("\n")

  const body = [
    header,
    "",
    `export const UCD_VERSION = "${UCD_VERSION}" as const`,
    "",
    format_array("CCC_DATA", ccc_data),
    "",
    format_array("DECOMP_DATA", decomp_data),
    "",
    format_array("COMP_DATA", comp_data),
    "",
  ].join("\n")

  mkdirSync(dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, body)

  const vectors_header = [
    "// Auto-generated by src/derive/nfc.ts. DO NOT EDIT.",
    `// Source: Unicode UCD ${UCD_VERSION}`,
    "//   https://www.unicode.org/Public/" +
      UCD_VERSION +
      "/ucd/NormalizationTest.txt",
    "//",
    "// Each row: [source, NFC(source), NFD(source)]",
    "",
  ].join("\n")
  writeFileSync(
    VECTORS_PATH,
    `${vectors_header}\n${format_vectors(vectors)}\n`,
  )

  const decomp_count = rows.filter(
    (r) => r.decomp !== null,
  ).length

  console.log(`wrote ${OUT_PATH}`)
  console.log(`  CCC entries:    ${ccc_data.length / 2}`)
  console.log(`  DECOMP entries: ${decomp_count}`)
  console.log(`  COMP entries:   ${comp_data.length / 3}`)
  console.log(`wrote ${VECTORS_PATH}`)
  console.log(`  vectors:        ${vectors.length}`)
}

try {
  main()
} catch (error: unknown) {
  console.error(error)
  process.exit(1)
}
