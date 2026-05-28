import { AddressSchema } from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { build_siwe_message } from "./build"
import { parse_siwe_message } from "./parse"

const ADDRESS = parse(
  AddressSchema,
  "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
)

describe("build.ts — build_siwe_message", () => {
  it("should render a full message that round-trips through parse", () => {
    const fields = {
      domain: "example.com",
      address: ADDRESS,
      statement:
        "I accept the ExampleApp Terms of Service: https://example.com/tos",
      uri: "https://example.com/login",
      version: "1",
      chainId: "1",
      nonce: "32891756",
      issuedAt: "2021-09-30T16:25:24Z",
      expirationTime: "2021-09-30T17:25:24Z",
      resources: [
        "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
        "https://example.com/my-web2-claim.json",
      ],
    }
    const rendered = build_siwe_message(fields)
    const parsed = parse_siwe_message(rendered)
    expect(parsed).toEqual(fields)
  })

  it("should omit statement and optional fields when undefined", () => {
    const rendered = build_siwe_message({
      domain: "example.com",
      address: ADDRESS,
      uri: "https://example.com",
      version: "1",
      chainId: "1",
      nonce: "abc12345",
      issuedAt: "2024-01-01T00:00:00Z",
    })
    expect(rendered).not.toContain("Expiration Time")
    expect(rendered).not.toContain("Not Before")
    expect(rendered).not.toContain("Request ID")
    expect(rendered).not.toContain("Resources:")
    // statement-less messages have exactly one blank line
    // between the address line and the URI line
    expect(rendered).toContain(
      "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845\n\nURI:",
    )
  })
})
