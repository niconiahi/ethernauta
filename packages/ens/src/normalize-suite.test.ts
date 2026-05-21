import { describe, expect, it } from "vitest"

import { ENS_TESTS } from "./data/ens-vectors"
import { ens_normalize } from "./normalize"

describe("normalize.ts — ENS official validation suite", () => {
  it("should pass the full published suite", () => {
    let passed = 0
    let failed = 0
    const failures: string[] = []
    for (const t of ENS_TESTS) {
      let ok = false
      let detail = ""
      if ("error" in t) {
        try {
          ens_normalize(t.name)
          detail = `expected error, got success`
        } catch {
          ok = true
        }
      } else {
        try {
          const got = ens_normalize(t.name)
          if (got === t.norm) ok = true
          else
            detail = `expected ${JSON.stringify(t.norm)}, got ${JSON.stringify(got)}`
        } catch (e: unknown) {
          detail = `unexpected error: ${
            e instanceof Error ? e.message : String(e)
          }`
        }
      }
      if (ok) passed++
      else {
        failed++
        if (failures.length < 20) {
          failures.push(
            `  ${JSON.stringify(t.name)} → ${detail}`,
          )
        }
      }
    }
    const total = passed + failed
    const ratio = passed / total
    console.log(
      `ENS suite: ${passed}/${total} passed (${(ratio * 100).toFixed(2)}%)`,
    )
    if (failed > 0) {
      console.log("first failures:")
      console.log(failures.join("\n"))
    }
    expect(failed).toBe(0)
    expect(ratio).toBe(1)
  }, 60_000)
})
