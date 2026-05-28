#!/usr/bin/env node
// Extracts every fenced ts/tsx code block from docs/**/*.md, writes them to
// tmp/docs-check/, runs `tsc --noEmit` against a generated tsconfig that
// inherits the workspace path aliases, then rewrites tsc's file paths back to
// the original markdown locations.
//
// Block-level opt-outs (place on the fence info line):
//   ```ts ignore         skip this block entirely
//   ```ts no-check       emit `// @ts-nocheck` header so it's parsed but not checked
//
// Run with: pnpm docs:check

import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repo_root = resolve(__dirname, "..")
const docs_dir = join(repo_root, "docs")
const out_dir = join(repo_root, "tmp", "docs-check")
const tsconfig_path = join(repo_root, "tsconfig.docs-check.json")

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...walk(full))
    else if (name.endsWith(".md")) out.push(full)
  }
  return out
}

function extract_blocks(md_path) {
  const text = readFileSync(md_path, "utf8")
  const lines = text.split("\n")
  const blocks = []
  let in_block = false
  let lang = ""
  let info = ""
  let start_line = 0
  let body = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = line.match(/^```([A-Za-z0-9_-]+)?(.*)$/)
    if (!in_block && fence) {
      lang = (fence[1] || "").toLowerCase()
      info = (fence[2] || "").trim()
      if (lang === "ts" || lang === "tsx" || lang === "typescript") {
        in_block = true
        start_line = i + 2 // 1-indexed line of the first body line
        body = []
      }
      continue
    }
    if (in_block && /^```\s*$/.test(line)) {
      blocks.push({ lang: lang === "typescript" ? "ts" : lang, info, start_line, body: body.join("\n") })
      in_block = false
      body = []
      continue
    }
    if (in_block) body.push(line)
  }
  return blocks
}

