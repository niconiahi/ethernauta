import {
  address as address_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  encode_sequence,
  event_topic_hash,
} from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type { Log } from "@ethernauta/eth"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { L1_MESSENGER_ADDRESS } from "../system-contracts/l1-messenger/address"
import {
  decode_l1_message_sent_from_receipt,
  decode_l1_message_sent_log,
} from "./decode-l1-message-sent"

const SENDER = parse(
  AddressSchema,
  "0x000000000000000000000000000000000000800a",
)
const MESSAGE = parse(BytesSchema, "0xfeedface")
const PAD12 = "0".repeat(24)
const TOPIC0 = event_topic_hash("L1MessageSent", [
  address_codec(),
  bytes32_codec(),
  bytes_codec(),
])
const SENDER_TOPIC = parse(
  Bytes32Schema,
  `0x${PAD12}${SENDER.slice(2).toLowerCase()}`,
)
const HASH_TOPIC = parse(
  Bytes32Schema,
  `0x${"a".repeat(64)}`,
)
const MESSAGE_DATA = parse(
  BytesSchema,
  bytes_to_hex(encode_sequence([bytes_codec()], [MESSAGE])),
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
    address: L1_MESSENGER_ADDRESS,
    data: MESSAGE_DATA,
    topics: [TOPIC0, SENDER_TOPIC, HASH_TOPIC],
    ...overrides,
  }
}

describe("decode_l1_message_sent_log", () => {
  it("returns null for non-L1Messenger logs", () => {
    expect(
      decode_l1_message_sent_log(
        build_log({
          address: parse(
            AddressSchema,
            "0x0000000000000000000000000000000000000123",
          ),
        }),
      ),
    ).toBeNull()
  })

  it("returns null when topic0 does not match", () => {
    expect(
      decode_l1_message_sent_log(
        build_log({
          topics: [
            parse(Bytes32Schema, `0x${"f".repeat(64)}`),
            SENDER_TOPIC,
            HASH_TOPIC,
          ],
        }),
      ),
    ).toBeNull()
  })

  it("decodes a matching log into the canonical shape", () => {
    const decoded = decode_l1_message_sent_log(build_log())
    expect(decoded).not.toBeNull()
    if (decoded === null) throw new Error("unreachable")
    expect(decoded.sender).toBe(SENDER)
    expect(decoded.message).toBe(MESSAGE)
  })
})

describe("decode_l1_message_sent_from_receipt", () => {
  it("returns null when no matching log is present", () => {
    expect(
      decode_l1_message_sent_from_receipt({ logs: [] }),
    ).toBeNull()
  })

  it("filters by expected_sender when provided", () => {
    const other_sender_log = build_log({
      topics: [
        TOPIC0,
        parse(
          Bytes32Schema,
          `0x${PAD12}${"22".repeat(20)}`,
        ),
        HASH_TOPIC,
      ],
    })
    expect(
      decode_l1_message_sent_from_receipt({
        logs: [other_sender_log],
        expected_sender: SENDER,
      }),
    ).toBeNull()
    expect(
      decode_l1_message_sent_from_receipt({
        logs: [build_log()],
        expected_sender: SENDER,
      }),
    ).not.toBeNull()
  })

  it("returns the decoded log when no filter is provided", () => {
    const decoded = decode_l1_message_sent_from_receipt({
      logs: [build_log()],
    })
    expect(decoded).not.toBeNull()
    if (decoded === null) throw new Error("unreachable")
    expect(decoded.sender).toBe(SENDER)
    expect(decoded.message).toBe(MESSAGE)
  })
})
