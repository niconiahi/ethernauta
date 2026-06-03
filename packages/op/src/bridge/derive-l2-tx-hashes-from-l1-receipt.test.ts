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
  Bytes256Schema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type { ReceiptInfo } from "@ethernauta/eth"
import { ReceiptInfoSchema } from "@ethernauta/eth"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { derive_l2_tx_hashes_from_l1_receipt } from "./derive-l2-tx-hashes-from-l1-receipt"
import { compute_l2_deposit_tx_hash } from "./encode-deposit-tx"

const PORTAL = parse(
  AddressSchema,
  "0x16Fc5058F25648194471939df75CF27A2fdC48BC",
)
const SENDER_A = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const SENDER_B = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const TARGET_A = parse(
  AddressSchema,
  "0x3333333333333333333333333333333333333333",
)
const TARGET_B = parse(
  AddressSchema,
  "0x4444444444444444444444444444444444444444",
)
const L1_BLOCK_HASH = parse(
  Hash32Schema,
  `0x${"c".repeat(64)}`,
)
const L1_TX_HASH = parse(
  Hash32Schema,
  `0x${"d".repeat(64)}`,
)
const TX_INDEX = parse(UintSchema, "0x1")
const BLOCK_NUMBER = parse(UintSchema, "0x1234")
const LOGS_BLOOM = parse(
  Bytes256Schema,
  `0x${"00".repeat(256)}`,
)
const TRANSACTION_DEPOSITED_TOPIC0 = event_topic_hash(
  "TransactionDeposited",
  [
    address_codec(),
    address_codec(),
    uint256_codec(),
    bytes_codec(),
  ],
)
const PAD12 = "0".repeat(24)
const VERSION_TOPIC = parse(
  Bytes32Schema,
  `0x${"00".repeat(32)}`,
)

function address_topic(address: string) {
  return parse(
    Bytes32Schema,
    `0x${PAD12}${address.slice(2).toLowerCase()}`,
  )
}

function deposit_log(opts: {
  from: string
  to: string
  opaque_data: `0x${string}`
  log_index: string
}) {
  return {
    removed: false,
    logIndex: parse(UintSchema, opts.log_index),
    transactionIndex: TX_INDEX,
    transactionHash: L1_TX_HASH,
    blockHash: L1_BLOCK_HASH,
    blockNumber: BLOCK_NUMBER,
    address: PORTAL,
    data: parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [bytes_codec()],
          [opts.opaque_data],
        ),
      ),
    ),
    topics: [
      TRANSACTION_DEPOSITED_TOPIC0,
      address_topic(opts.from),
      address_topic(opts.to),
      VERSION_TOPIC,
    ],
  }
}

function unrelated_log(opts: { log_index: string }) {
  return {
    removed: false,
    logIndex: parse(UintSchema, opts.log_index),
    transactionIndex: TX_INDEX,
    transactionHash: L1_TX_HASH,
    blockHash: L1_BLOCK_HASH,
    blockNumber: BLOCK_NUMBER,
    address: PORTAL,
    data: parse(BytesSchema, "0xdeadbeef"),
    topics: [parse(Bytes32Schema, `0x${"ab".repeat(32)}`)],
  }
}

function receipt_with(
  logs: ReceiptInfo["logs"],
): ReceiptInfo {
  return parse(ReceiptInfoSchema, {
    blockHash: L1_BLOCK_HASH,
    blockNumber: BLOCK_NUMBER,
    from: SENDER_A,
    cumulativeGasUsed: parse(UintSchema, "0x5208"),
    gasUsed: parse(UintSchema, "0x5208"),
    logs,
    logsBloom: LOGS_BLOOM,
    transactionHash: L1_TX_HASH,
    transactionIndex: TX_INDEX,
    effectiveGasPrice: parse(UintSchema, "0x1"),
    to: PORTAL,
    contractAddress: null,
    status: parse(UintSchema, "0x1"),
  })
}

