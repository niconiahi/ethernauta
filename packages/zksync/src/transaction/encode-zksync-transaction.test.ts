import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import { bytes_to_hex, rlp_decode } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  build_zksync_typed_data,
  encode_zksync_transaction,
  hash_bytecode,
  type ZksyncTransactionRequest,
} from "./encode-zksync-transaction"

const SENDER = parse(
  AddressSchema,
  "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",
)
const RECIPIENT = parse(
  AddressSchema,
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
)

function base_request(): ZksyncTransactionRequest {
  return {
    chain_id: 324n,
    nonce: 0n,
    from: SENDER,
    to: RECIPIENT,
    gas_limit: 1_000_000n,
    gas_per_pubdata_byte_limit: 50_000n,
    max_fee_per_gas: 250_000_000n,
    max_priority_fee_per_gas: 0n,
    value: 1_000_000_000_000_000_000n,
    data: parse(BytesSchema, "0x"),
  }
}

describe("encode-zksync-transaction.ts — hash_bytecode", () => {
  // sha256(0x00 * 32) = 66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925
  // Replace bytes [0..4] with [0x01, 0x00, 0x00, 0x01] (1 word, big-endian u16).
  it("applies the EraVM header to sha256(bytecode)", () => {
    const bytecode = new Uint8Array(32)
    expect(bytes_to_hex(hash_bytecode(bytecode))).toBe(
      "0x01000001f862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925",
    )
  })

  it("rejects empty bytecode", () => {
    expect(() => hash_bytecode(new Uint8Array(0))).toThrow(
      /non-empty/,
    )
  })

  it("rejects bytecode whose length is not a multiple of 32", () => {
    expect(() => hash_bytecode(new Uint8Array(31))).toThrow(
      /multiple of 32/,
    )
  })

  it("rejects bytecode with an even number of 32-byte words", () => {
    expect(() => hash_bytecode(new Uint8Array(64))).toThrow(
      /odd number of 32-byte words/,
    )
  })
})

describe("encode-zksync-transaction.ts — build_zksync_typed_data", () => {
  it("emits the Transaction struct with sensible defaults", () => {
    const typed = build_zksync_typed_data(base_request())
    expect(typed.primaryType).toBe("Transaction")
    expect(typed.domain.name).toBe("zkSync")
    expect(typed.message.txType).toBe(0x71n)
    expect(typed.message.paymaster).toBe(
      "0x0000000000000000000000000000000000000000",
    )
    expect(typed.message.factoryDeps).toStrictEqual([])
    expect(typed.message.paymasterInput).toBe("0x")
  })

  it("hashes factory deps into the bytes32[] field", () => {
    const dep = parse(BytesSchema, `0x${"00".repeat(32)}`)
    const typed = build_zksync_typed_data({
      ...base_request(),
      factory_deps: [dep],
    })
    expect(typed.message.factoryDeps).toStrictEqual([
      "0x01000001f862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925",
    ])
  })
})

describe("encode-zksync-transaction.ts — encode_zksync_transaction", () => {
  it("produces a 0x71-prefixed RLP list of 16 fields", () => {
    const envelope = encode_zksync_transaction(
      base_request(),
      { r: 1n, s: 2n, recovery: 0 },
    )
    expect(envelope[0]).toBe(0x71)
    const decoded = rlp_decode(envelope.slice(1))
    expect(Array.isArray(decoded)).toBe(true)
    if (!Array.isArray(decoded)) return
    expect(decoded.length).toBe(16)
  })

  it("places fields in the canonical envelope order", () => {
    const request = base_request()
    const envelope = encode_zksync_transaction(request, {
      r: 0x11n,
      s: 0x22n,
      recovery: 1,
    })
    const decoded = rlp_decode(envelope.slice(1))
    if (!Array.isArray(decoded))
      throw new Error("expected RLP list")
    const nonce = decoded[0]
    const max_priority = decoded[1]
    const max_fee = decoded[2]
    const gas_limit = decoded[3]
    const to = decoded[4]
    const v = decoded[7]
    const r = decoded[8]
    const s = decoded[9]
    const chain_id = decoded[10]
    const from = decoded[11]
    const factory_deps = decoded[13]
    const paymaster_params = decoded[15]
    if (!(nonce instanceof Uint8Array))
      throw new Error("nonce must be bytes")
    if (!(max_priority instanceof Uint8Array))
      throw new Error("max_priority must be bytes")
    if (!(max_fee instanceof Uint8Array))
      throw new Error("max_fee must be bytes")
    if (!(gas_limit instanceof Uint8Array))
      throw new Error("gas_limit must be bytes")
    if (!(to instanceof Uint8Array))
      throw new Error("to must be bytes")
    if (!(v instanceof Uint8Array))
      throw new Error("v must be bytes")
    if (!(r instanceof Uint8Array))
      throw new Error("r must be bytes")
    if (!(s instanceof Uint8Array))
      throw new Error("s must be bytes")
    if (!(chain_id instanceof Uint8Array))
      throw new Error("chain_id must be bytes")
    if (!(from instanceof Uint8Array))
      throw new Error("from must be bytes")
    if (!Array.isArray(factory_deps))
      throw new Error("factory_deps must be list")
    if (!Array.isArray(paymaster_params))
      throw new Error("paymaster_params must be list")
    expect(nonce.length).toBe(0)
    expect(bytes_to_hex(max_priority)).toBe("0x")
    expect(bytes_to_hex(max_fee)).toBe("0x0ee6b280")
    expect(bytes_to_hex(gas_limit)).toBe("0x0f4240")
    expect(bytes_to_hex(to)).toBe(request.to.toLowerCase())
    expect(bytes_to_hex(v)).toBe("0x01")
    expect(bytes_to_hex(r)).toBe("0x11")
    expect(bytes_to_hex(s)).toBe("0x22")
    expect(bytes_to_hex(chain_id)).toBe("0x0144")
    expect(bytes_to_hex(from)).toBe(
      request.from.toLowerCase(),
    )
    expect(factory_deps.length).toBe(0)
    expect(paymaster_params.length).toBe(0)
  })

  it("emits [paymaster, paymasterInput] when a paymaster is set", () => {
    const paymaster = parse(
      AddressSchema,
      "0x1111111111111111111111111111111111111111",
    )
    const envelope = encode_zksync_transaction(
      {
        ...base_request(),
        paymaster,
        paymaster_input: parse(BytesSchema, "0xdeadbeef"),
      },
      { r: 0n, s: 0n, recovery: 0 },
    )
    const decoded = rlp_decode(envelope.slice(1))
    if (!Array.isArray(decoded))
      throw new Error("expected RLP list")
    const paymaster_params = decoded[15]
    if (!Array.isArray(paymaster_params))
      throw new Error("paymaster_params must be list")
    expect(paymaster_params.length).toBe(2)
    const paymaster_bytes = paymaster_params[0]
    const paymaster_input_bytes = paymaster_params[1]
    if (!(paymaster_bytes instanceof Uint8Array))
      throw new Error("paymaster must be bytes")
    if (!(paymaster_input_bytes instanceof Uint8Array))
      throw new Error("paymaster_input must be bytes")
    expect(bytes_to_hex(paymaster_bytes)).toBe(paymaster)
    expect(bytes_to_hex(paymaster_input_bytes)).toBe(
      "0xdeadbeef",
    )
  })
})
