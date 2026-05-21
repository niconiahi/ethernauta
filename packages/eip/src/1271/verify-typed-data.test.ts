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
import { etc, sign } from "@noble/secp256k1"
import { describe, expect, it, vi } from "vitest"

import { hash_typed_data } from "../712/hash"
import type { TypedData } from "../712/typed-data"
import { verify_typed_data } from "./verify-typed-data"

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

function sign_typed(
  typed_data: TypedData,
  priv: Uint8Array,
): Bytes {
  const digest = hash_typed_data(typed_data)
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

describe("verify-typed-data.ts", () => {
  it("should accept a valid eip-712 signature without touching the network", async () => {
    const signature = sign_typed(TYPED_DATA, PRIVATE_KEY)
    const transport = vi.fn()
    const result = await verify_typed_data({
      address: EOA_ADDRESS,
      typedData: TYPED_DATA,
      signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
    expect(transport).not.toHaveBeenCalled()
  })

  it("should reject a signature whose recovered address does not match", async () => {
    const wrong_priv = hex_to_bytes(
      "0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318",
    )
    const signature = sign_typed(TYPED_DATA, wrong_priv)
    const transport = vi.fn().mockResolvedValue({
      jsonrpc: "2.0" as const,
      id: 1,
      error: {
        code: -32000 as const,
        message: "execution reverted",
      },
    })
    const result = await verify_typed_data({
      address: EOA_ADDRESS,
      typedData: TYPED_DATA,
      signature,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })
})
