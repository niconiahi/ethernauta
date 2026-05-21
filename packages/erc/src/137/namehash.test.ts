import { describe, expect, it } from "vitest"

import { namehash, reverse_namehash } from "./namehash"

describe("namehash.ts", () => {
  it("should return the zero node for empty input", () => {
    expect(namehash("")).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    )
  })

  it("should hash 'eth' per ENSIP-1 vector", () => {
    expect(namehash("eth")).toBe(
      "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    )
  })

  it("should hash 'foo.eth' per ENSIP-1 vector", () => {
    expect(namehash("foo.eth")).toBe(
      "0xde9b09fd7c5f901e23a3f19fecc54828e9c848539801e86591bd9801b019f84f",
    )
  })

  it("should hash 'vitalik.eth' deterministically", () => {
    expect(namehash("vitalik.eth")).toBe(
      "0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835",
    )
  })
})

describe("reverse_namehash", () => {
  it("should hash <addr>.addr.reverse", () => {
    const node = reverse_namehash(
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    )
    // namehash("d8da6bf26964af9d7eed9e03e53415d37aa96045.addr.reverse")
    expect(node).toBe(
      "0x7aef81fbd30c83431369026d62ee533af8b69f246b63d75b40fe223346e6fa9a",
    )
  })
})
