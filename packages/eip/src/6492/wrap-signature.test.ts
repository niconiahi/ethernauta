import type { Address, Bytes } from "@ethernauta/core"
import { describe, expect, it } from "vitest"

import { is_wrapped_signature } from "./is-wrapped-signature"
import { MAGIC_BYTES } from "./magic-bytes"
import { unwrap_signature } from "./unwrap-signature"
import { wrap_signature } from "./wrap-signature"

const FACTORY =
  "0x000000000000000000000000000000000000beef" as Address
const FACTORY_DATA =
  "0xdeadbeefcafef00d00000000000000000000000000000000000000000000000000000000000000aa" as Bytes
const SIGNATURE_INNER =
  "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ff" as Bytes

describe("wrap-signature.ts", () => {
  it("should append the magic suffix", () => {
    const wrapped = wrap_signature({
      factory: FACTORY,
      factoryData: FACTORY_DATA,
      signature: SIGNATURE_INNER,
    })
    expect(wrapped.endsWith(MAGIC_BYTES.slice(2))).toBe(true)
  })

  it("should round-trip via unwrap_signature", () => {
    const wrapped = wrap_signature({
      factory: FACTORY,
      factoryData: FACTORY_DATA,
      signature: SIGNATURE_INNER,
    })
    const out = unwrap_signature(wrapped)
    expect(out).not.toBeNull()
    expect(out?.factory).toBe(FACTORY)
    expect(out?.factoryData).toBe(FACTORY_DATA)
    expect(out?.signature).toBe(SIGNATURE_INNER)
  })

  it("should produce a signature that is_wrapped_signature accepts", () => {
    const wrapped = wrap_signature({
      factory: FACTORY,
      factoryData: FACTORY_DATA,
      signature: SIGNATURE_INNER,
    })
    expect(is_wrapped_signature(wrapped)).toBe(true)
  })

  it("should round-trip an empty factoryData", () => {
    const wrapped = wrap_signature({
      factory: FACTORY,
      factoryData: "0x" as Bytes,
      signature: SIGNATURE_INNER,
    })
    const out = unwrap_signature(wrapped)
    expect(out?.factory).toBe(FACTORY)
    expect(out?.factoryData).toBe("0x")
    expect(out?.signature).toBe(SIGNATURE_INNER)
  })
})

describe("is-wrapped-signature.ts", () => {
  it("should reject a plain 65-byte signature", () => {
    const raw = `0x${"11".repeat(65)}` as Bytes
    expect(is_wrapped_signature(raw)).toBe(false)
  })

  it("should reject a too-short signature", () => {
    expect(is_wrapped_signature("0x1234" as Bytes)).toBe(
      false,
    )
  })

  it("should accept any signature ending in the magic suffix", () => {
    const trailing =
      `0xdeadbeef${MAGIC_BYTES.slice(2)}` as Bytes
    expect(is_wrapped_signature(trailing)).toBe(true)
  })
})

describe("unwrap-signature.ts", () => {
  it("should return null on a non-wrapped signature", () => {
    expect(
      unwrap_signature(`0x${"22".repeat(65)}` as Bytes),
    ).toBeNull()
  })

  it("should return null when the inner shape is bogus", () => {
    // Magic suffix is present but the body is too short to
    // hold a 96-byte (address, bytes, bytes) head.
    const bogus =
      `0x1234${MAGIC_BYTES.slice(2)}` as Bytes
    expect(unwrap_signature(bogus)).toBeNull()
  })
})
