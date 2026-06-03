import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  type DepositTx,
  DepositTxSchema,
} from "../core/deposit-tx"
import { compute_deposit_source_hash } from "./compute-deposit-source-hash"
import { decode_deposit_tx } from "./decode-deposit-tx"
import {
  compute_l2_deposit_tx_hash,
  encode_deposit_tx,
} from "./encode-deposit-tx"

const SOURCE_HASH = parse(
  Hash32Schema,
  `0x${"ab".repeat(32)}`,
)
const SENDER = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const L1_BLOCK_HASH = parse(
  Hash32Schema,
  `0x${"cd".repeat(32)}`,
)

function make_tx(
  overrides: Partial<DepositTx> = {},
): DepositTx {
  return parse(DepositTxSchema, {
    source_hash: SOURCE_HASH,
    from: SENDER,
    to: TARGET,
    mint: parse(UintSchema, "0x0"),
    value: parse(UintSchema, "0x0"),
    gas: parse(UintSchema, "0x186a0"),
    is_system_tx: false,
    data: parse(BytesSchema, "0x"),
    ...overrides,
  })
}

describe("encode_deposit_tx", () => {
  it("prefixes the rlp payload with the 0x7e type byte", () => {
    const encoded = encode_deposit_tx(make_tx())
    expect(encoded[0]).toBe(0x7e)
  })

  it("round-trips a vanilla call deposit", () => {
    const tx = make_tx()
    expect(
      decode_deposit_tx(
        parse(
          BytesSchema,
          bytes_to_hex(encode_deposit_tx(tx)),
        ),
      ),
    ).toStrictEqual(tx)
  })

  it("round-trips a contract-creation deposit (to=null)", () => {
    const tx = make_tx({ to: null })
    expect(
      decode_deposit_tx(
        parse(
          BytesSchema,
          bytes_to_hex(encode_deposit_tx(tx)),
        ),
      ),
    ).toStrictEqual(tx)
  })

  it("round-trips a system deposit", () => {
    const tx = make_tx({ is_system_tx: true })
    expect(
      decode_deposit_tx(
        parse(
          BytesSchema,
          bytes_to_hex(encode_deposit_tx(tx)),
        ),
      ),
    ).toStrictEqual(tx)
  })

  it("round-trips non-zero mint, value, and data", () => {
    const tx = make_tx({
      mint: parse(UintSchema, "0xde0b6b3a7640000"),
      value: parse(UintSchema, "0x1bc16d674ec80000"),
      data: parse(BytesSchema, "0xdeadbeef"),
    })
    expect(
      decode_deposit_tx(
        parse(
          BytesSchema,
          bytes_to_hex(encode_deposit_tx(tx)),
        ),
      ),
    ).toStrictEqual(tx)
  })

  it("rejects payloads missing the 0x7e prefix", () => {
    expect(() =>
      decode_deposit_tx(parse(BytesSchema, "0x02c0")),
    ).toThrow(/0x7e/)
  })
})

describe("compute_deposit_source_hash", () => {
  it("matches the inline keccak(0 || keccak(block_hash || log_index)) construction", () => {
    const log_index = parse(UintSchema, "0x7b")
    const expected_inner = (() => {
      const buf = new Uint8Array(64)
      buf.set(hex_to_bytes(L1_BLOCK_HASH), 0)
      buf[63] = 0x7b
      return keccak_256(buf)
    })()
    const expected = (() => {
      const buf = new Uint8Array(64)
      buf.set(expected_inner, 32)
      return parse(
        Hash32Schema,
        bytes_to_hex(keccak_256(buf)),
      )
    })()
    expect(
      compute_deposit_source_hash({
        l1_block_hash: L1_BLOCK_HASH,
        l1_log_index: log_index,
      }),
    ).toBe(expected)
  })
})

describe("compute_l2_deposit_tx_hash", () => {
  it("equals keccak(encode_deposit_tx(reconstructed tx))", () => {
    const opaque_data = parse(
      BytesSchema,
      // mint(32) || value(32) || gas(8) || isCreation(1) || data(...)
      `0x${"00".repeat(32)}${"00".repeat(32)}${"00".repeat(7)}64${"00"}deadbeef`,
    )
    const log_index = parse(UintSchema, "0x1")
    const fused = compute_l2_deposit_tx_hash({
      from: SENDER,
      to: TARGET,
      opaque_data,
      l1_block_hash: L1_BLOCK_HASH,
      log_index,
    })
    const source_hash = compute_deposit_source_hash({
      l1_block_hash: L1_BLOCK_HASH,
      l1_log_index: log_index,
    })
    const reconstructed = make_tx({
      source_hash,
      mint: parse(UintSchema, "0x0"),
      value: parse(UintSchema, "0x0"),
      gas: parse(UintSchema, "0x64"),
      data: parse(BytesSchema, "0xdeadbeef"),
    })
    const expected = parse(
      Hash32Schema,
      bytes_to_hex(
        keccak_256(encode_deposit_tx(reconstructed)),
      ),
    )
    expect(fused).toBe(expected)
  })

  it("treats the creation byte as the `to=null` switch", () => {
    const opaque_data = parse(
      BytesSchema,
      `0x${"00".repeat(32)}${"00".repeat(32)}${"00".repeat(7)}64${"01"}`,
    )
    const log_index = parse(UintSchema, "0x2")
    const fused = compute_l2_deposit_tx_hash({
      from: SENDER,
      to: TARGET,
      opaque_data,
      l1_block_hash: L1_BLOCK_HASH,
      log_index,
    })
    const source_hash = compute_deposit_source_hash({
      l1_block_hash: L1_BLOCK_HASH,
      l1_log_index: log_index,
    })
    const reconstructed = make_tx({
      source_hash,
      to: null,
      mint: parse(UintSchema, "0x0"),
      value: parse(UintSchema, "0x0"),
      gas: parse(UintSchema, "0x64"),
      data: parse(BytesSchema, "0x"),
    })
    expect(fused).toBe(
      parse(
        Hash32Schema,
        bytes_to_hex(
          keccak_256(encode_deposit_tx(reconstructed)),
        ),
      ),
    )
  })
})
