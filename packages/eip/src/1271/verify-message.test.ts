import type { Address, Bytes } from "@ethernauta/core"
import type { Http, ResolvedReader } from "@ethernauta/transport"
import { bytes_to_hex, hex_to_bytes } from "@ethernauta/utils"
import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha2"
import { keccak_256 } from "@noble/hashes/sha3"
import { etc, sign } from "@noble/secp256k1"
import { describe, expect, it, vi } from "vitest"

import { build_personal_message } from "../191/personal-message"
import { verify_message } from "./verify-message"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)
const EOA_ADDRESS =
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
  for (let i = 0; i < 32; i++) {
    out[i] = Number.parseInt(r.slice(i * 2, i * 2 + 2), 16)
    out[32 + i] = Number.parseInt(
      s.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  out[64] = 27 + sig.recovery
  return bytes_to_hex(out) as Bytes
}

describe("verify-message.ts", () => {
  it("should accept a valid eip-191 signature without touching the network", async () => {
    const message = "hello ethernauta"
    const signature = personal_sign(message, PRIVATE_KEY)
    const transport = vi.fn()
    const result = await verify_message({
      address: EOA_ADDRESS,
      message,
      signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
    expect(transport).not.toHaveBeenCalled()
  })

  it("should reject a signature signed by a different key", async () => {
    const message = "hello ethernauta"
    const signature = personal_sign(
      message,
      hex_to_bytes(
        "0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318",
      ),
    )
    const transport = vi.fn().mockResolvedValue({
      jsonrpc: "2.0" as const,
      id: 1,
      error: { code: -32000 as const, message: "no contract" },
    })
    const result = await verify_message({
      address: EOA_ADDRESS,
      message,
      signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })

  it("should accept a Uint8Array message that matches a viem-style signature", async () => {
    const message = new TextEncoder().encode("bytes msg")
    const signature = personal_sign("bytes msg", PRIVATE_KEY)
    const transport = vi.fn()
    const result = await verify_message({
      address: EOA_ADDRESS,
      message,
      signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
  })
})
