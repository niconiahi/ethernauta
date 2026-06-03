import {
  array,
  bool as bool_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  encode_sequence,
  event_topic_hash,
  function_selector,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes32,
  Bytes32Schema,
  Bytes256Schema,
  BytesSchema,
  Hash32Schema,
  Uint64Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Call,
  Reader,
  ResolvedBridge,
  Response,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { boolean, object, parse, tuple } from "valibot"
import { describe, expect, it } from "vitest"

import { compute_l2_retryable_tx_hash } from "./encode-retryable-tx"
import {
  ARBITRUM_BRIDGE_STATE,
  get_status,
} from "./get-status"

const ARB_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "421614",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const OUTBOX = parse(
  AddressSchema,
  "0x65f07C7D521164a4d5DaC6eB8Fac8DA067A3B78F",
)
const ARB_SYS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000064",
)
const NODE_INTERFACE = parse(
  AddressSchema,
  "0x00000000000000000000000000000000000000C8",
)
const L2_SENDER = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const L1_TX = parse(
  Hash32Schema,
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
)
const SEND_LEAF = parse(
  Bytes32Schema,
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
)
const SEND_ROOT = parse(
  Bytes32Schema,
  "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
)
const TREE_ROOT = parse(
  Bytes32Schema,
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
)
const ZERO_BYTES32 = parse(
  Bytes32Schema,
  `0x${"0".repeat(64)}`,
)
const CONFIRMED_BLOCK = parse(
  Bytes32Schema,
  `0x${"0".repeat(56)}${"abcdef00"}`,
)

const MESSAGE = {
  position: parse(Uint64Schema, "0x05"),
  l2Sender: L2_SENDER,
  to: TARGET,
  l2Block: parse(Uint256Schema, "0x4d2"),
  l1Block: parse(Uint256Schema, "0x1a4"),
  l2Timestamp: parse(Uint256Schema, "0x65"),
  value: parse(Uint256Schema, "0x0de0b6b3a7640000"),
  data: parse(BytesSchema, "0xdeadbeef"),
}

const IS_SPENT_SELECTOR = function_selector("isSpent", [
  uint256_codec(),
])
const ROOTS_SELECTOR = function_selector("roots", [
  bytes32_codec(),
])
const SEND_MERKLE_TREE_STATE_SELECTOR = function_selector(
  "sendMerkleTreeState",
  [],
)
const CONSTRUCT_OUTBOX_PROOF_SELECTOR = function_selector(
  "constructOutboxProof",
  [uint64_codec(), uint64_codec()],
)

const EthCallParamsSchema = tuple([
  object({ to: AddressSchema, input: BytesSchema }),
])
const GetReceiptParamsSchema = tuple([Hash32Schema])

function ok_response<T>(result: T): Response {
  return { jsonrpc: "2.0", id: "1", result }
}

function build_l2_reader(): Reader {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_call") {
      throw new Error(
        `unexpected L2 method: ${String(method)}`,
      )
    }
    const [{ to, input }] = parse(
      EthCallParamsSchema,
      params,
    )
    const selector = input.slice(0, 10)
    if (
      to === ARB_SYS &&
      selector === SEND_MERKLE_TREE_STATE_SELECTOR
    ) {
      const empty_partials: Bytes32[] = []
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [
                uint256_codec(),
                bytes32_codec(),
                array(bytes32_codec()),
              ],
              [
                parse(Uint256Schema, "0x10"),
                TREE_ROOT,
                empty_partials,
              ],
            ),
          ),
        ),
      )
    }
    if (
      to === NODE_INTERFACE &&
      selector === CONSTRUCT_OUTBOX_PROOF_SELECTOR
    ) {
      const empty_proof: Bytes32[] = []
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [
                bytes32_codec(),
                bytes32_codec(),
                array(bytes32_codec()),
              ],
              [SEND_LEAF, SEND_ROOT, empty_proof],
            ),
          ),
        ),
      )
    }
    throw new Error(
      `unexpected L2 call to=${to} selector=${selector}`,
    )
  }
}

