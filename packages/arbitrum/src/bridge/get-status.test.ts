import {
  array,
  bool as bool_codec,
  bytes32 as bytes32_codec,
  encode_sequence,
  function_selector,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes32,
  Bytes32Schema,
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
import { object, parse, tuple } from "valibot"
import { describe, expect, it } from "vitest"

import { get_status } from "./get-status"

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
            encode_sequence(
              [bool_codec()],
              [input.spent],
            ),
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

function build_deposit_l1_reader(input: {
  receipt: null | { status: `0x${string}` }
}): Reader {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_getTransactionReceipt") {
      throw new Error(
        `unexpected L1 method: ${String(method)}`,
      )
    }
    parse(GetReceiptParamsSchema, params)
    if (input.receipt === null) return ok_response(null)
    return ok_response({
      blockHash: parse(Hash32Schema, `0x${"1".repeat(64)}`),
      blockNumber: parse(UintSchema, "0x1"),
      transactionHash: L1_TX,
      transactionIndex: parse(UintSchema, "0x0"),
      from: L2_SENDER,
      to: TARGET,
      cumulativeGasUsed: parse(UintSchema, "0x5208"),
      effectiveGasPrice: parse(UintSchema, "0x1"),
      gasUsed: parse(UintSchema, "0x5208"),
      contractAddress: null,
      logs: [],
      logsBloom: parse(
        BytesSchema,
        `0x${"00".repeat(256)}`,
      ),
      type: parse(UintSchema, "0x2"),
      status: input.receipt.status,
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
      l1: build_deposit_l1_reader({ receipt: null }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({ state: "submitted_l1" })
  })

  it("returns included_l1 when the L1 receipt reverted", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({
        receipt: { status: parse(UintSchema, "0x0") },
      }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({
      state: "included_l1",
      l1_tx_hash: L1_TX,
    })
  })

  it("returns in_progress_l2 when the L1 receipt succeeded", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({
        receipt: { status: parse(UintSchema, "0x1") },
      }),
      l2: build_l2_reader(),
    })
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: L1_TX,
    })(resolved)
    expect(status).toEqual({
      state: "in_progress_l2",
      l1_tx_hash: L1_TX,
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
    expect(status).toEqual({ state: "executed" })
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
      state: "confirming",
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
      state: "executable",
      send_root: SEND_ROOT,
    })
  })
})