describe("derive_l2_tx_hashes_from_l1_receipt", () => {
  const OPAQUE_ETH = parse(
    BytesSchema,
    // 32-byte mint(0) + 32-byte value(0) + 8-byte gas(0x186a0) + 1-byte isCreation(0)
    `0x${"00".repeat(32)}${"00".repeat(32)}00000000000186a000`,
  )

  it("returns the single L2 hash for a one-deposit receipt", () => {
    const log = deposit_log({
      from: SENDER_A,
      to: TARGET_A,
      opaque_data: OPAQUE_ETH,
      log_index: "0x3",
    })
    const receipt = receipt_with([log])
    const expected = compute_l2_deposit_tx_hash({
      from: SENDER_A,
      to: TARGET_A,
      opaque_data: OPAQUE_ETH,
      l1_block_hash: L1_BLOCK_HASH,
      log_index: parse(UintSchema, "0x3"),
    })
    expect(
      derive_l2_tx_hashes_from_l1_receipt({
        l1_receipt: receipt,
      }),
    ).toStrictEqual([expected])
  })

  it("returns all hashes in log order for a multicall receipt", () => {
    const receipt = receipt_with([
      deposit_log({
        from: SENDER_A,
        to: TARGET_A,
        opaque_data: OPAQUE_ETH,
        log_index: "0x5",
      }),
      deposit_log({
        from: SENDER_B,
        to: TARGET_B,
        opaque_data: OPAQUE_ETH,
        log_index: "0x9",
      }),
    ])
    const result = derive_l2_tx_hashes_from_l1_receipt({
      l1_receipt: receipt,
    })
    expect(result).toHaveLength(2)
    expect(result[0]).toBe(
      compute_l2_deposit_tx_hash({
        from: SENDER_A,
        to: TARGET_A,
        opaque_data: OPAQUE_ETH,
        l1_block_hash: L1_BLOCK_HASH,
        log_index: parse(UintSchema, "0x5"),
      }),
    )
    expect(result[1]).toBe(
      compute_l2_deposit_tx_hash({
        from: SENDER_B,
        to: TARGET_B,
        opaque_data: OPAQUE_ETH,
        l1_block_hash: L1_BLOCK_HASH,
        log_index: parse(UintSchema, "0x9"),
      }),
    )
  })

  it("returns an empty array for a receipt with no deposit logs", () => {
    const receipt = receipt_with([
      unrelated_log({ log_index: "0x1" }),
    ])
    expect(
      derive_l2_tx_hashes_from_l1_receipt({
        l1_receipt: receipt,
      }),
    ).toStrictEqual([])
  })

  it("skips logs whose topic0 does not match the event signature", () => {
    const receipt = receipt_with([
      unrelated_log({ log_index: "0x1" }),
      deposit_log({
        from: SENDER_A,
        to: TARGET_A,
        opaque_data: OPAQUE_ETH,
        log_index: "0x2",
      }),
      unrelated_log({ log_index: "0x3" }),
    ])
    const result = derive_l2_tx_hashes_from_l1_receipt({
      l1_receipt: receipt,
    })
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(
      compute_l2_deposit_tx_hash({
        from: SENDER_A,
        to: TARGET_A,
        opaque_data: OPAQUE_ETH,
        l1_block_hash: L1_BLOCK_HASH,
        log_index: parse(UintSchema, "0x2"),
      }),
    )
  })

  it("handles a contract-creation deposit (creation byte = 0x01, empty data)", () => {
    const opaque_creation = parse(
      BytesSchema,
      `0x${"00".repeat(32)}${"00".repeat(32)}00000000000186a001`,
    )
    const log = deposit_log({
      from: SENDER_A,
      to: TARGET_A,
      opaque_data: opaque_creation,
      log_index: "0x4",
    })
    const receipt = receipt_with([log])
    const expected = compute_l2_deposit_tx_hash({
      from: SENDER_A,
      to: TARGET_A,
      opaque_data: opaque_creation,
      l1_block_hash: L1_BLOCK_HASH,
      log_index: parse(UintSchema, "0x4"),
    })
    expect(
      derive_l2_tx_hashes_from_l1_receipt({
        l1_receipt: receipt,
      }),
    ).toStrictEqual([expected])
  })
})
