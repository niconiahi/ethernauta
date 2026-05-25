import { hash32Schema } from "@ethernauta/core"
import {
  hash_typed_data,
  type TypedData,
} from "@ethernauta/eip/712"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { private_key_to_address } from "./private-key-to-address"
import { recover_address } from "./recover"
import { sign_typed_data } from "./sign-typed-data"

const PRIVATE_KEY = new Uint8Array([
  0x4c, 0x0b, 0x84, 0x52, 0xc7, 0x4b, 0x18, 0x9d, 0x59,
  0x33, 0xa9, 0x2c, 0xe2, 0x99, 0xc3, 0xfa, 0x83, 0xd7,
  0xc8, 0x6a, 0x2a, 0x69, 0x71, 0x2f, 0xc5, 0xb7, 0x5e,
  0xed, 0xa0, 0xa6, 0x9e, 0x77,
])

const TYPED_DATA: TypedData = {
  domain: {
    name: "Ether Mail",
    version: "1",
    chainId: 1,
    verifyingContract:
      "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  },
  types: {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" },
    ],
  },
  primaryType: "Mail",
  message: {
    from: {
      name: "Cow",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
    },
    contents: "Hello, Bob!",
  },
}

describe("sign-typed-data.ts — sign_typed_data", () => {
  it("returns a 65-byte 0x-prefixed signature", () => {
    const sig = sign_typed_data(TYPED_DATA, PRIVATE_KEY)
    expect(sig.startsWith("0x")).toBe(true)
    expect(sig.length).toBe(2 + 65 * 2)
  })

  it("round-trips through recover_address against the EIP-712 digest", () => {
    const sig = sign_typed_data(TYPED_DATA, PRIVATE_KEY)
    const hash = parse(
      hash32Schema,
      bytes_to_hex(hash_typed_data(TYPED_DATA)),
    )
    const recovered = recover_address(hash, sig)
    const expected = private_key_to_address(PRIVATE_KEY)
    expect(recovered.toLowerCase()).toBe(
      expected.toLowerCase(),
    )
  })
})
