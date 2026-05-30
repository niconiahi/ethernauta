// One-shot migration of gas test files that all follow the same
// pattern:
//
//   import { encode_chain_id, type ResolvedReader } from "@ethernauta/transport"
//   ...
//   const resolved: ResolvedReader = [
//     [stub_http(...)],
//     { chain_id: CHAIN_ID },
//   ]
//
// becomes:
//
//   import { create_testing_reader } from "@ethernauta/testing"
//   import { encode_chain_id } from "@ethernauta/transport"
//   ...
//   const testing_reader = create_testing_reader({ chain_id: CHAIN_ID })
//   const resolved = testing_reader(stub_http(...))

import { readFileSync, writeFileSync } from "node:fs"

const args = process.argv.slice(2)
const dry_run = args.includes("--dry-run")
const paths = args.filter((arg) => !arg.startsWith("--"))

const RESOLVED_LITERAL =
  /const\s+resolved\s*:\s*ResolvedReader\s*=\s*\[\s*\[(stub_http\([\s\S]*?\))\],\s*\{\s*chain_id:\s*CHAIN_ID\s*,?\s*\},?\s*\]/g

const IMPORT_BLOCK =
  /import\s*\{([^}]*)\}\s*from\s*"@ethernauta\/transport"/g

let modified = 0

for (const path of paths) {
  const src = readFileSync(path, "utf8")
  let out = src

  out = out.replace(
    RESOLVED_LITERAL,
    (_match, stub) => `const resolved = testing_reader(${stub})`,
  )

  out = out.replace(IMPORT_BLOCK, (_match, body) => {
    const cleaned = body
      .split(/,\s*/)
      .map((segment: string) => segment.trim())
      .filter(
        (segment: string) =>
          segment.length > 0 &&
          segment !== "type ResolvedReader" &&
          segment !== "ResolvedReader",
      )
      .join(", ")
    return `import { ${cleaned} } from "@ethernauta/transport"`
  })

  if (
    out.includes("testing_reader(") &&
    !out.includes("create_testing_reader")
  ) {
    out = out.replace(
      /import \{ ([^}]+) \} from "@ethernauta\/transport"/,
      (match, body) =>
        `import { create_testing_reader } from "@ethernauta/testing"\nimport { ${body} } from "@ethernauta/transport"`,
    )
  }

  if (
    out.includes("testing_reader(") &&
    !out.includes("const testing_reader =")
  ) {
    out = out.replace(
      /(const CHAIN_ID = encode_chain_id\(\{[\s\S]*?\}\))/,
      (match) =>
        `${match}\nconst testing_reader = create_testing_reader({ chain_id: CHAIN_ID })`,
    )
  }

  if (out !== src) {
    if (dry_run) {
      console.log(`MATCH    ${path}`)
    } else {
      writeFileSync(path, out)
      console.log(`MODIFIED ${path}`)
    }
    modified += 1
  } else {
    console.log(`NO-MATCH ${path}`)
  }
}

console.log("")
console.log(`summary: ${modified} matched`)