function build_withdraw_l1_reader(input: {
  spent: boolean
  confirmed: boolean
}): Reader {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_call") {
      throw new Error(
        `unexpected L1 method: ${String(method)}`,
      )
    }
    const [{ to, input: data }] = parse(
      EthCallParamsSchema,
      params,
    )
    const selector = data.slice(0, 10)
    if (to === OUTBOX && selector === IS_SPENT_SELECTOR) {
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence([bool_codec()], [input.spent]),
          ),
        ),
      )
    }
    if (to === OUTBOX && selector === ROOTS_SELECTOR) {
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [bytes32_codec()],
              [
                input.confirmed
                  ? CONFIRMED_BLOCK
                  : ZERO_BYTES32,
              ],
            ),
          ),
        ),
      )
    }
    throw new Error(
      `unexpected L1 call to=${to} selector=${selector}`,
    )
  }
}

// Arb Sepolia Inbox proxy — matches
// `eip155_421614_deploys.contracts.inbox`.
const INBOX = parse(
  AddressSchema,
  "0xaAe29B0366299461418F5324a79Afc425BE5ae21",
)
const REFUND_ADDRESS = parse(
  AddressSchema,
  "0x3333333333333333333333333333333333333333",
)
const L1_BLOCK_HASH = parse(
  Hash32Schema,
  `0x${"1".repeat(64)}`,
)
const L1_BASE_FEE = parse(Uint256Schema, "0x07d0")
// ARB_SEPOLIA chain reference 421614 == 0x66eee
const DESTINATION_CHAIN_ID = parse(Uint256Schema, "0x66eee")
const MESSAGE_NUM = parse(Uint256Schema, "0x01")
const MESSAGE_NUM_TOPIC = parse(
  Bytes32Schema,
  `0x${"0".repeat(62)}01`,
)
const INBOX_MESSAGE_DELIVERED_TOPIC0 = event_topic_hash(
  "InboxMessageDelivered",
  [uint256_codec(), bytes_codec()],
)
const LOGS_BLOOM = parse(
  Bytes256Schema,
  `0x${"00".repeat(256)}`,
)

function pad32_uint(value: bigint): string {
  return value.toString(16).padStart(64, "0")
}
function pad32_address(address: `0x${string}`): string {
  return `${"0".repeat(24)}${address.slice(2).toLowerCase()}`
}

// `Inbox._unsafeCreateRetryableTicket` packs the retryable
// parameters via abi.encodePacked — 9 × 32-byte words followed
// by raw inner data. This helper synthesizes that payload for
// fixtures.
function pack_retryable_data(input: {
  to: `0x${string}`
  l2_call_value: bigint
  l1_value: bigint
  max_submission_cost: bigint
  excess_fee_refund: `0x${string}`
  call_value_refund: `0x${string}`
  gas_limit: bigint
  max_fee_per_gas: bigint
  inner_data: `0x${string}`
}) {
  const to_word = pad32_address(input.to)
  const excess_word = pad32_address(input.excess_fee_refund)
  const call_word = pad32_address(input.call_value_refund)
  const inner_hex = input.inner_data.slice(2)
  const inner_length = BigInt(inner_hex.length / 2)
  const packed = `0x${to_word}${pad32_uint(input.l2_call_value)}${pad32_uint(input.l1_value)}${pad32_uint(input.max_submission_cost)}${excess_word}${call_word}${pad32_uint(input.gas_limit)}${pad32_uint(input.max_fee_per_gas)}${pad32_uint(inner_length)}${inner_hex}`
  return parse(BytesSchema, packed)
}

const PACKED_RETRYABLE_DATA = pack_retryable_data({
  to: TARGET,
  l2_call_value: 10n ** 18n,
  l1_value: 10n ** 18n,
  max_submission_cost: 10n ** 15n,
  excess_fee_refund: REFUND_ADDRESS,
  call_value_refund: REFUND_ADDRESS,
  gas_limit: 200000n,
  max_fee_per_gas: 10n ** 9n,
  inner_data: parse(BytesSchema, "0xdeadbeef"),
})

// The InboxMessageDelivered log's `data` field is the standard
// ABI encoding of the single non-indexed `bytes` argument: an
// offset/length wrapper around `PACKED_RETRYABLE_DATA`.
const INBOX_LOG_DATA = parse(
  BytesSchema,
  bytes_to_hex(
    encode_sequence(
      [bytes_codec()],
      [PACKED_RETRYABLE_DATA],
    ),
  ),
)

