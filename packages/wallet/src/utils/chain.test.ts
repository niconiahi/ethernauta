import { describe, expect, it } from "vitest"
import {
  find_chain,
  parse_chain_input,
  to_provider_chain_id,
} from "./chain"

describe("chain.ts — parse_chain_input", () => {
  it("should parse decimal input", () => {
    expect(parse_chain_input("1")).toBe(1)
    expect(parse_chain_input("11155111")).toBe(11155111)
  })

  it("should parse hex input", () => {
    expect(parse_chain_input("0x1")).toBe(1)
    expect(parse_chain_input("0xaa36a7")).toBe(11155111)
    expect(parse_chain_input("0xAA36A7")).toBe(11155111)
  })

  it("should parse CAIP-2 input", () => {
    expect(parse_chain_input("eip155:1")).toBe(1)
    expect(parse_chain_input("eip155:11155111")).toBe(
      11155111,
    )
  })

  it("should trim whitespace", () => {
    expect(parse_chain_input("  1  ")).toBe(1)
  })

  it("should return undefined for malformed input", () => {
    expect(parse_chain_input("")).toBeUndefined()
    expect(parse_chain_input("notanumber")).toBeUndefined()
    expect(parse_chain_input("0xzzz")).toBeUndefined()
    expect(parse_chain_input("eip155:abc")).toBeUndefined()
    expect(parse_chain_input("bip122:1")).toBeUndefined()
  })
})

describe("chain.ts — find_chain", () => {
  it("should return Sepolia for id 11155111", async () => {
    const chain = await find_chain(11155111)
    expect(chain?.name).toContain("Sepolia")
  })

  it("should return Mainnet for id 1", async () => {
    const chain = await find_chain(1)
    expect(chain?.name).toContain("Mainnet")
  })

  it("should return OP Sepolia for id 11155420", async () => {
    const chain = await find_chain(11155420)
    expect(chain?.name).toContain("OP Sepolia")
  })

  it("should return undefined for an unknown id", async () => {
    expect(
      await find_chain(123_456_789_123_456),
    ).toBeUndefined()
  })
})

describe("chain.ts — to_provider_chain_id", () => {
  it("should encode mainnet as 0x1", () => {
    expect(
      to_provider_chain_id({
        id: 1,
        name: "Ethereum Mainnet",
        rpc_url: "https://example",
      }),
    ).toBe("0x1")
  })

  it("should encode Sepolia as 0xaa36a7", () => {
    expect(
      to_provider_chain_id({
        id: 11155111,
        name: "Sepolia",
        rpc_url: "https://example",
      }),
    ).toBe("0xaa36a7")
  })
})
