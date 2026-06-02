import {
  address as address_codec,
  bool as bool_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  encode_sequence,
  event_topic_hash,
  function_selector,
  uint8 as uint8_codec,
  uint32 as uint32_codec,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  Uint8Schema,
  Uint32Schema,
  Uint64Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Call,
  Dispatcher,
  ResolvedBridge,
  Response,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { object, parse, tuple } from "valibot"
import { describe, expect, it } from "vitest"
import { compute_l2_deposit_tx_hash } from "./encode-deposit-tx"
import { get_status } from "./get-status"

const OP_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155420",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const SENDER = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const PROVER = parse(
  AddressSchema,
  "0x3333333333333333333333333333333333333333",
)
const GAME_PROXY = parse(
  AddressSchema,
  "0xAAaaaAaaaaaaAaaaaaaaAaaAaaaaaAaAAaaaaaAA",
)
const ZERO_ADDRESS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000000",
)
const WITHDRAWAL_TRANSACTION = {
  nonce: parse(Uint256Schema, "0x01"),
  sender: SENDER,
  target: TARGET,
  value: parse(Uint256Schema, "0x0de0b6b3a7640000"),
  gasLimit: parse(Uint256Schema, "0x030d40"),
  data: parse(BytesSchema, "0xdeadbeef"),
}
const WITHDRAWAL_L2_BLOCK = parse(
  Uint256Schema,
  "0x000000000000000000000000000000000000000000000000000000000000007b",
)
const GAME_L2_BLOCK = parse(
  Uint256Schema,
  "0x00000000000000000000000000000000000000000000000000000000000003e8",
)
const GAME_TIMESTAMP = parse(Uint64Schema, "0x64")
const PROOF_MATURITY = parse(Uint256Schema, "0xa8c0")
const FINALITY_DELAY = parse(Uint256Schema, "0xa8c0")

const FINALIZED_WITHDRAWALS_SELECTOR = function_selector(
  "finalizedWithdrawals",
  [bytes32_codec()],
)
const PROVEN_WITHDRAWALS_SELECTOR = function_selector(
  "provenWithdrawals",
  [bytes32_codec(), address_codec()],
)
const RESPECTED_GAME_TYPE_SELECTOR = function_selector(
  "respectedGameType",
  [],
)
const GAME_COUNT_SELECTOR = function_selector(
  "gameCount",
  [],
)
const GAME_AT_INDEX_SELECTOR = function_selector(
  "gameAtIndex",
  [uint256_codec()],
)
const WAS_RESPECTED_SELECTOR = function_selector(
  "wasRespectedGameTypeWhenCreated",
  [],
)
const STATUS_SELECTOR = function_selector("status", [])
const L2_BLOCK_NUMBER_SELECTOR = function_selector(
  "l2BlockNumber",
  [],
)
const RESOLVED_AT_SELECTOR = function_selector(
  "resolvedAt",
  [],
)
const PROOF_MATURITY_SELECTOR = function_selector(
  "proofMaturityDelaySeconds",
  [],
)
const FINALITY_DELAY_SELECTOR = function_selector(
  "disputeGameFinalityDelaySeconds",
  [],
)
const IS_GAME_BLACKLISTED_SELECTOR = function_selector(
  "isGameBlacklisted",
  [address_codec()],
)
const GET_TX_RECEIPT_HASH = parse(
  Hash32Schema,
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
)

function ok_response<T>(result: T): Response {
  return { jsonrpc: "2.0", id: "1", result }
}

const EthCallParamsSchema = tuple([
  object({ to: AddressSchema, input: BytesSchema }),
])

type L1Behavior = Readonly<{
  finalized?: boolean
  proven_game?: typeof ZERO_ADDRESS
  proven_timestamp?: typeof GAME_TIMESTAMP
  game_count?: bigint
  game_status?: typeof STATUS_DEFENDER_WINS_BYTE
  game_resolved_at?: typeof GAME_TIMESTAMP
  was_respected?: boolean
  blacklisted?: boolean
  game_l2_block?: typeof GAME_L2_BLOCK
  latest_timestamp?: typeof GAME_TIMESTAMP
}>

