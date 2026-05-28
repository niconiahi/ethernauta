import { Hash32Schema } from "@ethernauta/core"
import { build_personal_message } from "@ethernauta/eip/191"
import { bytes_to_hex } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { personal_sign_message } from "./personal-sign-message"
import { private_key_to_address } from "./private-key-to-address"
import { recover_address } from "./recover"

const PRIVATE_KEY = new Uint8Array([
  0x4c, 0x0b, 0x84, 0x52, 0xc7, 0x4b, 0x18, 0x9d, 0x59,
  0x33, 0xa9, 0x2c, 0xe2, 0x99, 0xc3, 0xfa, 0x83, 0xd7,
  0xc8, 0x6a, 0x2a, 0x69, 0x71, 0x2f, 0xc5, 0xb7, 0x5e,
  0xed, 0xa0, 0xa6, 0x9e, 0x77,
])

describe("personal-sign-message.ts — personal_sign_message", () => {
  it("returns a 65-byte 0x-prefixed signature", () => {
    const sig = personal_sign_message("hello", PRIVATE_KEY)
    expect(sig.startsWith("0x")).toBe(true)
    expect(sig.length).toBe(2 + 65 * 2)
  })

  it("is deterministic for the same input (RFC 6979)", () => {
    const a = personal_sign_message("hello", PRIVATE_KEY)
    const b = personal_sign_message("hello", PRIVATE_KEY)
    expect(a).toBe(b)
  })

  it("produces different signatures for different messages", () => {
    const a = personal_sign_message("hello", PRIVATE_KEY)
    const b = personal_sign_message("world", PRIVATE_KEY)
    expect(a).not.toBe(b)
  })

  it("ends with a v byte of 0x1b or 0x1c", () => {
    const sig = personal_sign_message("hello", PRIVATE_KEY)
    expect(["1b", "1c"]).toContain(sig.slice(-2))
  })

  it("round-trips through recover_address against the EIP-191 digest", () => {
    const message = "hello"
    const sig = personal_sign_message(message, PRIVATE_KEY)
    const digest = keccak_256(
      build_personal_message(message),
    )
    const hash = parse(Hash32Schema, bytes_to_hex(digest))
    const recovered = recover_address(hash, sig)
    const expected = private_key_to_address(PRIVATE_KEY)
    expect(recovered.toLowerCase()).toBe(
      expected.toLowerCase(),
    )
  })
})
