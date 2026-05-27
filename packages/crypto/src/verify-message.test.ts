// Covers the EIP-191 personal-message verifier trio:
//
//   verify_message_deployed   — EOA + EIP-1271
//   verify_message_universal  — EIP-6492 wrapper path
//   verify_message            — router that branches on the
//                                6492 magic-bytes suffix
//
// The SIWE flow in the playground is exactly this surface:
//   build_siwe_message → personal_sign → verify_message_deployed
// so the EOA-branch tests below reproduce that path with a
// known key + mocked `eth_getCode`.

import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import { build_personal_message } from "@ethernauta/eip/191"
import { MAGIC_BYTES } from "@ethernauta/eip/6492"
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
import { parse } from "valibot"
import { describe, expect, it, vi } from "vitest"

import {
  verify_message,
  verify_message_deployed,
  verify_message_universal,
} from "./verify-message"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)
const ADDRESS = parse(
  addressSchema,
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
)
const OTHER_ADDRESS = parse(
  addressSchema,
  "0x1234567890123456789012345678901234567890",
)
const CHAIN_ID = "eip155:1"

function resolved_with(transport: Http): ResolvedReader {
  return [[transport], { chain_id: CHAIN_ID }]
}

function ok(result: unknown) {
  return { jsonrpc: "2.0" as const, id: 1, result }
}

function personal_sign(
  message: string | Uint8Array,
  priv: Uint8Array,
) {
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
  return parse(bytesSchema, bytes_to_hex(out))
}

describe("verify_message_deployed — EOA branch", () => {
  it("returns true for a valid personal_sign over a UTF-8 string", async () => {
    const message = "hello world"
    const signature = personal_sign(message, PRIVATE_KEY)
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_message_deployed({
      address: ADDRESS,
      message,
      signature,
    })(resolved_with(transport))
    expect(result).toBe(true)
    expect(transport).toHaveBeenCalledOnce()
  })

  it("returns true for a SIWE-shaped message (reproduces the playground flow)", async () => {
    const siwe_message = [
      "example.com wants you to sign in with your Ethereum account:",
      ADDRESS,
      "",
      "Sign in to the Ethernauta examples playground.",
      "",
      "URI: https://example.com",
      "Version: 1",
      "Chain ID: 1",
      "Nonce: abc12345",
      "Issued At: 2024-06-01T11:59:00Z",
      "Expiration Time: 2024-06-01T13:00:00Z",
    ].join("\n")
    const signature = personal_sign(
      siwe_message,
      PRIVATE_KEY,
    )
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_message_deployed({
      address: ADDRESS,
      message: siwe_message,
      signature,
    })(resolved_with(transport))
    expect(result).toBe(true)
  })

  it("returns true for a personal_sign over Uint8Array bytes", async () => {
    const bytes = Uint8Array.from(
      new TextEncoder().encode("hello bytes"),
    )
    const signature = personal_sign(bytes, PRIVATE_KEY)
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_message_deployed({
      address: ADDRESS,
      message: bytes,
      signature,
    })(resolved_with(transport))
    expect(result).toBe(true)
  })

  it("returns false when the signature is for a different signer", async () => {
    const message = "hello world"
    const other_priv = hex_to_bytes(
      "0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318",
    )
    const signature = personal_sign(message, other_priv)
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_message_deployed({
      address: ADDRESS,
      message,
      signature,
    })(resolved_with(transport))
    expect(result).toBe(false)
  })

  it("returns false when the expected address is wrong", async () => {
    const message = "hello world"
    const signature = personal_sign(message, PRIVATE_KEY)
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_message_deployed({
      address: OTHER_ADDRESS,
      message,
      signature,
    })(resolved_with(transport))
    expect(result).toBe(false)
  })

  it("returns false (not throws) when eth_getCode rejects", async () => {
    const message = "hello world"
    const signature = personal_sign(message, PRIVATE_KEY)
    const transport = vi
      .fn<Http>()
      .mockRejectedValue(new Error("network down"))
    const result = await verify_message_deployed({
      address: ADDRESS,
      message,
      signature,
    })(resolved_with(transport))
    expect(result).toBe(false)
  })

  it("returns false (not throws) for a structurally invalid signature", async () => {
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_message_deployed({
      address: ADDRESS,
      message: "hello",
      signature: parse(bytesSchema, "0xdeadbeef"),
    })(resolved_with(transport))
    expect(result).toBe(false)
  })
})

describe("verify_message — router on the 6492 wrap suffix", () => {
  it("uses the deployed path when the signature has no wrap suffix", async () => {
    const message = "hello world"
    const signature = personal_sign(message, PRIVATE_KEY)
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_message({
      address: ADDRESS,
      message,
      signature,
    })(resolved_with(transport))
    expect(result).toBe(true)
    // deployed-path on an EOA = one eth_getCode call, no eth_call
    expect(transport).toHaveBeenCalledOnce()
    const [[method]] = transport.mock.calls[0] ?? [[]]
    expect(method).toBe("eth_getCode")
  })

  it("routes wrapped signatures to the universal validator (no eth_getCode short-circuit)", async () => {
    // A signature ending in the 32-byte 6492 magic suffix
    // takes the universal path, which issues an `eth_call`
    // simulating the validator — never the EOA `eth_getCode`
    // probe.
    const wrapped = `0x${"00".repeat(96)}${MAGIC_BYTES.slice(2)}`
    const signature = parse(bytesSchema, wrapped)
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    await verify_message({
      address: ADDRESS,
      message: "hello",
      signature,
    })(resolved_with(transport)).catch(() => undefined)
    const methods = transport.mock.calls.map(
      (call) => call[0][0],
    )
    expect(methods).not.toContain("eth_getCode")
    expect(verify_message_universal).toBeDefined()
  })
})