const STATUS_DEFENDER_WINS_BYTE = parse(Uint8Schema, "0x2")
const STATUS_IN_PROGRESS_BYTE = parse(Uint8Schema, "0x0")
const STATUS_CHALLENGER_WINS_BYTE = parse(
  Uint8Schema,
  "0x1",
)
const RESPECTED_GAME_TYPE = parse(Uint32Schema, "0x1")

function build_l1_reader(opts: L1Behavior): Dispatcher {
  const finalized = opts.finalized ?? false
  const proven_game = opts.proven_game ?? ZERO_ADDRESS
  const proven_timestamp =
    opts.proven_timestamp ?? parse(Uint64Schema, "0x0")
  const game_count = opts.game_count ?? 0n
  const game_status =
    opts.game_status ?? STATUS_DEFENDER_WINS_BYTE
  const game_resolved_at =
    opts.game_resolved_at ?? GAME_TIMESTAMP
  const was_respected = opts.was_respected ?? true
  const blacklisted = opts.blacklisted ?? false
  const game_l2_block = opts.game_l2_block ?? GAME_L2_BLOCK
  const latest_timestamp =
    opts.latest_timestamp ??
    parse(Uint64Schema, "0xffffffff")
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method === "eth_getBlockByNumber") {
      return ok_response({
        hash: parse(Hash32Schema, `0x${"a".repeat(64)}`),
        parentHash: parse(
          Hash32Schema,
          `0x${"4".repeat(64)}`,
        ),
        sha3Uncles: parse(
          Hash32Schema,
          "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        ),
        miner: ZERO_ADDRESS,
        stateRoot: parse(
          Hash32Schema,
          `0x${"d".repeat(64)}`,
        ),
        transactionsRoot: parse(
          Hash32Schema,
          `0x${"9".repeat(64)}`,
        ),
        receiptsRoot: parse(
          Hash32Schema,
          "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        ),
        logsBloom: parse(
          BytesSchema,
          `0x${"00".repeat(256)}`,
        ),
        number: parse(UintSchema, "0x1"),
        gasLimit: parse(UintSchema, "0x1c9c380"),
        gasUsed: parse(UintSchema, "0x0"),
        timestamp: latest_timestamp,
        extraData: parse(BytesSchema, "0x"),
        mixHash: parse(Hash32Schema, `0x${"1".repeat(64)}`),
        nonce: parse(BytesSchema, "0x0000000000000000"),
        size: parse(UintSchema, "0x200"),
        transactions: [],
        uncles: [],
      })
    }
    if (method !== "eth_call") {
      throw new Error(
        `unexpected method: ${String(method)}`,
      )
    }
    const [{ input }] = parse(EthCallParamsSchema, params)
    const selector = input.slice(0, 10)
    if (selector === FINALIZED_WITHDRAWALS_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence([bool_codec()], [finalized]),
          ),
        ),
      )
    if (selector === PROVEN_WITHDRAWALS_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [address_codec(), uint64_codec()],
              [proven_game, proven_timestamp],
            ),
          ),
        ),
      )
    if (selector === RESPECTED_GAME_TYPE_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [uint32_codec()],
              [RESPECTED_GAME_TYPE],
            ),
          ),
        ),
      )
    if (selector === GAME_COUNT_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [uint256_codec()],
              [
                parse(
                  Uint256Schema,
                  `0x${game_count.toString(16) || "0"}`,
                ),
              ],
            ),
          ),
        ),
      )
    if (selector === GAME_AT_INDEX_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [
                uint32_codec(),
                uint64_codec(),
                address_codec(),
              ],
              [
                RESPECTED_GAME_TYPE,
                GAME_TIMESTAMP,
                GAME_PROXY,
              ],
            ),
          ),
        ),
      )
    if (selector === WAS_RESPECTED_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [bool_codec()],
              [was_respected],
            ),
          ),
        ),
      )
    if (selector === STATUS_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence([uint8_codec()], [game_status]),
          ),
        ),
      )
    if (selector === L2_BLOCK_NUMBER_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [uint256_codec()],
              [game_l2_block],
            ),
          ),
        ),
      )
    if (selector === RESOLVED_AT_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [uint64_codec()],
              [game_resolved_at],
            ),
          ),
        ),
      )
    if (selector === PROOF_MATURITY_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [uint256_codec()],
              [PROOF_MATURITY],
            ),
          ),
        ),
      )
    if (selector === FINALITY_DELAY_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence(
              [uint256_codec()],
              [FINALITY_DELAY],
            ),
          ),
        ),
      )
    if (selector === IS_GAME_BLACKLISTED_SELECTOR)
      return ok_response(
        parse(
          BytesSchema,
          bytes_to_hex(
            encode_sequence([bool_codec()], [blacklisted]),
          ),
        ),
      )
    throw new Error(`unexpected L1 selector: ${selector}`)
  }
}

