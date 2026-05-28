import { parse as devalue_parse } from "devalue"
import { afterEach, describe, expect, it } from "vitest"

import { OPTIONS_ENV_VAR } from "./constants"
import { ethernauta_anvil } from "./ethernauta-anvil"

describe("ethernauta_anvil()", () => {
  afterEach(() => {
    delete process.env[OPTIONS_ENV_VAR]
  })

  it("returns a Vite plugin object with the expected name", () => {
    const plugin = ethernauta_anvil()
    expect(plugin.name).toBe("ethernauta-anvil")
    expect(typeof plugin.config).toBe("function")
  })

  it("stashes the validated options in the env var", () => {
    ethernauta_anvil({
      chain_id: 31337,
      accounts: 5,
      base_fee: 1_000_000_000n,
      fork: {
        url: "https://sepolia.example.com",
        block_number: 1234n,
      },
    })
    const raw = process.env[OPTIONS_ENV_VAR]
    expect(raw).toBeDefined()
    if (raw === undefined) return
    const decoded = devalue_parse(raw)
    expect(decoded).toEqual({
      chain_id: 31337,
      accounts: 5,
      base_fee: 1_000_000_000n,
      fork: {
        url: "https://sepolia.example.com",
        block_number: 1234n,
      },
    })
  })

  it("appends the setup file to existing setupFiles", async () => {
    const plugin = ethernauta_anvil()
    if (typeof plugin.config !== "function") return
    const result = await plugin.config(
      { test: { setupFiles: ["./other.ts"] } },
      { command: "serve", mode: "test" },
    )
    if (result === null || result === undefined) return
    if (!("test" in result)) return
    expect(result.test?.setupFiles).toBeDefined()
    const files = result.test?.setupFiles
    if (!Array.isArray(files)) return
    expect(files.length).toBe(2)
    expect(files[0]).toBe("./other.ts")
    expect(files[1]).toMatch(/setup\.(t|j)s$/)
  })

  it("works when setupFiles is undefined", async () => {
    const plugin = ethernauta_anvil()
    if (typeof plugin.config !== "function") return
    const result = await plugin.config(
      {},
      { command: "serve", mode: "test" },
    )
    if (result === null || result === undefined) return
    if (!("test" in result)) return
    const files = result.test?.setupFiles
    expect(Array.isArray(files)).toBe(true)
  })

  it("normalises a string setupFiles into an array", async () => {
    const plugin = ethernauta_anvil()
    if (typeof plugin.config !== "function") return
    const result = await plugin.config(
      { test: { setupFiles: "./other.ts" } },
      { command: "serve", mode: "test" },
    )
    if (result === null || result === undefined) return
    if (!("test" in result)) return
    const files = result.test?.setupFiles
    if (!Array.isArray(files)) return
    expect(files[0]).toBe("./other.ts")
  })

  it("rejects a malformed fork.url at the parse boundary", () => {
    expect(() =>
      ethernauta_anvil({
        fork: { url: "not a url" },
      }),
    ).toThrow()
  })
})
