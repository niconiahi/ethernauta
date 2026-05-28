// Owns the pure ECDSA recovery primitive. The downstream
// verify-* helpers compose on top of this — anything they
// can prove correct, they can only prove correct if recover
// itself is correct on every signature shape Ethereum
// emits in practice:
//
//   - 65-byte canonical form, v ∈ {27, 28}    (personal_sign, eth_signTypedData)
//   - 65-byte raw form,        v ∈ {0, 1}     (some libraries, EIP-1559 tx field)
//   - 64-byte EIP-2098 compact form           (y-parity stuffed into top of s)
//
// Any one of these silently breaking is a regression that
// surfaces downstream as `invalid_signature`.

import {
  AddressSchema,
  Bytes64Schema,
  Bytes65Schema,
  Hash32Schema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha2"
import { keccak_256 } from "@noble/hashes/sha3"
import { etc, sign } from "@noble/secp256k1"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { recover_address } from "./recover"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)
const ADDRESS = parse(
  AddressSchema,
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
)

const DIGEST = keccak_256(
  new TextEncoder().encode("recover-address-vector"),
)
const HASH = parse(Hash32Schema, bytes_to_hex(DIGEST))

function rs_bytes(): {
  r: Uint8Array
  s: Uint8Array
  recovery: number
} {
  const sig = sign(DIGEST, PRIVATE_KEY)
  const out_r = new Uint8Array(32)
  const out_s = new Uint8Array(32)
  const r_hex = sig.r.toString(16).padStart(64, "0")
  const s_hex = sig.s.toString(16).padStart(64, "0")
  for (let i = 0; i < 32; i += 1) {
    out_r[i] = Number.parseInt(
      r_hex.slice(i * 2, i * 2 + 2),
      16,
    )
    out_s[i] = Number.parseInt(
      s_hex.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  return { r: out_r, s: out_s, recovery: sig.recovery }
}

function sig65_with_v(v: number) {
  const { r, s } = rs_bytes()
  const out = new Uint8Array(65)
  out.set(r, 0)
  out.set(s, 32)
  out[64] = v
  return parse(Bytes65Schema, bytes_to_hex(out))
}

describe("recover.ts — recover_address", () => {
  describe("65-byte canonical form", () => {
    it("recovers from v = 27 (recovery = 0)", () => {
      const { recovery } = rs_bytes()
      if (recovery !== 0) {
        // The fixture happens to use recovery=0 for this digest;
        // if @noble ever changes that, surface it loudly.
        throw new Error(
          `fixture assumes recovery=0; got ${recovery}`,
        )
      }
      const signature = sig65_with_v(27)
      expect(recover_address(HASH, signature)).toEqual(
        ADDRESS,
      )
    })

    it("recovers from raw v = 0 (recovery = 0)", () => {
      const signature = sig65_with_v(0)
      expect(recover_address(HASH, signature)).toEqual(
        ADDRESS,
      )
    })

    it("rejects an out-of-range v byte", () => {
      const { r, s } = rs_bytes()
      const out = new Uint8Array(65)
      out.set(r, 0)
      out.set(s, 32)
      out[64] = 42
      expect(() =>
        recover_address(
          HASH,
          parse(Bytes65Schema, bytes_to_hex(out)),
        ),
      ).toThrow(/invalid signature v byte/)
    })

    it("returns a different address for a tampered r", () => {
      const { r, s, recovery } = rs_bytes()
      const out = new Uint8Array(65)
      out.set(r, 0)
      out.set(s, 32)
      out[64] = 27 + recovery
      out[0] = (out[0] ?? 0) ^ 0x01
      const recovered = recover_address(
        HASH,
        parse(Bytes65Schema, bytes_to_hex(out)),
      )
      expect(recovered).not.toEqual(ADDRESS)
    })
  })

  describe("64-byte EIP-2098 compact form", () => {
    it("recovers when y-parity is 0 (top bit of s clear)", () => {
      const { r, s, recovery } = rs_bytes()
      if (recovery !== 0) {
        throw new Error(
          `fixture assumes recovery=0; got ${recovery}`,
        )
      }
      const out = new Uint8Array(64)
      out.set(r, 0)
      out.set(s, 32)
      // recovery = 0, so the top bit of s[0] stays clear
      const signature = parse(
        Bytes64Schema,
        bytes_to_hex(out),
      )
      expect(recover_address(HASH, signature)).toEqual(
        ADDRESS,
      )
    })

    it("round-trips a synthetic y-parity = 1 by setting the top bit", () => {
      // Synthesize: r unchanged, s with top bit set marks
      // recovery = 1. We don't have a natural-recovery=1
      // vector handy, so we assert the *encoding round-trip*
      // matches the 65-byte form: same r,s,recovery → same
      // recovered address. Build a fresh signature whose
      // recovery is known by signing a different digest until
      // we find one.
      let i = 0
      let other_digest = keccak_256(
        new TextEncoder().encode(`recovery-1-probe-${i}`),
      )
      let probe = sign(other_digest, PRIVATE_KEY)
      while (probe.recovery !== 1 && i < 64) {
        i += 1
        other_digest = keccak_256(
          new TextEncoder().encode(`recovery-1-probe-${i}`),
        )
        probe = sign(other_digest, PRIVATE_KEY)
      }
      if (probe.recovery !== 1) {
        throw new Error(
          "could not find a recovery=1 vector in 64 tries",
        )
      }
      const other_hash = parse(
        Hash32Schema,
        bytes_to_hex(other_digest),
      )
      const r_hex = probe.r.toString(16).padStart(64, "0")
      const s_hex = probe.s.toString(16).padStart(64, "0")
      const out_long = new Uint8Array(65)
      const out_short = new Uint8Array(64)
      for (let j = 0; j < 32; j += 1) {
        out_long[j] = Number.parseInt(
          r_hex.slice(j * 2, j * 2 + 2),
          16,
        )
        out_short[j] = out_long[j] as number
        out_long[32 + j] = Number.parseInt(
          s_hex.slice(j * 2, j * 2 + 2),
          16,
        )
        out_short[32 + j] = out_long[32 + j] as number
      }
      out_long[64] = 28
      out_short[32] = (out_short[32] as number) | 0x80
      const long = parse(
        Bytes65Schema,
        bytes_to_hex(out_long),
      )
      const short = parse(
        Bytes64Schema,
        bytes_to_hex(out_short),
      )
      expect(recover_address(other_hash, long)).toEqual(
        recover_address(other_hash, short),
      )
    })
  })
})
