import { describe, expect, it } from "vitest"

import { generate_siwe_nonce } from "./nonce"

describe("nonce.ts — generate_siwe_nonce", () => {
  it("should emit alphanumeric strings of length 16", () => {
    for (let i = 0; i < 32; i += 1) {
      const nonce = generate_siwe_nonce()
      expect(nonce).toMatch(/^[A-Za-z0-9]{16}$/)
    }
  })

  it("should not collide across repeated calls", () => {
    const seen = new Set<string>()
    for (let i = 0; i < 1024; i += 1) {
      seen.add(generate_siwe_nonce())
    }
    expect(seen.size).toBe(1024)
  })
})
