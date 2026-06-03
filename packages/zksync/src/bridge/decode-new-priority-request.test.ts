import {
  encode_sequence,
  event_topic_hash,
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

import {
  decode_new_priority_request_from_receipt,
  decode_new_priority_request_log,
  type L2CanonicalTransaction,
  NEW_PRIORITY_REQUEST_CODECS,
} from "./decode-new-priority-request"

const L2_TX_HASH = parse(
  Bytes32Schema,
  `0x${"ab".repeat(32)}`,
)
const TX_ID = parse(Uint256Schema, "0x2a")
const EXPIRATION = parse(Uint64Schema, "0x64")

function build_canonical(
  overrides?: Partial<L2CanonicalTransaction>,
): L2CanonicalTransaction {
  const zero_u256 = parse(Uint256Schema, "0x0")
  const empty_bytes = parse(BytesSchema, "0x")
  return {
    txType: zero_u256,
    from: zero_u256,
    to: zero_u256,
    gasLimit: zero_u256,
    gasPerPubdataByteLimit: zero_u256,
    maxFeePerGas: zero_u256,
    maxPriorityFeePerGas: zero_u256,
    paymaster: zero_u256,
    nonce: zero_u256,
    value: zero_u256,
    reserved: [zero_u256, zero_u256, zero_u256, zero_u256],
    data: empty_bytes,
    signature: empty_bytes,
    factoryDeps: [],
    paymasterInput: empty_bytes,
    reservedDynamic: empty_bytes,
    ...overrides,
  }
}

const TOPIC0 = event_topic_hash(
  "NewPriorityRequest",
  NEW_PRIORITY_REQUEST_CODECS,
)

function build_event_data(input: {
  tx_id: typeof TX_ID
  tx_hash: typeof L2_TX_HASH
  expiration: typeof EXPIRATION
  canonical: L2CanonicalTransaction
  factory_deps: ReadonlyArray<
    ReturnType<typeof parse<typeof BytesSchema>>
  >
}) {
  return parse(
    BytesSchema,
    bytes_to_hex(
      encode_sequence(NEW_PRIORITY_REQUEST_CODECS, [
        input.tx_id,
        input.tx_hash,
        input.expiration,
        input.canonical,
        input.factory_deps,
      ]),
    ),
  )
}

function build_log(overrides?: Partial<Log>): Log {
  const data = build_event_data({
    tx_id: TX_ID,
    tx_hash: L2_TX_HASH,
    expiration: EXPIRATION,
    canonical: build_canonical({
      value: parse(Uint256Schema, "0xde0b6b3a7640000"),
    }),
    factory_deps: [],
  })
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
    address: parse(
      AddressSchema,
      "0x9999999999999999999999999999999999999999",
    ),
    data,
    topics: [TOPIC0],
    ...overrides,
  }
}

describe("decode_new_priority_request_log", () => {
  it("returns null when topic0 does not match", () => {
    expect(
      decode_new_priority_request_log(
        build_log({
          topics: [
            parse(Bytes32Schema, `0x${"f".repeat(64)}`),
          ],
        }),
      ),
    ).toBeNull()
  })

  it("decodes a matching log into the canonical shape", () => {
    const decoded = decode_new_priority_request_log(
      build_log(),
    )
    expect(decoded).not.toBeNull()
    if (decoded === null) throw new Error("unreachable")
    expect(decoded.tx_hash).toBe(L2_TX_HASH)
    expect(hex_to_bigint(decoded.transaction.value)).toBe(
      10n ** 18n,
    )
    expect(decoded.transaction.reserved).toHaveLength(4)
  })

  it("decodes regardless of the log's emitting address", () => {
    const decoded = decode_new_priority_request_log(
      build_log({
        address: parse(
          AddressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
      }),
    )
    expect(decoded).not.toBeNull()
  })
})

describe("decode_new_priority_request_from_receipt", () => {
  it("returns null when no matching log is present", () => {
    expect(
      decode_new_priority_request_from_receipt({
        logs: [],
      }),
    ).toBeNull()
  })

  it("returns the first matching log when several logs are present", () => {
    const noise_log: Log = {
      ...build_log(),
      topics: [parse(Bytes32Schema, `0x${"e".repeat(64)}`)],
    }
    const decoded =
      decode_new_priority_request_from_receipt({
        logs: [noise_log, build_log()],
      })
    expect(decoded).not.toBeNull()
    if (decoded === null) throw new Error("unreachable")
    expect(decoded.tx_hash).toBe(L2_TX_HASH)
  })
})
