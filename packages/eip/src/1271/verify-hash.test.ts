import type { Address, Bytes, Hash32 } from "@ethernauta/core"
import type { Http, ResolvedReader } from "@ethernauta/transport"
import { bytes_to_hex, hex_to_bytes } from "@ethernauta/utils"
import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha2"
import { keccak_256 } from "@noble/hashes/sha3"
import { etc, sign } from "@noble/secp256k1"
import { describe, expect, it, vi } from "vitest"

import { MAGIC_VALUE } from "./magic-value"
import { verify_hash } from "./verify-hash"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)
const EOA_ADDRESS =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as Address
const CONTRACT_ADDRESS =
  "0x000000000000000000000000000000000000c0de" as Address
const CHAIN_ID = "eip155:1"

function sign_to_hex(
  digest: Uint8Array,
  priv: Uint8Array,
): Bytes {
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

function resolved_with(transport: Http): ResolvedReader {
  return [[transport], { chain_id: CHAIN_ID }]
}

function ok_response(result: unknown) {
  return { jsonrpc: "2.0" as const, id: 1, result }
}

function err_response(message: string) {
  return {
    jsonrpc: "2.0" as const,
    id: 1,
    error: { code: -32000 as const, message },
  }
}

const DIGEST = keccak_256(
  new TextEncoder().encode("verify-hash"),
)
const HASH = bytes_to_hex(DIGEST) as Hash32
const VALID_SIGNATURE = sign_to_hex(DIGEST, PRIVATE_KEY)

describe("verify-hash.ts — eoa path", () => {
  it("should return true when ecrecover matches the address", async () => {
    const transport = vi.fn()
    const result = await verify_hash({
      address: EOA_ADDRESS,
      hash: HASH,
      signature: VALID_SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
    expect(transport).not.toHaveBeenCalled()
  })

  it("should fall through to the contract path when ecrecover yields the wrong address", async () => {
    const padded_magic =
      `${MAGIC_VALUE}${"0".repeat(56)}` as const
    const transport = vi
      .fn()
      .mockResolvedValue(ok_response(padded_magic))
    const result = await verify_hash({
      address: CONTRACT_ADDRESS,
      hash: HASH,
      signature: VALID_SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
    expect(transport).toHaveBeenCalledOnce()
  })
})

describe("verify-hash.ts — contract path", () => {
  const wrong_signature = sign_to_hex(
    keccak_256(new TextEncoder().encode("other")),
    PRIVATE_KEY,
  )

  it("should return true when the contract returns the magic value", async () => {
    const padded_magic =
      `${MAGIC_VALUE}${"0".repeat(56)}` as const
    const transport = vi
      .fn()
      .mockResolvedValue(ok_response(padded_magic))
    const result = await verify_hash({
      address: CONTRACT_ADDRESS,
      hash: HASH,
      signature: wrong_signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
  })

  it("should return false when the contract returns a non-magic selector", async () => {
    const transport = vi.fn().mockResolvedValue(
      ok_response(`0xffffffff${"0".repeat(56)}`),
    )
    const result = await verify_hash({
      address: CONTRACT_ADDRESS,
      hash: HASH,
      signature: wrong_signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })

  it("should return false (not throw) when the contract reverts", async () => {
    const transport = vi
      .fn()
      .mockResolvedValue(err_response("execution reverted"))
    const result = await verify_hash({
      address: CONTRACT_ADDRESS,
      hash: HASH,
      signature: wrong_signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })

  it("should return false (not throw) when every transport rejects", async () => {
    const transport = vi
      .fn()
      .mockRejectedValue(new Error("network down"))
    const result = await verify_hash({
      address: CONTRACT_ADDRESS,
      hash: HASH,
      signature: wrong_signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })
})