function build_resolved(l1: Dispatcher): ResolvedBridge {
  return {
    origin: {
      chain_id: OP_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "origin reader should not be invoked from withdraw status",
        )
      },
    },
    destination: { chain_id: SEPOLIA, reader: l1 },
  }
}

describe("get_status (withdraw)", () => {
  it("returns finalized when finalizedWithdrawals(hash) is true", async () => {
    const reader = build_l1_reader({ finalized: true })
    const status = await get_status({
      direction: "withdraw",
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_L2_BLOCK,
      prover: PROVER,
    })(build_resolved(reader))
    expect(status.state).toBe("finalized")
  })

  it("returns ready_to_prove when no proof yet but a resolved respected game covers the withdrawal block", async () => {
    const reader = build_l1_reader({
      game_count: 1n,
      game_status: STATUS_DEFENDER_WINS_BYTE,
      was_respected: true,
      blacklisted: false,
    })
    const status = await get_status({
      direction: "withdraw",
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_L2_BLOCK,
      prover: PROVER,
    })(build_resolved(reader))
    expect(status.state).toBe("ready_to_prove")
  })

  it("returns game_in_progress when the only candidate game is still in progress", async () => {
    const reader = build_l1_reader({
      game_count: 1n,
      game_status: STATUS_IN_PROGRESS_BYTE,
      was_respected: true,
      blacklisted: false,
    })
    const status = await get_status({
      direction: "withdraw",
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_L2_BLOCK,
      prover: PROVER,
    })(build_resolved(reader))
    expect(status.state).toBe("game_in_progress")
  })

  it("returns awaiting_game_proposal when no resolved or in-progress game covers the block", async () => {
    const reader = build_l1_reader({
      game_count: 1n,
      game_status: STATUS_CHALLENGER_WINS_BYTE,
      was_respected: true,
      blacklisted: false,
    })
    const status = await get_status({
      direction: "withdraw",
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_L2_BLOCK,
      prover: PROVER,
    })(build_resolved(reader))
    expect(status.state).toBe("awaiting_game_proposal")
  })

  it("returns proof_pending_maturity when proof recorded but window not elapsed", async () => {
    const reader = build_l1_reader({
      proven_game: GAME_PROXY,
      proven_timestamp: parse(Uint64Schema, "0x64"),
      game_status: STATUS_DEFENDER_WINS_BYTE,
      game_resolved_at: parse(Uint64Schema, "0x64"),
      blacklisted: false,
      latest_timestamp: parse(Uint64Schema, "0x65"),
    })
    const status = await get_status({
      direction: "withdraw",
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_L2_BLOCK,
      prover: PROVER,
    })(build_resolved(reader))
    expect(status.state).toBe("proof_pending_maturity")
  })

  it("returns ready_to_finalize after both maturity and finality windows elapsed", async () => {
    const reader = build_l1_reader({
      proven_game: GAME_PROXY,
      proven_timestamp: parse(Uint64Schema, "0x64"),
      game_status: STATUS_DEFENDER_WINS_BYTE,
      game_resolved_at: parse(Uint64Schema, "0x64"),
      blacklisted: false,
      latest_timestamp: parse(Uint64Schema, "0xffffffff"),
    })
    const status = await get_status({
      direction: "withdraw",
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_L2_BLOCK,
      prover: PROVER,
    })(build_resolved(reader))
    expect(status.state).toBe("ready_to_finalize")
  })

  it("returns game_invalidated when the proven game is blacklisted", async () => {
    const reader = build_l1_reader({
      proven_game: GAME_PROXY,
      proven_timestamp: parse(Uint64Schema, "0x64"),
      blacklisted: true,
    })
    const status = await get_status({
      direction: "withdraw",
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_L2_BLOCK,
      prover: PROVER,
    })(build_resolved(reader))
    expect(status.state).toBe("game_invalidated")
  })

  it("returns game_invalidated when the proven game resolved against the proposer", async () => {
    const reader = build_l1_reader({
      proven_game: GAME_PROXY,
      proven_timestamp: parse(Uint64Schema, "0x64"),
      game_status: STATUS_CHALLENGER_WINS_BYTE,
    })
    const status = await get_status({
      direction: "withdraw",
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_L2_BLOCK,
      prover: PROVER,
    })(build_resolved(reader))
    expect(status.state).toBe("game_invalidated")
  })
})

