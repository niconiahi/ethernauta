// https://docs.ens.domains/ensip/10

import { describe, expect, it } from "vitest"

import { dns_encode } from "./dns-encode"

describe("dns_encode", () => {
  it("encodes the empty name as a single root byte", () => {
    expect(dns_encode("")).toBe("0x00")
  })

  it("encodes a single label with length prefix and terminator", () => {
    // 03 'e' 't' 'h' 00
    expect(dns_encode("eth")).toBe("0x0365746800")
  })

  it("encodes vitalik.eth", () => {
    // 07 v i t a l i k 03 e t h 00
    expect(dns_encode("vitalik.eth")).toBe(
      "0x07766974616c696b0365746800",
    )
  })

  it("encodes the basenames wildcard subdomain", () => {
    // 05 j e s s e 04 b a s e 03 e t h 00
    expect(dns_encode("jesse.base.eth")).toBe(
      "0x056a65737365046261736503657468 00".replace(
        / /g,
        "",
      ),
    )
  })

  it("rejects an empty label", () => {
    expect(() => dns_encode("foo..bar")).toThrow(
      /empty label/,
    )
  })

  it("rejects a label over 63 bytes", () => {
    expect(() => dns_encode("a".repeat(64) + ".eth")).toThrow(
      /exceeds 63 bytes/,
    )
  })
})