// Derive expected L2 retryable hash from the same RetryableLog
// shape the production code would build — catches drift between
// fixture and production at assertion time.
const EXPECTED_L2_TX_HASH = compute_l2_retryable_tx_hash({
  sender: L2_SENDER,
  message_num: MESSAGE_NUM,
  data: PACKED_RETRYABLE_DATA,
  destination_chain_id: DESTINATION_CHAIN_ID,
  l1_base_fee: L1_BASE_FEE,
})

const GetBlockByHashParamsSchema = tuple([
  Hash32Schema,
  boolean(),
])

type DepositReceipt =
  | "missing"
  | "reverted"
  | "success_no_log"
  | "success_with_log"

function build_block() {
  return {
    hash: L1_BLOCK_HASH,
    parentHash: parse(Hash32Schema, `0x${"2".repeat(64)}`),
    sha3Uncles: parse(Hash32Schema, `0x${"3".repeat(64)}`),
    miner: REFUND_ADDRESS,
    stateRoot: parse(Hash32Schema, `0x${"4".repeat(64)}`),
    transactionsRoot: parse(
      Hash32Schema,
      `0x${"5".repeat(64)}`,
    ),
    receiptsRoot: parse(
      Hash32Schema,
      `0x${"6".repeat(64)}`,
    ),
    logsBloom: LOGS_BLOOM,
    number: parse(UintSchema, "0x1"),
    gasLimit: parse(UintSchema, "0x1c9c380"),
    gasUsed: parse(UintSchema, "0x5208"),
    timestamp: parse(UintSchema, "0x64"),
    extraData: parse(BytesSchema, "0x"),
    mixHash: parse(Hash32Schema, `0x${"7".repeat(64)}`),
    nonce: parse(BytesSchema, "0x0000000000000000"),
    baseFeePerGas: parse(UintSchema, "0x7d0"),
    size: parse(UintSchema, "0x100"),
    transactions: [],
    uncles: [],
  }
}

function build_deposit_l1_reader(input: {
  receipt: DepositReceipt
}): Reader {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method === "eth_getBlockByHash") {
      parse(GetBlockByHashParamsSchema, params)
      return ok_response(build_block())
    }
    if (method !== "eth_getTransactionReceipt") {
      throw new Error(
        `unexpected L1 method: ${String(method)}`,
      )
    }
    parse(GetReceiptParamsSchema, params)
    if (input.receipt === "missing")
      return ok_response(null)
    const reverted = input.receipt === "reverted"
    const include_log = input.receipt === "success_with_log"
    return ok_response({
      blockHash: L1_BLOCK_HASH,
      blockNumber: parse(UintSchema, "0x1"),
      transactionHash: L1_TX,
      transactionIndex: parse(UintSchema, "0x0"),
      from: L2_SENDER,
      to: TARGET,
      cumulativeGasUsed: parse(UintSchema, "0x5208"),
      effectiveGasPrice: parse(UintSchema, "0x1"),
      gasUsed: parse(UintSchema, "0x5208"),
      contractAddress: null,
      logs: include_log
        ? [
            {
              removed: false,
              logIndex: parse(UintSchema, "0x0"),
              transactionIndex: parse(UintSchema, "0x0"),
              transactionHash: L1_TX,
              blockHash: L1_BLOCK_HASH,
              blockNumber: parse(UintSchema, "0x1"),
              address: INBOX,
              data: INBOX_LOG_DATA,
              topics: [
                INBOX_MESSAGE_DELIVERED_TOPIC0,
                MESSAGE_NUM_TOPIC,
              ],
            },
          ]
        : [],
      logsBloom: LOGS_BLOOM,
      type: parse(UintSchema, "0x2"),
      status: parse(UintSchema, reverted ? "0x0" : "0x1"),
    })
  }
}

