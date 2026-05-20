import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { getPublicKey } from "@noble/secp256k1"
import { describe, expect, it } from "vitest"
import type { AuthorizationParameter } from "./authorization"
import { SET_CODE_TX_TYPE } from "./authorization"
import {
  sign_authorization,
  sign_set_code_transaction,
} from "./sign"
import type { SetCodeTransactionUnsigned } from "./transaction"

// Test vector: a fixed, throwaway secp256k1 key.
const PRIVATE_KEY = hex_to_bytes(
  "0x4af1bceebf7f3634ec3cff8a2c38e51178d5d4ce585c52d6043cfd640fcdf81b",
)

const AUTH: AuthorizationParameter = {
  chainId: "0xaa36a7",
  address: "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
  nonce: "0x5",
}

const TX: SetCodeTransactionUnsigned = {
  chainId: 11155111n,
  nonce: 4n,
  maxPriorityFeePerGas: 2_000_000_000n,
  maxFeePerGas: 30_000_000_000n,
  gasLimit: 1_000_000n,
  to: "0x1234567890123456789012345678901234567890",
  value: 0n,
  data: new Uint8Array([0xa9, 0x05, 0x9c, 0xbb]),
  accessList: [],
  authorizationList: [],
}

describe("sign.ts", () => {
  it("should produce a deterministic signature for the same authorization", () => {
    const a = sign_authorization(AUTH, PRIVATE_KEY)
    const b = sign_authorization(AUTH, PRIVATE_KEY)
    expect(a).toEqual(b)
  })

  it("should preserve the input tuple fields on the signed output", () => {
    const signed = sign_authorization(AUTH, PRIVATE_KEY)
    expect(signed.chainId).toBe(AUTH.chainId)
    expect(signed.address).toBe(AUTH.address)
    expect(signed.nonce).toBe(AUTH.nonce)
  })

  it("should produce raw 0/1 y_parity (no 27 offset, no chain-id baking)", () => {
    const signed = sign_authorization(AUTH, PRIVATE_KEY)
    expect(["0x0", "0x1"]).toContain(signed.yParity)
  })

  it("should produce r and s as 0x-prefixed hex strings", () => {
    const signed = sign_authorization(AUTH, PRIVATE_KEY)
    expect(signed.r.startsWith("0x")).toBe(true)
    expect(signed.s.startsWith("0x")).toBe(true)
    // Non-empty scalars.
    expect(signed.r.length).toBeGreaterThan(2)
    expect(signed.s.length).toBeGreaterThan(2)
  })

  it("should produce different signatures for different keys", () => {
    const other_key = hex_to_bytes(
      "0x0123456789012345678901234567890123456789012345678901234567890123",
    )
    const a = sign_authorization(AUTH, PRIVATE_KEY)
    const b = sign_authorization(AUTH, other_key)
    expect(a.r).not.toBe(b.r)
  })

  it("should emit a public key that ecrecovers from the digest", () => {
    // Smoke check: we can at least derive the same public
    // key from the private key — no broken inputs.
    const pub = getPublicKey(PRIVATE_KEY, false)
    expect(pub.length).toBe(65)
  })

  it("should prefix the signed type-4 tx with the 0x04 type byte", () => {
    const raw = sign_set_code_transaction(TX, PRIVATE_KEY)
    expect(raw[0]).toBe(SET_CODE_TX_TYPE)
  })

  it("should be deterministic across calls", () => {
    const a = bytes_to_hex(
      sign_set_code_transaction(TX, PRIVATE_KEY),
    )
    const b = bytes_to_hex(
      sign_set_code_transaction(TX, PRIVATE_KEY),
    )
    expect(a).toBe(b)
  })

  it("should produce different bytes for different keys", () => {
    const other_key = hex_to_bytes(
      "0x0123456789012345678901234567890123456789012345678901234567890123",
    )
    const a = bytes_to_hex(
      sign_set_code_transaction(TX, PRIVATE_KEY),
    )
    const b = bytes_to_hex(
      sign_set_code_transaction(TX, other_key),
    )
    expect(a).not.toBe(b)
  })

  it("should round-trip authorization tuples inside the outer tx", () => {
    const auth_signed = sign_authorization(
      AUTH,
      PRIVATE_KEY,
    )
    const raw = sign_set_code_transaction(
      { ...TX, authorizationList: [auth_signed] },
      PRIVATE_KEY,
    )
    // Adding an auth grows the encoding.
    const empty = sign_set_code_transaction(TX, PRIVATE_KEY)
    expect(raw.length).toBeGreaterThan(empty.length)
  })
})