const ReceiptTxHash = GET_TX_RECEIPT_HASH
const GetReceiptParamsSchema = tuple([Hash32Schema])

const OP_SEPOLIA_PORTAL = parse(
  AddressSchema,
  "0x16Fc5058F25648194471939df75CF27A2fdC48BC",
)
const L1_BLOCK_HASH = parse(
  Hash32Schema,
  `0x${"c".repeat(64)}`,
)
const DEPOSIT_LOG_INDEX = parse(UintSchema, "0x3")
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
const OPAQUE_DATA = parse(
  BytesSchema,
  `0x${"00".repeat(73)}`,
)
const DEPOSIT_LOG_DATA = parse(
  BytesSchema,
  bytes_to_hex(
    encode_sequence([bytes_codec()], [OPAQUE_DATA]),
  ),
)
const FROM_TOPIC = parse(
  Bytes32Schema,
  `0x${PAD12}${SENDER.slice(2).toLowerCase()}`,
)
const TO_TOPIC = parse(
  Bytes32Schema,
  `0x${PAD12}${TARGET.slice(2).toLowerCase()}`,
)
const VERSION_TOPIC = parse(
  Bytes32Schema,
  `0x${"00".repeat(32)}`,
)
const L2_DEPOSIT_HASH = compute_l2_deposit_tx_hash({
  from: SENDER,
  to: TARGET,
  opaque_data: OPAQUE_DATA,
  l1_block_hash: L1_BLOCK_HASH,
  log_index: DEPOSIT_LOG_INDEX,
})

type DepositReceipt =
  | "missing"
  | "success_no_log"
  | "success_with_log"
  | "reverted"

function build_deposit_l1_reader(opts: {
  receipt: DepositReceipt
}): Dispatcher {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_getTransactionReceipt") {
      throw new Error(
        `unexpected method: ${String(method)}`,
      )
    }
    parse(GetReceiptParamsSchema, params)
    if (opts.receipt === "missing") return ok_response(null)
    const reverted = opts.receipt === "reverted"
    const include_log = opts.receipt === "success_with_log"
    return ok_response({
      blockHash: L1_BLOCK_HASH,
      blockNumber: parse(UintSchema, "0x1"),
      from: SENDER,
      cumulativeGasUsed: parse(UintSchema, "0x5208"),
      gasUsed: parse(UintSchema, "0x5208"),
      logs: include_log
        ? [
            {
              removed: false,
              logIndex: DEPOSIT_LOG_INDEX,
              transactionIndex: parse(UintSchema, "0x0"),
              transactionHash: ReceiptTxHash,
              blockHash: L1_BLOCK_HASH,
              blockNumber: parse(UintSchema, "0x1"),
              address: OP_SEPOLIA_PORTAL,
              data: DEPOSIT_LOG_DATA,
              topics: [
                TRANSACTION_DEPOSITED_TOPIC0,
                FROM_TOPIC,
                TO_TOPIC,
                VERSION_TOPIC,
              ],
            },
          ]
        : [],
      logsBloom: parse(
        BytesSchema,
        `0x${"00".repeat(256)}`,
      ),
      transactionHash: ReceiptTxHash,
      transactionIndex: parse(UintSchema, "0x0"),
      effectiveGasPrice: parse(UintSchema, "0x1"),
      to: TARGET,
      contractAddress: null,
      status: parse(UintSchema, reverted ? "0x0" : "0x1"),
    })
  }
}

