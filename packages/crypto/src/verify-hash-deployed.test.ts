// Covers the EOA-vs-contract dispatch that used to live in
// eip/1271/verify-hash.ts. The on-chain isValidSignature behavior
// stays tested in eip/1271/verify-hash.test.ts; this file owns
// the eth_getCode branch.

import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
} from "@ethernauta/core"
import { MAGIC_VALUE } from "@ethernauta/eip/1271"
import { create_testing_reader } from "@ethernauta/testing"
import type { Http } from "@ethernauta/transport"
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

import { verify_hash_deployed } from "./verify-hash-deployed"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)
const EOA_ADDRESS = parse(
  AddressSchema,
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
)
const CONTRACT_ADDRESS = parse(
  AddressSchema,
  "0x000000000000000000000000000000000000c0de",
)
const OTHER_ADDRESS = parse(
  AddressSchema,
  "0x1234567890123456789012345678901234567890",
)
const CHAIN_ID = "eip155:1"

function sign_to_hex(digest: Uint8Array, priv: Uint8Array) {
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
  return parse(BytesSchema, bytes_to_hex(out))
}

const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

function ok(result: unknown) {
  return { jsonrpc: "2.0" as const, id: 1, result }
}

const DIGEST = keccak_256(
  new TextEncoder().encode("verify-hash-deployed"),
)
const HASH = parse(Hash32Schema, bytes_to_hex(DIGEST))
const VALID_SIGNATURE = sign_to_hex(DIGEST, PRIVATE_KEY)

describe("verify_hash_deployed — EOA branch (eth_getCode 0x)", () => {
  it("returns true when the recovered address matches the target", async () => {
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_hash_deployed(
      EOA_ADDRESS,
      HASH,
      VALID_SIGNATURE,
      testing_reader(transport),
    )
    expect(result).toBe(true)
    expect(transport).toHaveBeenCalledOnce()
  })

  it("returns false when the recovered address differs from the target", async () => {
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_hash_deployed(
      OTHER_ADDRESS,
      HASH,
      VALID_SIGNATURE,
      testing_reader(transport),
    )
    expect(result).toBe(false)
    expect(transport).toHaveBeenCalledOnce()
  })

  it("returns false (not throws) when the signature is structurally invalid", async () => {
    const transport = vi
      .fn<Http>()
      .mockResolvedValue(ok("0x"))
    const result = await verify_hash_deployed(
      EOA_ADDRESS,
      HASH,
      parse(BytesSchema, "0xdeadbeef"),
      testing_reader(transport),
    )
    expect(result).toBe(false)
  })
})

describe("verify_hash_deployed — contract branch (eth_getCode non-empty)", () => {
  const code = "0x6060604052" as const
  const padded_magic =
    `${MAGIC_VALUE}${"0".repeat(56)}` as const

  it("returns true when the contract returns MAGIC_VALUE", async () => {
    const transport = vi.fn<Http>(async (call) => {
      const [method] = call
      if (method === "eth_getCode") return ok(code)
      if (method === "eth_call") return ok(padded_magic)
      throw new Error(`unexpected method ${method}`)
    })
    const result = await verify_hash_deployed(
      CONTRACT_ADDRESS,
      HASH,
      VALID_SIGNATURE,
      testing_reader(transport),
    )
    expect(result).toBe(true)
  })

  it("returns false when the contract returns a non-magic selector", async () => {
    const transport = vi.fn<Http>(async (call) => {
      const [method] = call
      if (method === "eth_getCode") return ok(code)
      if (method === "eth_call")
        return ok(`0xffffffff${"0".repeat(56)}`)
      throw new Error(`unexpected method ${method}`)
    })
    const result = await verify_hash_deployed(
      CONTRACT_ADDRESS,
      HASH,
      VALID_SIGNATURE,
      testing_reader(transport),
    )
    expect(result).toBe(false)
  })
})

describe("verify_hash_deployed — eth_getCode failure", () => {
  it("returns false (not throws) when eth_getCode rejects", async () => {
    const transport = vi
      .fn<Http>()
      .mockRejectedValue(new Error("network down"))
    const result = await verify_hash_deployed(
      EOA_ADDRESS,
      HASH,
      VALID_SIGNATURE,
      testing_reader(transport),
    )
    expect(result).toBe(false)
  })
})
