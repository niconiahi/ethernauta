import type { Bytes, Hash32 } from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha2"
import { keccak_256 } from "@noble/hashes/sha3"
import { etc, getPublicKey, sign } from "@noble/secp256k1"
import { describe, expect, it } from "vitest"

import { recover_address } from "./recover"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

// Canonical Anvil / Hardhat account 0.
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const EXPECTED_ADDRESS =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"

function address_from_pubkey(pubkey: Uint8Array): string {
  const hashed = keccak_256(pubkey.slice(1))
  const tail = hashed.slice(12)
  let out = "0x"
  for (const b of tail)
    out += b.toString(16).padStart(2, "0")
  return out
}

function build_signature_hex(
  digest: Uint8Array,
  priv: Uint8Array,
): Bytes {
  const sig = sign(digest, priv)
  const out = new Uint8Array(65)
  const r_hex = sig.r.toString(16).padStart(64, "0")
  const s_hex = sig.s.toString(16).padStart(64, "0")
  for (let i = 0; i < 32; i++) {
    out[i] = Number.parseInt(
      r_hex.slice(i * 2, i * 2 + 2),
      16,
    )
    out[32 + i] = Number.parseInt(
      s_hex.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  out[64] = 27 + sig.recovery
  return bytes_to_hex(out) as Bytes
}

describe("recover.ts", () => {
  const priv = hex_to_bytes(PRIVATE_KEY)
  const pub = getPublicKey(priv, false)
  const expected = address_from_pubkey(pub)

  it("should match the address derived from the private key", () => {
    expect(expected).toBe(EXPECTED_ADDRESS)
  })

  it("should recover the signer from a 65-byte v=27/28 signature", () => {
    const digest = keccak_256(
      new TextEncoder().encode("ethernauta"),
    )
    const sig = build_signature_hex(digest, priv)
    const recovered = recover_address(
      bytes_to_hex(digest) as Hash32,
      sig,
    )
    expect(recovered).toBe(EXPECTED_ADDRESS)
  })

  it("should recover the signer from a 65-byte v=0/1 signature", () => {
    const digest = keccak_256(
      new TextEncoder().encode("v01"),
    )
    const sig_27 = build_signature_hex(digest, priv)
    const v_raw = (
      Number.parseInt(sig_27.slice(-2), 16) - 27
    )
      .toString(16)
      .padStart(2, "0")
    const sig_01 = (sig_27.slice(0, -2) + v_raw) as Bytes
    expect(
      recover_address(
        bytes_to_hex(digest) as Hash32,
        sig_01,
      ),
    ).toBe(EXPECTED_ADDRESS)
  })

  it("should recover the signer from an EIP-2098 compact 64-byte signature", () => {
    const digest = keccak_256(
      new TextEncoder().encode("compact"),
    )
    const sig_65 = build_signature_hex(digest, priv)
    const bytes = hex_to_bytes(sig_65)
    const recovery = (bytes[64] as number) - 27
    const compact = new Uint8Array(64)
    compact.set(bytes.subarray(0, 64))
    if (recovery === 1) {
      compact[32] = (compact[32] as number) | 0x80
    }
    const sig_64 = bytes_to_hex(compact) as Bytes
    expect(
      recover_address(
        bytes_to_hex(digest) as Hash32,
        sig_64,
      ),
    ).toBe(EXPECTED_ADDRESS)
  })

  it("should not recover the signer when the signature is for a different digest", () => {
    const digest_a = keccak_256(
      new TextEncoder().encode("a"),
    )
    const digest_b = keccak_256(
      new TextEncoder().encode("b"),
    )
    const sig = build_signature_hex(digest_a, priv)
    const wrong = recover_address(
      bytes_to_hex(digest_b) as Hash32,
      sig,
    )
    expect(wrong).not.toBe(EXPECTED_ADDRESS)
  })

  it("should throw on an invalid signature length", () => {
    const digest = bytes_to_hex(
      new Uint8Array(32),
    ) as Hash32
    expect(() =>
      recover_address(digest, "0x1234" as Bytes),
    ).toThrow()
  })
})