function build_deposit_l2_reader(opts: {
  status: "missing" | "success" | "reverted"
}): Dispatcher {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_getTransactionReceipt") {
      throw new Error(
        `unexpected method: ${String(method)}`,
      )
    }
    const [hash] = parse(GetReceiptParamsSchema, params)
    if (hash !== L2_DEPOSIT_HASH) {
      throw new Error(
        `unexpected L2 hash: ${hash} (want ${L2_DEPOSIT_HASH})`,
      )
    }
    if (opts.status === "missing") return ok_response(null)
    return ok_response({
      blockHash: parse(Hash32Schema, `0x${"e".repeat(64)}`),
      blockNumber: parse(UintSchema, "0x2"),
      from: SENDER,
      cumulativeGasUsed: parse(UintSchema, "0x5208"),
      gasUsed: parse(UintSchema, "0x5208"),
      logs: [],
      logsBloom: parse(
        BytesSchema,
        `0x${"00".repeat(256)}`,
      ),
      transactionHash: L2_DEPOSIT_HASH,
      transactionIndex: parse(UintSchema, "0x0"),
      effectiveGasPrice: parse(UintSchema, "0x1"),
      to: TARGET,
      contractAddress: null,
      status: parse(
        UintSchema,
        opts.status === "success" ? "0x1" : "0x0",
      ),
    })
  }
}

function build_deposit_resolved(
  l1: Dispatcher,
  l2?: Dispatcher,
): ResolvedBridge {
  return {
    origin: { chain_id: SEPOLIA, reader: l1 },
    destination: {
      chain_id: OP_SEPOLIA,
      reader:
        l2 ??
        (async (_call: Call): Promise<Response> => {
          throw new Error(
            "destination reader should not be invoked in deposit status",
          )
        }),
    },
  }
}

describe("get_status (deposit)", () => {
  it("returns submitted_l1 when the L1 receipt is missing", async () => {
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: ReceiptTxHash,
    })(
      build_deposit_resolved(
        build_deposit_l1_reader({ receipt: "missing" }),
      ),
    )
    expect(status.state).toBe("submitted_l1")
  })

  it("returns in_progress_l2 when the L1 receipt succeeded with no portal log", async () => {
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: ReceiptTxHash,
    })(
      build_deposit_resolved(
        build_deposit_l1_reader({
          receipt: "success_no_log",
        }),
      ),
    )
    expect(status.state).toBe("in_progress_l2")
  })

  it("returns included_l1 when the L1 receipt reverted (status=0)", async () => {
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: ReceiptTxHash,
    })(
      build_deposit_resolved(
        build_deposit_l1_reader({ receipt: "reverted" }),
      ),
    )
    expect(status.state).toBe("included_l1")
  })

  it("returns in_progress_l2 when the L1 log is present but L2 receipt is missing", async () => {
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: ReceiptTxHash,
    })(
      build_deposit_resolved(
        build_deposit_l1_reader({
          receipt: "success_with_log",
        }),
        build_deposit_l2_reader({ status: "missing" }),
      ),
    )
    expect(status.state).toBe("in_progress_l2")
  })

  it("returns succeeded_l2 when the L2 deposit receipt has status=1", async () => {
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: ReceiptTxHash,
    })(
      build_deposit_resolved(
        build_deposit_l1_reader({
          receipt: "success_with_log",
        }),
        build_deposit_l2_reader({ status: "success" }),
      ),
    )
    expect(status.state).toBe("succeeded_l2")
    if (status.state === "succeeded_l2") {
      expect(status.l2_tx_hash).toBe(L2_DEPOSIT_HASH)
    }
  })

  it("returns failed_l2 when the L2 deposit receipt has status=0", async () => {
    const status = await get_status({
      direction: "deposit",
      l1_tx_hash: ReceiptTxHash,
    })(
      build_deposit_resolved(
        build_deposit_l1_reader({
          receipt: "success_with_log",
        }),
        build_deposit_l2_reader({ status: "reverted" }),
      ),
    )
    expect(status.state).toBe("failed_l2")
    if (status.state === "failed_l2") {
      expect(status.l2_tx_hash).toBe(L2_DEPOSIT_HASH)
    }
  })
})
