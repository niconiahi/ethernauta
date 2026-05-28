import { AddressSchema, UintSchema } from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
  type AuthorizationParameter,
  AuthorizationParameterSchema,
  build_authorization_message,
  hash_authorization,
  SET_CODE_MAGIC,
} from "./authorization"

const SAMPLE: AuthorizationParameter = {
  chainId: parse(UintSchema, "0x1"),
  address: parse(
    AddressSchema,
    "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
  ),
  nonce: parse(UintSchema, "0x0"),
}

describe("authorization.ts", () => {
  it("should start the message with the 0x05 magic byte", () => {
    const msg = build_authorization_message(SAMPLE)
    expect(msg[0]).toBe(SET_CODE_MAGIC)
  })

  it("should produce a deterministic message for identical input", () => {
    const a = bytes_to_hex(
      build_authorization_message(SAMPLE),
    )
    const b = bytes_to_hex(
      build_authorization_message(SAMPLE),
    )
    expect(a).toBe(b)
  })

  it("should produce different messages for different addresses", () => {
    const other = bytes_to_hex(
      build_authorization_message({
        ...SAMPLE,
        address: parse(
          AddressSchema,
          "0x1234567890123456789012345678901234567890",
        ),
      }),
    )
    const base = bytes_to_hex(
      build_authorization_message(SAMPLE),
    )
    expect(base).not.toBe(other)
  })

  it("should encode chainId 0 as the wildcard empty byte string", () => {
    const msg = build_authorization_message({
      ...SAMPLE,
      chainId: parse(UintSchema, "0x0"),
    })
    // After 0x05 magic + rlp list header, the chain_id
    // appears as 0x80 (empty string = zero).
    expect(msg[2]).toBe(0x80)
  })

  it("should return a 32-byte keccak digest", () => {
    const digest = hash_authorization(SAMPLE)
    expect(digest).toBeInstanceOf(Uint8Array)
    expect(digest.length).toBe(32)
  })

  it("should reject a malformed address via the schema", () => {
    expect(() =>
      parse(AuthorizationParameterSchema, {
        ...SAMPLE,
        address: "0xnope",
      }),
    ).toThrow()
  })

  it("should reject a non-hex chainId via the schema", () => {
    expect(() =>
      parse(AuthorizationParameterSchema, {
        ...SAMPLE,
        chainId: "1",
      }),
    ).toThrow()
  })
})
