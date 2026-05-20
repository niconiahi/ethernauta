import { describe, expect, it } from "vitest"
import {
  is_siwe_message,
  parse_siwe_message,
} from "./parse"

const FULL_MESSAGE = `example.com wants you to sign in with your Ethereum account:
0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845

I accept the ExampleApp Terms of Service: https://example.com/tos

URI: https://example.com/login
Version: 1
Chain ID: 1
Nonce: 32891756
Issued At: 2021-09-30T16:25:24Z
Expiration Time: 2021-09-30T17:25:24Z
Resources:
- ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu
- https://example.com/my-web2-claim.json`

const MIN_MESSAGE = `example.com wants you to sign in with your Ethereum account:
0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845

URI: https://example.com
Version: 1
Chain ID: 1
Nonce: abc12345
Issued At: 2024-01-01T00:00:00Z`

describe("parse.ts — parse_siwe_message", () => {
  it("should parse a full SIWE message", () => {
    const parsed = parse_siwe_message(FULL_MESSAGE)
    expect(parsed).toBeDefined()
    if (!parsed) return
    expect(parsed.domain).toBe("example.com")
    expect(parsed.address).toBe(
      "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
    )
    expect(parsed.statement).toContain(
      "ExampleApp Terms of Service",
    )
    expect(parsed.uri).toBe("https://example.com/login")
    expect(parsed.version).toBe("1")
    expect(parsed.chainId).toBe("1")
    expect(parsed.nonce).toBe("32891756")
    expect(parsed.issuedAt).toBe(
      "2021-09-30T16:25:24Z",
    )
    expect(parsed.expirationTime).toBe(
      "2021-09-30T17:25:24Z",
    )
    expect(parsed.resources).toEqual([
      "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
      "https://example.com/my-web2-claim.json",
    ])
  })

  it("should parse a minimal SIWE message without statement", () => {
    const parsed = parse_siwe_message(MIN_MESSAGE)
    expect(parsed).toBeDefined()
    if (!parsed) return
    expect(parsed.statement).toBeUndefined()
    expect(parsed.uri).toBe("https://example.com")
    expect(parsed.resources).toBeUndefined()
  })

  it("should return undefined for a non-SIWE message", () => {
    expect(
      parse_siwe_message("just some random message"),
    ).toBeUndefined()
  })

  it("should return undefined when address is malformed", () => {
    const bad = MIN_MESSAGE.replace(
      "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
      "0xnot-an-address",
    )
    expect(parse_siwe_message(bad)).toBeUndefined()
  })

  it("should return undefined when required fields are missing", () => {
    const bad = MIN_MESSAGE.replace(
      "Issued At: 2024-01-01T00:00:00Z",
      "",
    )
    expect(parse_siwe_message(bad)).toBeUndefined()
  })

  it("should reject when issuedAt is not ISO-8601", () => {
    const bad = MIN_MESSAGE.replace(
      "2024-01-01T00:00:00Z",
      "yesterday",
    )
    expect(parse_siwe_message(bad)).toBeUndefined()
  })

  it("should expose is_siwe_message as a boolean check", () => {
    expect(is_siwe_message(FULL_MESSAGE)).toBe(true)
    expect(is_siwe_message("not siwe")).toBe(false)
  })
})
