import { hex_to_bytes } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { describe, expect, it } from "vitest"

import { sign_digest } from "./sign-digest"

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)

describe("sign-digest.ts — sign_digest", () => {
  it("returns a recovered signature with valid r, s, and recovery bit", () => {
    const digest = keccak_256(
      new TextEncoder().encode("hello"),
    )
    const signature = sign_digest(digest, PRIVATE_KEY)
    expect(signature.r).toBeTypeOf("bigint")
    expect(signature.s).toBeTypeOf("bigint")
    expect([0, 1]).toContain(signature.recovery)
  })

  it("is deterministic — RFC 6979 produces the same signature for the same digest and key", () => {
    const digest = keccak_256(
      new TextEncoder().encode("hello"),
    )
    const a = sign_digest(digest, PRIVATE_KEY)
    const b = sign_digest(digest, PRIVATE_KEY)
    expect(a.r).toBe(b.r)
    expect(a.s).toBe(b.s)
    expect(a.recovery).toBe(b.recovery)
  })

  it("produces different signatures for different digests", () => {
    const a = sign_digest(
      keccak_256(new TextEncoder().encode("hello")),
      PRIVATE_KEY,
    )
    const b = sign_digest(
      keccak_256(new TextEncoder().encode("world")),
      PRIVATE_KEY,
    )
    expect(a.r === b.r && a.s === b.s).toBe(false)
  })
})
