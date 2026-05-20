import { bytes_to_hex } from "@ethernauta/utils"
import { describe, expect, it } from "vitest"

import { encode_type, hash_type } from "./hash"
import type { TypedDataTypes } from "./typed-data"

describe("encode_type", () => {
  it("encodes a flat struct in declared field order", () => {
    const types: TypedDataTypes = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    }
    expect(encode_type("Permit", types)).toBe(
      "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)",
    )
  })

  it("appends referenced structs sorted alphabetically", () => {
    const types: TypedDataTypes = {
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
    }
    expect(encode_type("Mail", types)).toBe(
      "Mail(Person from,Person to,string contents)Person(string name,address wallet)",
    )
  })
})

describe("hash_type", () => {
  // Canonical USDC PERMIT_TYPEHASH — used by every EIP-2612
  // token. If our type encoding drifts, this fails.
  it("matches the canonical ERC-2612 PERMIT_TYPEHASH", () => {
    const types: TypedDataTypes = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    }
    expect(bytes_to_hex(hash_type("Permit", types))).toBe(
      "0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9",
    )
  })
})

