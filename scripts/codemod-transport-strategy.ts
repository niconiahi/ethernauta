import { readFileSync, writeFileSync } from "node:fs"

const args = process.argv.slice(2)
const dry_run = args.includes("--dry-run")
const paths = args.filter((arg) => !arg.startsWith("--"))

const PROMISE_ANY_CONST =
  /const\s+response\s*=\s*await\s+Promise\.any\(\s*transports\.map\(\(?(\w+)\)?\s*=>\s*\1\((\w+)\)\),?\s*\)/g

const PROMISE_ANY_REASSIGN =
  /(^|[^.\w])response\s*=\s*await\s+Promise\.any\(\s*transports\.map\(\(?(\w+)\)?\s*=>\s*\1\((\w+)\)\),?\s*\)/g

const DESTRUCTURE_BINDING = /\[\s*transports\s*,/g

const TYPEOF_TRANSPORTS_AWAITED =
  /Awaited<\s*ReturnType<\(typeof transports\)\[number\]>\s*>/g

const TYPEOF_TRANSPORTS_BARE =
  /\(typeof transports\)\[number\]/g

let modified = 0
let unchanged = 0
const manual_review: string[] = []

for (const path of paths) {
  const src = readFileSync(path, "utf8")
  let out = src

  out = out.replace(
    PROMISE_ANY_CONST,
    (_match, _param, arg) =>
      `const response = await dispatcher(${arg})`,
  )

  out = out.replace(
    PROMISE_ANY_REASSIGN,
    (_match, lead, _param, arg) =>
      `${lead}response = await dispatcher(${arg})`,
  )

  out = out.replace(DESTRUCTURE_BINDING, "[dispatcher,")

  if (TYPEOF_TRANSPORTS_AWAITED.test(out)) {
    manual_review.push(
      `${path} (Awaited<ReturnType<(typeof transports)[number]>> → Response)`,
    )
  }
  if (TYPEOF_TRANSPORTS_BARE.test(out)) {
    manual_review.push(
      `${path} (bare (typeof transports)[number])`,
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
    unchanged += 1
  }
}

console.log("")
console.log(`summary: ${modified} matched, ${unchanged} no-match`)
if (manual_review.length > 0) {
  console.log("")
  console.log("manual review:")
  for (const note of manual_review) console.log(`  ${note}`)
}