function build_deposit_l2_reader(input: {
  l2_status: "missing" | "success" | "reverted"
}): Reader {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_getTransactionReceipt") {
      throw new Error(
        `unexpected L2 method: ${String(method)}`,
      )
    }
    const [hash] = parse(GetReceiptParamsSchema, params)
    if (hash !== EXPECTED_L2_TX_HASH) {
      throw new Error(
        `unexpected L2 hash: ${hash} (want ${EXPECTED_L2_TX_HASH})`,
      )
    }
    if (input.l2_status === "missing")
      return ok_response(null)
    return ok_response({
      blockHash: parse(Hash32Schema, `0x${"a".repeat(64)}`),
      blockNumber: parse(UintSchema, "0x2"),
      transactionHash: EXPECTED_L2_TX_HASH,
      transactionIndex: parse(UintSchema, "0x0"),
      from: L2_SENDER,
      to: TARGET,
      cumulativeGasUsed: parse(UintSchema, "0x5208"),
      effectiveGasPrice: parse(UintSchema, "0x1"),
      gasUsed: parse(UintSchema, "0x5208"),
      contractAddress: null,
      logs: [],
      logsBloom: LOGS_BLOOM,
      type: parse(UintSchema, "0x2"),
      status: parse(
        UintSchema,
        input.l2_status === "success" ? "0x1" : "0x0",
      ),
    })
  }
}

function build_resolved(input: {
  l1: Reader
  l2: Reader
}): ResolvedBridge {
  return {
    l1: { chain_id: SEPOLIA, reader: input.l1 },
    l2: { chain_id: ARB_SEPOLIA, reader: input.l2 },
  }
}

describe("get_status (deposit direction)", () => {
  it("returns submitted_l1 when the L1 receipt is missing", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({ receipt: "missing" }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.SUBMITTED_L1,
    })
  })

  it("returns included_l1 when the L1 receipt reverted", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({ receipt: "reverted" }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.INCLUDED_L1,
      l1_tx_hash: L1_TX,
    })
  })

  it("returns in_progress_l2 when receipt succeeded with no InboxMessageDelivered log", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({
        receipt: "success_no_log",
      }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.IN_PROGRESS_L2,
      l1_tx_hash: L1_TX,
    })
  })

  it("returns in_progress_l2 when the L1 log is present but the L2 receipt is missing", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({
        receipt: "success_with_log",
      }),
      l2: build_deposit_l2_reader({ l2_status: "missing" }),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.IN_PROGRESS_L2,
      l1_tx_hash: L1_TX,
    })
  })

  it("returns succeeded_l2 when the derived L2 retryable receipt has status=1", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({
        receipt: "success_with_log",
      }),
      l2: build_deposit_l2_reader({ l2_status: "success" }),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.SUCCEEDED_L2,
      l1_tx_hash: L1_TX,
      l2_tx_hash: EXPECTED_L2_TX_HASH,
    })
  })

  it("returns failed_l2 when the derived L2 retryable receipt has status=0", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({
        receipt: "success_with_log",
      }),
      l2: build_deposit_l2_reader({
        l2_status: "reverted",
      }),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.FAILED_L2,
      l1_tx_hash: L1_TX,
      l2_tx_hash: EXPECTED_L2_TX_HASH,
    })
  })
})

describe("get_status (withdraw direction)", () => {
  it("returns executed when Outbox.isSpent is true", async () => {
    const resolved = build_resolved({
      l1: build_withdraw_l1_reader({
        spent: true,
        confirmed: false,
      }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "withdraw",
      message: MESSAGE,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.EXECUTED,
    })
  })

  it("returns confirming when the send-root is not yet in Outbox.roots", async () => {
    const resolved = build_resolved({
      l1: build_withdraw_l1_reader({
        spent: false,
        confirmed: false,
      }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "withdraw",
      message: MESSAGE,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.CONFIRMING,
      send_root: SEND_ROOT,
    })
  })

  it("returns executable when the send-root has been confirmed", async () => {
    const resolved = build_resolved({
      l1: build_withdraw_l1_reader({
        spent: false,
        confirmed: true,
      }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "withdraw",
      message: MESSAGE,
    })(resolved)
    expect(status).toEqual({
      state: ARBITRUM_BRIDGE_STATE.EXECUTABLE,
      send_root: SEND_ROOT,
    })
  })
})
