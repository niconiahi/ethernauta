import { describe, expect, it } from "vitest"
import type { TypedData } from "./typed-data"
import { assert_domain_chain } from "./sign-typed-data"

const base_typed_data = {
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
    ],
    Person: [{ name: "name", type: "string" }],
  },
  primaryType: "Person",
  message: { name: "alice" },
} as const

function with_domain(chainId: TypedData["domain"]["chainId"]): TypedData {
  return {
    ...base_typed_data,
    domain: { name: "test", chainId },
  }
}

describe("sign-typed-data.ts — assert_domain_chain", () => {
  it("should pass when domain chainId matches active chain", () => {
    expect(() =>
      assert_domain_chain(
        with_domain(1n),
        "eip155:1",
      ),
    ).not.toThrow()
  })

  it("should pass when domain chainId is a number that matches", () => {
    expect(() =>
      assert_domain_chain(
        with_domain(11155111),
        "eip155:11155111",
      ),
    ).not.toThrow()
  })

  it("should pass when domain chainId is hex that matches", () => {
    expect(() =>
      assert_domain_chain(
        with_domain("0xaa36a7"),
        "eip155:11155111",
      ),
    ).not.toThrow()
  })

  it("should throw when domain chainId does not match active chain", () => {
    expect(() =>
      assert_domain_chain(
        with_domain(1n),
        "eip155:11155111",
      ),
    ).toThrow(/does not match/)
  })

  it("should pass when domain has no chainId at all (not pinned)", () => {
    const data: TypedData = {
      ...base_typed_data,
      domain: { name: "test" },
    }
    expect(() =>
      assert_domain_chain(data, "eip155:1"),
    ).not.toThrow()
  })
})
