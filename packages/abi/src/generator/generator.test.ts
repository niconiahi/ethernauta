import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { generate } from "./generator"

function make_tmp(): string {
  return mkdtempSync(join(tmpdir(), "ethernauta-gen-"))
}

describe("generator.ts", () => {
  it("should emit a Callable that wraps eth_call for view methods", () => {
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "get_data",
            inputs: [{ name: "token_id", type: "uint256" }],
            outputs: [{ name: "", type: "string" }],
            stateMutability: "view",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "get_data.ts"),
        "utf8",
      )
      expect(file).toContain("Callable<string>")
      expect(file).toContain("ResolvedContract")
      expect(file).toContain('build_signature("get_data"')
      expect(file).toContain('"eth_call"')
      expect(file).toContain("decode_function_result")
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a Signable composing onto eth_signTransaction for nonpayable methods", () => {
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "mint",
            inputs: [{ name: "data", type: "string" }],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "mint.ts"),
        "utf8",
      )
      expect(file).toContain("Signable<Bytes>")
      expect(file).toContain("ResolvedSigner")
      expect(file).toContain("eth_signTransaction")
      expect(file).toContain('build_signature("mint"')
      expect(file).toContain("encode_function_call")
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a no-param Callable for nullary view methods", () => {
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "totalSupply",
            inputs: [],
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "total-supply.ts"),
        "utf8",
      )
      expect(file).toContain("Callable<Uint256>")
      expect(file).toContain(
        "export function totalSupply()",
      )
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })
})
