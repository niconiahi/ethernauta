import {
  AddressSchema,
  Bytes65Schema,
  BytesSchema,
  Hash32Schema,
} from "@ethernauta/core"
import {
  private_key_to_address,
  recover_address,
} from "@ethernauta/crypto"
import { bytes_to_hex, rlp_decode } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  hash_zksync_transaction,
  type ZksyncTransactionRequest,
} from "./encode-zksync-transaction"
import { sign_zksync_transaction } from "./sign-zksync-transaction"

const PRIVATE_KEY = new Uint8Array([
  0x4c, 0x0b, 0x84, 0x52, 0xc7, 0x4b, 0x18, 0x9d, 0x59,
  0x33, 0xa9, 0x2c, 0xe2, 0x99, 0xc3, 0xfa, 0x83, 0xd7,
  0xc8, 0x6a, 0x2a, 0x69, 0x71, 0x2f, 0xc5, 0xb7, 0x5e,
  0xed, 0xa0, 0xa6, 0x9e, 0x77,
])

function build_request(): ZksyncTransactionRequest {
  return {
    chain_id: 324n,
    nonce: 7n,
    from: private_key_to_address(PRIVATE_KEY),
    to: parse(
      AddressSchema,
      "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ),
    gas_limit: 1_000_000n,
    gas_per_pubdata_byte_limit: 50_000n,
    max_fee_per_gas: 250_000_000n,
    max_priority_fee_per_gas: 0n,
    value: 1_000_000_000_000_000_000n,
    data: parse(BytesSchema, "0x"),
  }
}

function pad_to_32(bytes: Uint8Array): Uint8Array {
  if (bytes.length > 32) throw new Error("too many bytes")
  const out = new Uint8Array(32)
  out.set(bytes, 32 - bytes.length)
  return out
}

describe("sign-zksync-transaction.ts — sign_zksync_transaction", () => {
  it("returns a 0x71-prefixed envelope", () => {
    const envelope = sign_zksync_transaction(
      build_request(),
      PRIVATE_KEY,
    )
    expect(envelope[0]).toBe(0x71)
  })

  it("round-trips through recover_address against the EIP-712 digest", () => {
    const request = build_request()
    const envelope = sign_zksync_transaction(
      request,
      PRIVATE_KEY,
    )
    const decoded = rlp_decode(envelope.slice(1))
    if (!Array.isArray(decoded))
      throw new Error("expected RLP list")
    const v = decoded[7]
    const r = decoded[8]
    const s = decoded[9]
    if (!(v instanceof Uint8Array))
      throw new Error("v must be bytes")
    if (!(r instanceof Uint8Array))
      throw new Error("r must be bytes")
    if (!(s instanceof Uint8Array))
      throw new Error("s must be bytes")
    const recovery = v.length === 0 ? 0 : (v[0] as number)
    expect(recovery === 0 || recovery === 1).toBe(true)
    const signature_bytes = new Uint8Array(65)
    signature_bytes.set(pad_to_32(r), 0)
    signature_bytes.set(pad_to_32(s), 32)
    signature_bytes[64] = 27 + recovery
    const digest = parse(
      Hash32Schema,
      bytes_to_hex(hash_zksync_transaction(request)),
    )
    const recovered = recover_address(
      digest,
      parse(Bytes65Schema, bytes_to_hex(signature_bytes)),
    )
    expect(recovered.toLowerCase()).toBe(
      private_key_to_address(PRIVATE_KEY).toLowerCase(),
    )
  })
})
