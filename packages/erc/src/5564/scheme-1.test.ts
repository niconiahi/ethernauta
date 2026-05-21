import { hex_to_bytes } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { getPublicKey, Point } from "@noble/secp256k1"
import { describe, expect, it } from "vitest"

import {
  check_stealth_address,
  compute_stealth_private_key,
  compute_view_tag,
  derive_meta_address,
  format_stealth_meta_address,
  generate_stealth_address,
  parse_stealth_meta_address,
} from "./scheme-1"

const SPENDING_PRIV = hex_to_bytes(
  "0x1111111111111111111111111111111111111111111111111111111111111111",
)
const VIEWING_PRIV = hex_to_bytes(
  "0x2222222222222222222222222222222222222222222222222222222222222222",
)
const EPHEMERAL_PRIV = hex_to_bytes(
  "0x3333333333333333333333333333333333333333333333333333333333333333",
)
const OTHER_EPHEMERAL_PRIV = hex_to_bytes(
  "0x4444444444444444444444444444444444444444444444444444444444444444",
)

const META = derive_meta_address({
  spending_private_key: SPENDING_PRIV,
  viewing_private_key: VIEWING_PRIV,
})

function bytes_to_lower_hex(bytes: Uint8Array): string {
  let hex = "0x"
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, "0")
  }
  return hex
}

describe("scheme-1.ts — meta-address parse/format", () => {
  it("should round-trip through hex concat form", () => {
    const hex = format_stealth_meta_address(META)
    expect(hex.length).toBe(2 + 132)
    const parsed = parse_stealth_meta_address(hex)
    expect(parsed.spending_public_key).toBe(
      META.spending_public_key,
    )
    expect(parsed.viewing_public_key).toBe(
      META.viewing_public_key,
    )
  })

  it("should reject a meta-address with the wrong length", () => {
    expect(() =>
      parse_stealth_meta_address("0xdead"),
    ).toThrow()
  })
})

describe("scheme-1.ts — generate/check round-trip", () => {
  it("recipient should re-derive the same stealth address", () => {
    const { stealth_address, ephemeral_public_key } =
      generate_stealth_address({
        meta: META,
        ephemeral_private_key: EPHEMERAL_PRIV,
      })
    const rederived = check_stealth_address({
      viewing_private_key: VIEWING_PRIV,
      spending_public_key: META.spending_public_key,
      ephemeral_public_key,
    })
    expect(rederived.toLowerCase()).toBe(
      stealth_address.toLowerCase(),
    )
  })

  it("should produce a different stealth address per ephemeral key", () => {
    const a = generate_stealth_address({
      meta: META,
      ephemeral_private_key: EPHEMERAL_PRIV,
    })
    const b = generate_stealth_address({
      meta: META,
      ephemeral_private_key: OTHER_EPHEMERAL_PRIV,
    })
    expect(a.stealth_address).not.toBe(b.stealth_address)
    expect(a.ephemeral_public_key).not.toBe(
      b.ephemeral_public_key,
    )
  })
})

describe("scheme-1.ts — view tag", () => {
  it("recipient's computed view tag should match sender's", () => {
    const generated = generate_stealth_address({
      meta: META,
      ephemeral_private_key: EPHEMERAL_PRIV,
    })
    const recipient_tag = compute_view_tag({
      viewing_private_key: VIEWING_PRIV,
      ephemeral_public_key: generated.ephemeral_public_key,
    })
    expect(recipient_tag).toBe(generated.view_tag)
  })
})

describe("scheme-1.ts — spending key derivation", () => {
  it("recipient's derived stealth key should produce the announced stealth address", () => {
    const { stealth_address, ephemeral_public_key } =
      generate_stealth_address({
        meta: META,
        ephemeral_private_key: EPHEMERAL_PRIV,
      })
    const stealth_priv = compute_stealth_private_key({
      spending_private_key: SPENDING_PRIV,
      viewing_private_key: VIEWING_PRIV,
      ephemeral_public_key,
    })
    const pub = getPublicKey(stealth_priv, false)
    const addr_bytes = keccak_256(pub.slice(1)).slice(-20)
    expect(bytes_to_lower_hex(addr_bytes)).toBe(
      stealth_address.toLowerCase(),
    )
    // Sanity: scalar mul against base produces a valid point.
    const pt = Point.BASE.multiply(
      BigInt(bytes_to_lower_hex(stealth_priv)),
    )
    expect(pt.toHex(true).length).toBe(66)
  })
})
