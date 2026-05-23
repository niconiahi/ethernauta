import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { describe, expect, it } from "vitest"

import { get_create2_address } from "./get-create2-address"

// EIP-1014 specifies seven concrete vectors. Each gives address,
// salt, init_code, and the expected CREATE2 output. We pass the
// keccak256 of init_code as `bytecodeHash`.
function hash_code(code_hex: string): `0x${string}` {
  return bytes_to_hex(keccak_256(hex_to_bytes(code_hex)))
}

describe("get_create2_address", () => {
  it("EIP-1014 vector 0", () => {
    expect(
      get_create2_address({
        from: "0x0000000000000000000000000000000000000000",
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
        bytecodeHash: hash_code("0x00"),
      }),
    ).toBe("0x4d1a2e2bb4f88f0250f26ffff098b0b30b26bf38")
  })

  it("EIP-1014 vector 1", () => {
    expect(
      get_create2_address({
        from: "0xdeadbeef00000000000000000000000000000000",
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
        bytecodeHash: hash_code("0x00"),
      }),
    ).toBe("0xb928f69bb1d91cd65274e3c79d8986362984fda3")
  })

  it("EIP-1014 vector 2", () => {
    expect(
      get_create2_address({
        from: "0xdeadbeef00000000000000000000000000000000",
        salt: "0x000000000000000000000000feed000000000000000000000000000000000000",
        bytecodeHash: hash_code("0x00"),
      }),
    ).toBe("0xd04116cdd17bebe565eb2422f2497e06cc1c9833")
  })

  it("EIP-1014 vector 3 (non-trivial init_code)", () => {
    expect(
      get_create2_address({
        from: "0x0000000000000000000000000000000000000000",
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
        bytecodeHash: hash_code("0xdeadbeef"),
      }),
    ).toBe("0x70f2b2914a2a4b783faefb75f459a580616fcb5e")
  })

  it("EIP-1014 vector 4", () => {
    expect(
      get_create2_address({
        from: "0x00000000000000000000000000000000deadbeef",
        salt: "0x00000000000000000000000000000000000000000000000000000000cafebabe",
        bytecodeHash: hash_code("0xdeadbeef"),
      }),
    ).toBe("0x60f3f640a8508fc6a86d45df051962668e1e8ac7")
  })
})
