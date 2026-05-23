import type { Address, Bytes } from "@ethernauta/core"
import type {
  Http,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha2"
import { keccak_256 } from "@noble/hashes/sha3"
import { etc, sign } from "@noble/secp256k1"
import { describe, expect, it, vi } from "vitest"

import { build_personal_message } from "@ethernauta/eip/191"
import { build_siwe_message } from "@ethernauta/eip/4361"
import { verify_siwe_message } from "./verify-siwe"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)
const ADDRESS =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as Address
const CHAIN_ID = "eip155:1"

function resolved_with(transport: Http): ResolvedReader {
  return [[transport], { chain_id: CHAIN_ID }]
}

function personal_sign(
  message: string,
  priv: Uint8Array,
): Bytes {
  const digest = keccak_256(build_personal_message(message))
  const sig = sign(digest, priv)
  const out = new Uint8Array(65)
  const r = sig.r.toString(16).padStart(64, "0")
  const s = sig.s.toString(16).padStart(64, "0")
  for (let i = 0; i < 32; i += 1) {
    out[i] = Number.parseInt(r.slice(i * 2, i * 2 + 2), 16)
    out[32 + i] = Number.parseInt(
      s.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  out[64] = 27 + sig.recovery
  return bytes_to_hex(out) as Bytes
}

const NOW = new Date("2024-06-01T12:00:00Z")

function valid_fields() {
  return {
    domain: "example.com",
    address: ADDRESS,
    uri: "https://example.com",
    version: "1",
    chainId: "1",
    nonce: "abc12345",
    issuedAt: "2024-06-01T11:59:00Z",
    expirationTime: "2024-06-01T13:00:00Z",
  }
}

describe("verify.ts — verify_siwe_message", () => {
  it("should accept a valid EOA SIWE flow without touching the network", async () => {
    const message = build_siwe_message(valid_fields())
    const signature = personal_sign(message, PRIVATE_KEY)
    const transport = vi.fn()
    const result = await verify_siwe_message({
      message,
      signature,
      expected: {
        domain: "example.com",
        nonce: "abc12345",
        chainId: "1",
        uri: "https://example.com",
        address: ADDRESS,
      },
      now: NOW,
    })(resolved_with(transport as unknown as Http))
    expect(result).toEqual({
      ok: true,
      fields: valid_fields(),
    })
    expect(transport).not.toHaveBeenCalled()
  })

  it("should reject when the domain does not match", async () => {
    const message = build_siwe_message(valid_fields())
    const signature = personal_sign(message, PRIVATE_KEY)
    const result = await verify_siwe_message({
      message,
      signature,
      expected: {
        domain: "phisher.com",
        nonce: "abc12345",
      },
      now: NOW,
    })(resolved_with(vi.fn() as unknown as Http))
    expect(result).toEqual({
      ok: false,
      reason: "domain_mismatch",
    })
  })

  it("should reject when the nonce does not match", async () => {
    const message = build_siwe_message(valid_fields())
    const signature = personal_sign(message, PRIVATE_KEY)
    const result = await verify_siwe_message({
      message,
      signature,
      expected: {
        domain: "example.com",
        nonce: "not-the-nonce",
      },
      now: NOW,
    })(resolved_with(vi.fn() as unknown as Http))
    expect(result).toEqual({
      ok: false,
      reason: "nonce_mismatch",
    })
  })

  it("should reject when the message has expired", async () => {
    const message = build_siwe_message(valid_fields())
    const signature = personal_sign(message, PRIVATE_KEY)
    const result = await verify_siwe_message({
      message,
      signature,
      expected: {
        domain: "example.com",
        nonce: "abc12345",
      },
      now: new Date("2024-06-01T14:00:00Z"),
    })(resolved_with(vi.fn() as unknown as Http))
    expect(result).toEqual({
      ok: false,
      reason: "expired",
    })
  })

  it("should reject when notBefore is in the future", async () => {
    const message = build_siwe_message({
      ...valid_fields(),
      notBefore: "2024-06-02T00:00:00Z",
    })
    const signature = personal_sign(message, PRIVATE_KEY)
    const result = await verify_siwe_message({
      message,
      signature,
      expected: {
        domain: "example.com",
        nonce: "abc12345",
      },
      now: NOW,
    })(resolved_with(vi.fn() as unknown as Http))
    expect(result).toEqual({
      ok: false,
      reason: "not_yet_valid",
    })
  })

  it("should reject when the signature is for a different key (falls through to 1271/6492 transport, which errors)", async () => {
    const message = build_siwe_message(valid_fields())
    const signature = personal_sign(
      message,
      hex_to_bytes(
        "0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318",
      ),
    )
    const transport = vi.fn().mockResolvedValue({
      jsonrpc: "2.0" as const,
      id: 1,
      error: {
        code: -32000 as const,
        message: "no contract",
      },
    })
    const result = await verify_siwe_message({
      message,
      signature,
      expected: {
        domain: "example.com",
        nonce: "abc12345",
      },
      now: NOW,
    })(resolved_with(transport as unknown as Http))
    expect(result).toEqual({
      ok: false,
      reason: "invalid_signature",
    })
  })

  it("should reject when the message is not SIWE-shaped", async () => {
    const result = await verify_siwe_message({
      message: "just hello",
      signature: "0x00" as Bytes,
      expected: { domain: "example.com", nonce: "x" },
      now: NOW,
    })(resolved_with(vi.fn() as unknown as Http))
    expect(result).toEqual({
      ok: false,
      reason: "malformed_message",
    })
  })
})