function slugify(p) {
  return p.replace(/\\/g, "/").replace(/^docs\//, "").replace(/\.md$/, "").replace(/[^A-Za-z0-9]+/g, "_")
}

function main() {
  if (existsSync(out_dir)) rmSync(out_dir, { recursive: true, force: true })
  mkdirSync(out_dir, { recursive: true })

  const md_files = walk(docs_dir)
  const manifest = [] // { temp_path, md_rel, block_start_line, header_lines, skipped }
  let total = 0
  let skipped = 0
  let no_checked = 0

  for (const md_path of md_files) {
    const md_rel = relative(repo_root, md_path)
    const blocks = extract_blocks(md_path)
    blocks.forEach((b, idx) => {
      total++
      const flags = new Set(b.info.split(/\s+/).filter(Boolean).map(s => s.toLowerCase()))
      if (flags.has("ignore")) {
        skipped++
        return
      }
      const ext = b.lang === "tsx" ? "tsx" : "ts"
      const out_name = `${slugify(md_rel)}__${String(idx + 1).padStart(2, "0")}.${ext}`
      const out_path = join(out_dir, out_name)
      const header_lines = []
      header_lines.push(`// source: ${md_rel}:${b.start_line}`)
      if (flags.has("no-check")) {
        header_lines.push("// @ts-nocheck")
        no_checked++
      }
      const content = `${header_lines.join("\n")}\n${b.body}\n`
      writeFileSync(out_path, content)
      manifest.push({
        temp_path: relative(repo_root, out_path),
        md_rel,
        block_start_line: b.start_line,
        header_lines: header_lines.length,
      })
    })
  }

  const tsconfig = {
    compilerOptions: {
      noEmit: true,
      skipLibCheck: true,
      target: "esnext",
      module: "esnext",
      moduleResolution: "bundler",
      lib: ["esnext", "dom", "dom.iterable"],
      strict: true,
      esModuleInterop: true,
      resolveJsonModule: true,
      moduleDetection: "force",
      noUnusedLocals: false,
      noUnusedParameters: false,
      allowUnreachableCode: true,
      jsx: "react-jsx",
      baseUrl: ".",
      types: [],
      paths: {
        "@ethernauta/*": ["./packages/*/src"],
        "@ethernauta/chain/*": ["./packages/chain/src/chain/eip155/*"],
        "@ethernauta/eip/*": ["./packages/eip/src/*"],
        "@ethernauta/erc/*": ["./packages/erc/src/*"],
        "@ethernauta/abi/generator": ["./packages/abi/src/generator"],
        "ethers": ["./apps/docs/node_modules/ethers"],
        "ethers/*": ["./apps/docs/node_modules/ethers/*"],
        "viem": ["./apps/docs/node_modules/viem"],
        "viem/*": ["./apps/docs/node_modules/viem/*"],
        "valibot": ["./apps/docs/node_modules/valibot"],
        "react": ["./apps/docs/node_modules/react"],
        "react/*": ["./apps/docs/node_modules/react/*"],
      },
    },
    include: ["tmp/docs-check/**/*.ts", "tmp/docs-check/**/*.tsx"],
  }
  writeFileSync(tsconfig_path, JSON.stringify(tsconfig, null, 2) + "\n")

  console.log(
    `[docs:check] ${total} blocks across ${md_files.length} files — ${skipped} ignored, ${no_checked} @ts-nocheck, ${total - skipped} written to tmp/docs-check/`,
  )

  const error_re = /^(tmp\/docs-check\/[^()]+?)\((\d+),(\d+)\):\s*(error\s+(TS\d+):.*)$/

  function run_tsc(exclude_paths) {
    if (exclude_paths.length > 0) {
      const config = JSON.parse(readFileSync(tsconfig_path, "utf8"))
      config.exclude = exclude_paths
      writeFileSync(tsconfig_path, JSON.stringify(config, null, 2) + "\n")
    }
    const res = spawnSync("pnpm", ["exec", "tsc", "-p", "tsconfig.docs-check.json", "--pretty", "false"], {
      cwd: repo_root,
      encoding: "utf8",
    })
    const raw = (res.stdout || "") + (res.stderr || "")
    const out = []
    for (const line of raw.split("\n")) {
      const m = line.match(error_re)
      if (!m) continue
      out.push({ temp_rel: m[1], temp_line: Number(m[2]), col: Number(m[3]), msg: m[4], code: m[5] })
    }
    return out
  }

  // Pass 1: full run. tsc only surfaces parse errors (TS1xxx) when there are
  // any in the batch, because a parse failure poisons the binder for the rest.
  const pass1 = run_tsc([])
  const parse_codes_re = /^TS1\d{3}$/
  const parse_files = new Set(pass1.filter(e => parse_codes_re.test(e.code)).map(e => e.temp_rel))

  // Pass 2: re-run with parse-broken files excluded so semantic errors surface
  // on every file that successfully parses.
  const pass2 = parse_files.size > 0 ? run_tsc([...parse_files]) : []

  const merged = []
  for (const e of pass1) if (parse_codes_re.test(e.code)) merged.push(e)
  for (const e of pass2) merged.push(e)

  const errors = []
  for (const e of merged) {
    const entry = manifest.find(m => m.temp_path === e.temp_rel)
    if (!entry) {
      errors.push({ where: `${e.temp_rel}:${e.temp_line}:${e.col}`, msg: e.msg })
      continue
    }
    const md_line = entry.block_start_line + (e.temp_line - entry.header_lines - 1)
    errors.push({
      where: `${entry.md_rel}:${md_line}:${e.col}`,
      msg: e.msg,
      temp: `${e.temp_rel}:${e.temp_line}:${e.col}`,
    })
  }

  if (errors.length === 0) {
    console.log(`[docs:check] PASS — all ${total - skipped} checked blocks typecheck cleanly.`)
    process.exit(0)
  }

  console.log(`[docs:check] FAIL — ${errors.length} error(s):\n`)
  const by_file = new Map()
  for (const e of errors) {
    const md_file = e.where.split(":")[0]
    if (!by_file.has(md_file)) by_file.set(md_file, [])
    by_file.get(md_file).push(e)
  }
  for (const [file, errs] of [...by_file.entries()].sort()) {
    console.log(`  ${file}  (${errs.length})`)
    for (const e of errs) {
      console.log(`    ${e.where}  ${e.msg}`)
      if (e.temp) console.log(`      (temp: ${e.temp})`)
    }
  }
  process.exit(1)
}

main()
