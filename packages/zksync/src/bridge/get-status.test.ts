import {
  bool as bool_codec,
  encode_sequence,
  function_selector,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
  Uint64Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Call,
  Reader,
  ResolvedBridge,
  Response,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import {
  bigint_to_hex,
  bytes_to_hex,
} from "@ethernauta/utils"
import { object, parse, tuple } from "valibot"
import { describe, expect, it } from "vitest"

import { get_status } from "./get-status"

const ERA_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "300",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
// Era Sepolia L1Nullifier — from packages/zksync/src/deploys/eip155-300.ts
const L1_NULLIFIER = parse(
  AddressSchema,
  "0x3E8b2fe58675126ed30d0d12dea2A9bda72D18Ae",
)
const FROM = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const TO = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const L1_TX = parse(
  Hash32Schema,
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
)
const L2_TX = parse(
  Hash32Schema,
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
)
const PROOF_NODE = parse(
  Hash32Schema,
  "0x1111111111111111111111111111111111111111111111111111111111111111",
)
const PROOF_ROOT = parse(
  Hash32Schema,
  "0x3333333333333333333333333333333333333333333333333333333333333333",
)
const LOG_INDEX = 0

const IS_WITHDRAWAL_FINALIZED_SELECTOR = function_selector(
  "isWithdrawalFinalized",
  [uint256_codec(), uint256_codec(), uint256_codec()],
)

const EthCallParamsSchema = tuple([
  object({ to: AddressSchema, input: BytesSchema }),
])
const GetReceiptParamsSchema = tuple([Hash32Schema])

function ok_response<T>(result: T): Response {
  return { jsonrpc: "2.0", id: "1", result }
}

function build_resolved(input: {
  l1: Reader
  l2: Reader
}): ResolvedBridge {
  return {
    l1: { chain_id: SEPOLIA, reader: input.l1 },
    l2: { chain_id: ERA_SEPOLIA, reader: input.l2 },
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
      from: FROM,
      to: TO,
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

function build_withdraw_l1_reader(input: {
  finalized: boolean
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
    if (
      to === L1_NULLIFIER &&
      selector === IS_WITHDRAWAL_FINALIZED_SELECTOR
    ) {
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [bool_codec()],
              [input.finalized],
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

function build_l2_reader_log_proof(
  result: null | {
    proof: `0x${string}`[]
    id: `0x${string}`
    root: `0x${string}`
    batchNumber: `0x${string}`
  },
): Reader {
  return async (call: Call): Promise<Response> => {
    const [method] = call
    if (method !== "zks_getL2ToL1LogProof") {
      throw new Error(`unexpected L2 method ${method}`)
    }
    return ok_response(result)
  }
}

function build_l2_reader_throwing(): Reader {
  return async (call: Call): Promise<Response> => {
    const [method] = call
    if (method !== "zks_getL2ToL1LogProof") {
      throw new Error(`unexpected L2 method ${method}`)
    }
    // Mimic the "no such tx" RPC error shape — error.message
    // is what `zks_getL2ToL1LogProof` rethrows.
    return {
      jsonrpc: "2.0",
      id: "1",
      error: {
        code: -32000,
        message: "transaction not found",
      },
    }
  }
}

describe("get_status (deposit direction)", () => {
  it("returns submitted_l1 when the L1 receipt is missing", async () => {
    const resolved = build_resolved({
      l1: build_deposit_l1_reader({ receipt: null }),
      l2: build_l2_reader_throwing(),
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
      l2: build_l2_reader_throwing(),
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
      l2: build_l2_reader_throwing(),
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
  it("returns initiated_l2 when zks_getL2ToL1LogProof errors (L2 tx not yet indexed)", async () => {
    const resolved = build_resolved({
      l1: build_withdraw_l1_reader({ finalized: false }),
      l2: build_l2_reader_throwing(),
    })
    const status = await get_status({
      direction: "withdraw",
      l2_tx_hash: L2_TX,
      l2_to_l1_log_index: LOG_INDEX,
    })(resolved)
    expect(status).toEqual({ state: "initiated_l2" })
  })

  it("returns batch_pending when zks_getL2ToL1LogProof returns null (batch not yet committed)", async () => {
    const resolved = build_resolved({
      l1: build_withdraw_l1_reader({ finalized: false }),
      l2: build_l2_reader_log_proof(null),
    })
    const status = await get_status({
      direction: "withdraw",
      l2_tx_hash: L2_TX,
      l2_to_l1_log_index: LOG_INDEX,
    })(resolved)
    expect(status).toEqual({ state: "batch_pending" })
  })

  it("returns ready_to_finalize when the proof returns and isWithdrawalFinalized is false", async () => {
    const resolved = build_resolved({
      l1: build_withdraw_l1_reader({ finalized: false }),
      l2: build_l2_reader_log_proof({
        proof: [PROOF_NODE],
        id: parse(Uint64Schema, bigint_to_hex(BigInt(7))),
        root: PROOF_ROOT,
        batchNumber: parse(
          Uint64Schema,
          bigint_to_hex(BigInt(42)),
        ),
      }),
    })
    const status = await get_status({
      direction: "withdraw",
      l2_tx_hash: L2_TX,
      l2_to_l1_log_index: LOG_INDEX,
    })(resolved)
    expect(status).toEqual({ state: "ready_to_finalize" })
  })

  it("returns finalized when isWithdrawalFinalized is true", async () => {
    const resolved = build_resolved({
      l1: build_withdraw_l1_reader({ finalized: true }),
      l2: build_l2_reader_log_proof({
        proof: [PROOF_NODE],
        id: parse(Uint64Schema, bigint_to_hex(BigInt(7))),
        root: PROOF_ROOT,
        batchNumber: parse(
          Uint64Schema,
          bigint_to_hex(BigInt(42)),
        ),
      }),
    })
    const status = await get_status({
      direction: "withdraw",
      l2_tx_hash: L2_TX,
      l2_to_l1_log_index: LOG_INDEX,
    })(resolved)
    expect(status).toEqual({ state: "finalized" })
  })
})
