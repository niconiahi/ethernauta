// One-off diagnostic for the live Sepolia SIWE regression.
// Walks the same code path verify_siwe_message takes, but
// surfaces every intermediate value so we can see exactly
// which one diverges from the synthetic-transport tests.

import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  addressSchema,
  bytes65Schema,
  bytesSchema,
  hash32Schema,
} from "@ethernauta/core"
import { build_personal_message } from "@ethernauta/eip/191"
import { build_siwe_message } from "@ethernauta/eip/4361"
import { eth_getCode } from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
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
import { describe, expect, it } from "vitest"

import { recover_address } from "./recover"
import { verify_message_deployed } from "./verify-message"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const PRIVATE_KEY = hex_to_bytes(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)
const ADDRESS = parse(
  addressSchema,
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
)

const reader = create_reader([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
])

function personal_sign(message: string, priv: Uint8Array) {
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
  return parse(bytes65Schema, bytes_to_hex(out))
}

const describe_live =
  process.env.ETHERNAUTA_LIVE === "1"
    ? describe
    : describe.skip

describe_live("SIWE live diagnose — Sepolia", () => {
  it("logs every intermediate value down the verify path", async () => {
    const message = build_siwe_message({
      domain: "example.com",
      address: ADDRESS,
      uri: "https://example.com",
      version: "1",
      chainId: String(eip155_11155111.chainId),
      nonce: "abc12345",
      issuedAt: new Date(Date.now() - 60_000).toISOString(),
      expirationTime: new Date(
        Date.now() + 3_600_000,
      ).toISOString(),
    })
    const signature = personal_sign(message, PRIVATE_KEY)
    console.log("SIG          :", signature)
    console.log("SIG length   :", signature.length)
    console.log("SIG v byte   :", signature.slice(-2))

    const prefixed = build_personal_message(message)
    const digest = keccak_256(prefixed)
    const hash = parse(hash32Schema, bytes_to_hex(digest))
    console.log("DIGEST       :", hash)

    const local_recovered = recover_address(hash, signature)
    console.log("RECOVERED    :", local_recovered)
    console.log("EXPECTED     :", ADDRESS)
    console.log(
      "MATCH        :",
      local_recovered.toLowerCase() ===
        ADDRESS.toLowerCase(),
    )

    const resolved = reader({
      chain_id: SEPOLIA_CHAIN_ID,
    })
    const code = await eth_getCode([ADDRESS, "latest"])(
      resolved,
    ).catch((e) => `THREW: ${e.message}`)
    console.log("eth_getCode  :", JSON.stringify(code))
    console.log("CODE === 0x  :", code === "0x")

    const verified = await verify_message_deployed({
      address: ADDRESS,
      message,
      signature: parse(bytesSchema, signature),
    })(resolved)
    console.log("verify_msg   :", verified)

    // Always assert so vitest shows the failure clearly
    expect(verified).toBe(true)
  }, 30_000)
})
