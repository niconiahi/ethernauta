// Test-only helpers: load the c-kzg-4844 trusted_setup.txt format and
// the EF consensus-spec-tests YAML cases.
//
// NOT bundled — used only by *.test.ts files under packages/eip/.
import {
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs"
import { join } from "node:path"

import {
  array,
  type InferOutput,
  nullable,
  object,
  record,
  string,
  union,
} from "valibot"

import {
  init_kzg,
  type Kzg,
  type TrustedSetup,
} from "./setup"

// Parse the c-kzg-4844 trusted_setup.txt. Layout (verified against
// `load_trusted_setup_file` in c-kzg-4844/src/setup/setup.c):
//   line 1:                "4096"               G1 count
//   line 2:                "65"                 G2 count
//   lines 3..4098:         4096 G1 Lagrange-BRP (48 bytes each)
//   lines 4099..4163:      65 G2 monomial      (96 bytes each)
//   lines 4164..8259:      4096 G1 monomial    (trailing, unused here)
export function load_kzg_from_txt(_path: string): Kzg {
  const text = readFileSync(_path, "utf8")
  const lines = text.split("\n").filter((l) => l.length > 0)
  const g1_count = Number.parseInt(lines[0] as string, 10)
  const g2_count = Number.parseInt(lines[1] as string, 10)
  const g1_start = 2
  const g2_start = g1_start + g1_count
  const setup: TrustedSetup = {
    g1_lagrange: lines
      .slice(g1_start, g1_start + g1_count)
      .map((h) => `0x${h}` as `0x${string}`),
    g2_monomial: lines
      .slice(g2_start, g2_start + g2_count)
      .map((h) => `0x${h}` as `0x${string}`),
  }
  return init_kzg(setup)
}

// Minimal YAML extractor for the flat EF test format:
//   input:
//     <key>: '<value>'
//     <key>: '<value>'
//   output: '<value>' | null
//   output:
//     - '<value>'
//     - '<value>'
//
// Returns { input: {...}, output: string | null | string[] }.
export const kzgCaseSchema = object({
  input: record(string(), union([string(), array(string())])),
  output: nullable(union([string(), array(string())])),
})
export type KzgCase = InferOutput<typeof kzgCaseSchema>
export function parse_kzg_yaml(_path: string): KzgCase {
  const text = readFileSync(_path, "utf8")
  const lines = text.split("\n")
  const input: Record<string, string | string[]> = {}
  let output: string | null | string[] = null
  let section: "input" | "output" | null = null
  let current_array_key: string | null = null
  let current_array: string[] = []
  let output_is_array = false
  const flush_array = () => {
    if (current_array_key && section === "input") {
      input[current_array_key] = current_array
    }
    current_array_key = null
    current_array = []
  }
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.length === 0) continue
    if (line === "input:") {
      flush_array()
      section = "input"
      continue
    }
    if (line.startsWith("output:")) {
      flush_array()
      section = "output"
      const after = line.slice("output:".length).trim()
      if (after === "" || after === "|") {
        output_is_array = true
        output = []
      } else if (after === "null" || after === "~") {
        output = null
      } else {
        output = unquote(after)
      }
      continue
    }
    if (section === "input") {
      const m = line.match(/^ {2}([^:]+):\s*(.*)$/)
      if (m) {
        flush_array()
        const [, key, value] = m
        const trimmed = (value as string).trim()
        if (trimmed === "" || trimmed === "|") {
          current_array_key = key as string
          current_array = []
        } else if (trimmed === "[]") {
          input[key as string] = []
        } else {
          input[key as string] = unquote(trimmed)
        }
        continue
      }
      const arr = line.match(/^ {2}-\s*(.*)$/)
      if (arr) {
        current_array.push(
          unquote((arr[1] as string).trim()),
        )
      }
      continue
    }
    if (section === "output" && output_is_array) {
      const arr = line.match(/^-\s*(.*)$/)
      if (arr) {
        ;(output as string[]).push(
          unquote((arr[1] as string).trim()),
        )
      }
    }
  }
  flush_array()
  return { input, output }
}

function unquote(_s: string): string {
  const s = _s.trim()
  if (
    (s.startsWith("'") && s.endsWith("'")) ||
    (s.startsWith('"') && s.endsWith('"'))
  ) {
    return s.slice(1, -1)
  }
  return s
}

// Enumerate `<dir>/<case_name>/data.yaml` cases.
export function list_kzg_cases(
  _dir: string,
): { name: string; path: string }[] {
  const out: { name: string; path: string }[] = []
  let entries: string[]
  try {
    entries = readdirSync(_dir)
  } catch {
    return out
  }
  for (const name of entries) {
    const path = join(_dir, name, "data.yaml")
    try {
      if (statSync(path).isFile()) {
        out.push({ name, path })
      }
    } catch {
      // skip
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}
