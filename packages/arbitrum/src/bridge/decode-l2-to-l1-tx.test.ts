import {
  address as address_codec,
  bytes as bytes_codec,
  encode_sequence,
  event_topic_hash,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  Uint64Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import type { Log } from "@ethernauta/eth"
import {
  bytes_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { ARB_SYS_ADDRESS } from "../precompiles/arb-sys"
import {
  decode_l2_to_l1_tx_from_receipt,
  decode_l2_to_l1_tx_log,
} from "./decode-l2-to-l1-tx"

const TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const CALLER = parse(
  AddressSchema,
  "0x4444444444444444444444444444444444444444",
)
const PAD12 = "0".repeat(24)
const TOPIC0 = event_topic_hash("L2ToL1Tx", [
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  bytes_codec(),
])
const DEST_TOPIC = parse(
  Bytes32Schema,
  `0x${PAD12}${TARGET.slice(2).toLowerCase()}`,
)
const HASH_TOPIC = parse(
  Bytes32Schema,
  `0x${"a".repeat(64)}`,
)
// position = 0x7b (123)
const POSITION_TOPIC = parse(
  Bytes32Schema,
  `0x${"0".repeat(62)}7b`,
)
const VALUES_DATA = parse(
  BytesSchema,
  bytes_to_hex(
    encode_sequence(
      [
        address_codec(),
        uint256_codec(),
        uint256_codec(),
        uint256_codec(),
        uint256_codec(),
        bytes_codec(),
      ],
      [
        CALLER,
        parse(Uint256Schema, "0x03e8"),
        parse(Uint256Schema, "0x07d0"),
        parse(Uint256Schema, "0x64"),
        parse(Uint256Schema, "0x0de0b6b3a7640000"),
        parse(BytesSchema, "0xdeadbeef"),
      ],
    ),
  ),
)

function build_log(overrides?: Partial<Log>): Log {
  return {
    removed: false,
    logIndex: parse(UintSchema, "0x0"),
    transactionIndex: parse(UintSchema, "0x0"),
    transactionHash: parse(
      Hash32Schema,
      `0x${"b".repeat(64)}`,
    ),
    blockHash: parse(Hash32Schema, `0x${"c".repeat(64)}`),
    blockNumber: parse(UintSchema, "0x1"),
    address: ARB_SYS_ADDRESS,
    data: VALUES_DATA,
    topics: [
      TOPIC0,
      DEST_TOPIC,
      HASH_TOPIC,
      POSITION_TOPIC,
    ],
    ...overrides,
  }
}

describe("decode_l2_to_l1_tx_log", () => {
  it("returns null for logs not from ArbSys", () => {
    const log = build_log({
      address: parse(
        AddressSchema,
        "0x0000000000000000000000000000000000000123",
      ),
    })
    expect(decode_l2_to_l1_tx_log(log)).toBeNull()
  })

  it("returns null when topic0 does not match L2ToL1Tx", () => {
    const log = build_log({
      topics: [
        parse(Bytes32Schema, `0x${"f".repeat(64)}`),
        DEST_TOPIC,
        HASH_TOPIC,
        POSITION_TOPIC,
      ],
    })
    expect(decode_l2_to_l1_tx_log(log)).toBeNull()
  })

  it("decodes a matching log into the canonical shape", () => {
    const decoded = decode_l2_to_l1_tx_log(build_log())
    expect(decoded).not.toBeNull()
    if (decoded === null) throw new Error("unreachable")
    expect(decoded.caller).toBe(CALLER)
    expect(decoded.destination).toBe(TARGET)
    expect(decoded.position).toBe(
      parse(Uint64Schema, "0x7b"),
    )
  })
})

describe("decode_l2_to_l1_tx_from_receipt", () => {
  it("returns the WithdrawalTransaction shape from a receipt's logs", () => {
    const withdrawal = decode_l2_to_l1_tx_from_receipt({
      logs: [build_log()],
    })
    expect(withdrawal).not.toBeNull()
    if (withdrawal === null) throw new Error("unreachable")
    expect(withdrawal.l2Sender).toBe(CALLER)
    expect(withdrawal.to).toBe(TARGET)
    expect(hex_to_bigint(withdrawal.value)).toBe(10n ** 18n)
  })

  it("returns null when no L2ToL1Tx log is in the receipt", () => {
    expect(
      decode_l2_to_l1_tx_from_receipt({ logs: [] }),
    ).toBeNull()
  })
})
