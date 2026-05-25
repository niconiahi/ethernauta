import {
  addressSchema,
  hash32Schema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import { recover_address } from "./recover"
import { sign_digest } from "./sign-digest"
import { signature_to_hex } from "./signature-to-hex"

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)
const ADDRESS = parse(
  addressSchema,
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
)

describe("signature-to-hex.ts — signature_to_hex", () => {
  it("returns a Bytes65-shaped hex string", () => {
    const digest = keccak_256(
      new TextEncoder().encode("hello"),
    )
    const hex = signature_to_hex(
      sign_digest(digest, PRIVATE_KEY),
    )
    expect(hex.length).toBe(2 + 130)
    expect(hex.startsWith("0x")).toBe(true)
    expect(/^0x[0-9a-f]{130}$/.test(hex)).toBe(true)
  })

  it("round-trips through recover_address", () => {
    const digest = keccak_256(
      new TextEncoder().encode("hello"),
    )
    const hash = parse(hash32Schema, bytes_to_hex(digest))
    const hex = signature_to_hex(
      sign_digest(digest, PRIVATE_KEY),
    )
    expect(recover_address(hash, hex)).toEqual(ADDRESS)
  })

  it("encodes v = 27 + recovery in the trailing byte", () => {
    const digest = keccak_256(
      new TextEncoder().encode("hello"),
    )
    const signature = sign_digest(digest, PRIVATE_KEY)
    const hex = signature_to_hex(signature)
    const v_byte = Number.parseInt(hex.slice(-2), 16)
    expect(v_byte).toBe(27 + signature.recovery)
  })
})
