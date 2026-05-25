// Reproduces the playground SIWE verify route against a
// real Sepolia public RPC (publicnode), so we can tell
// whether the regression lives in the live `eth_getCode`
// response shape vs the synthetic transport mocks the
// unit tests use.
//
// Skipped by default — set ETHERNAUTA_LIVE=1 to run.
//
// Equivalence with `examples/playground/app/lib/auth/reader.server.ts`
// is intentional: identical `create_reader` config, identical
// `verify_siwe_message` invocation, identical
// `bytesSchema` / `addressSchema` parses. If this test goes
// red, the playground flow is broken for the same reason.

import { eip155_11155111 } from "@ethernauta/chain"
import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import { build_personal_message } from "@ethernauta/eip/191"
import { build_siwe_message } from "@ethernauta/eip/4361"
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
import { etc, getPublicKey, sign } from "@noble/secp256k1"
import { HDKey } from "@scure/bip32"
import { mnemonicToSeedSync } from "@scure/bip39"
import { instance, parse } from "valibot"
import { describe, expect, it } from "vitest"

import { verify_siwe_message } from "./verify-siwe"

etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, etc.concatBytes(...m))

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

// Test mnemonic published on the playground home page —
// `examples/playground/app/routes/home.tsx` (TEST_MNEMONIC).
// Account 0 under the wallet's BIP-44 path is the EOA the
// playground onboarding actually signs SIWE from, so it's
// the *exact* address the live regression hits.
const TEST_MNEMONIC =
  "smile price bomb movie minimum treat hurdle adult wing come space cross"
const SEED = mnemonicToSeedSync(TEST_MNEMONIC)
const MASTER = HDKey.fromMasterSeed(SEED)
const CHILD = MASTER.derive("m/44'/60'/0'/0/0")
const PRIVATE_KEY = parse(
  instance(Uint8Array),
  CHILD.privateKey,
)
const PUBLIC_KEY = getPublicKey(PRIVATE_KEY, false)
const ADDRESS_BYTES = keccak_256(PUBLIC_KEY.slice(1)).slice(
  -20,
)
const ADDRESS = parse(
  addressSchema,
  bytes_to_hex(ADDRESS_BYTES),
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
  return parse(bytesSchema, bytes_to_hex(out))
}

const NOW = new Date()
const ISSUED_AT = new Date(
  NOW.getTime() - 60_000,
).toISOString()
const EXPIRATION = new Date(
  NOW.getTime() + 60 * 60 * 1000,
).toISOString()

const describe_live =
  process.env.ETHERNAUTA_LIVE === "1"
    ? describe
    : describe.skip

describe_live(
  "verify_siwe_message — Sepolia publicnode RPC",
  () => {
    it("round-trips a freshly signed SIWE message", async () => {
      const message = build_siwe_message({
        domain: "example.com",
        address: ADDRESS,
        uri: "https://example.com",
        version: "1",
        chainId: String(eip155_11155111.chainId),
        nonce: "abc12345",
        issuedAt: ISSUED_AT,
        expirationTime: EXPIRATION,
        statement:
          "Sign in to the Ethernauta examples playground.",
      })
      const signature = personal_sign(message, PRIVATE_KEY)
      const resolved = reader({
        chain_id: SEPOLIA_CHAIN_ID,
      })
      const result = await verify_siwe_message({
        message,
        signature,
        expected: {
          domain: "example.com",
          nonce: "abc12345",
          chainId: String(eip155_11155111.chainId),
          uri: "https://example.com",
          address: ADDRESS,
        },
        now: NOW,
      })(resolved)
      expect(result).toEqual({
        ok: true,
        fields: expect.objectContaining({
          address: ADDRESS,
          chainId: String(eip155_11155111.chainId),
          nonce: "abc12345",
        }),
      })
    }, 30_000)

    it("rejects a tampered signature against the same RPC", async () => {
      const message = build_siwe_message({
        domain: "example.com",
        address: ADDRESS,
        uri: "https://example.com",
        version: "1",
        chainId: String(eip155_11155111.chainId),
        nonce: "abc12345",
        issuedAt: ISSUED_AT,
        expirationTime: EXPIRATION,
      })
      const good = personal_sign(message, PRIVATE_KEY)
      // Flip a byte in `r` to invalidate without changing length.
      const bytes = hex_to_bytes(good)
      bytes[0] ^= 0x01
      const bad = parse(bytesSchema, bytes_to_hex(bytes))
      const resolved = reader({
        chain_id: SEPOLIA_CHAIN_ID,
      })
      const result = await verify_siwe_message({
        message,
        signature: bad,
        expected: {
          domain: "example.com",
          nonce: "abc12345",
          chainId: String(eip155_11155111.chainId),
        },
        now: NOW,
      })(resolved)
      expect(result).toEqual({
        ok: false,
        reason: "invalid_signature",
      })
    }, 30_000)
  },
)
