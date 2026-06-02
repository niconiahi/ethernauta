import {
  type AbiCodec,
  address as address_codec,
  bool as bool_codec,
  encode_sequence,
  function_selector,
  uint8 as uint8_codec,
  uint32 as uint32_codec,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  Bytes32Schema,
  BytesMax32Schema,
  BytesSchema,
  Hash32Schema,
  Uint8Schema,
  Uint32Schema,
  Uint64Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  BlockNumberOrTagOrHashSchema,
  BlockNumberOrTagSchema,
} from "@ethernauta/eth"
import type {
  Call,
  Reader,
  ResolvedBridge,
  Response,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  array,
  boolean,
  object,
  parse,
  tuple,
} from "valibot"
import { describe, expect, it } from "vitest"

import { fetch_message_proof } from "./message-proof"

const OP_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: "11155420",
})
const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const GAME_PROXY = parse(
  AddressSchema,
  "0xAAaaaAaaaaaaAaaaaaaaAaaAaaaaaAaAAaaaaaAA",
)
const L2_MESSAGE_PASSER = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000016",
)
const SENDER = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const BLOCK_HASH = parse(
  Hash32Schema,
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
)
const STATE_ROOT = parse(
  Hash32Schema,
  "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
)
const STORAGE_HASH = parse(
  Hash32Schema,
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
)
const MIX_HASH = parse(
  Hash32Schema,
  "0x1111111111111111111111111111111111111111111111111111111111111111",
)
const SHA3_UNCLES = parse(
  Hash32Schema,
  "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
)
const RECEIPTS_ROOT = parse(
  Hash32Schema,
  "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
)
const TX_ROOT = parse(
  Hash32Schema,
  "0x9966666666666666666666666666666666666666666666666666666666666666",
)
const PARENT_HASH = parse(
  Hash32Schema,
  "0x4444444444444444444444444444444444444444444444444444444444444444",
)
const ZERO_ADDRESS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000000",
)
const ZERO_HASH = parse(
  Hash32Schema,
  "0x0000000000000000000000000000000000000000000000000000000000000000",
)
const EMPTY_LOGS_BLOOM = parse(
  BytesSchema,
  `0x${"00".repeat(256)}`,
)
const ZERO_NONCE = parse(BytesSchema, "0x0000000000000000")
const EMPTY_BYTES = parse(BytesSchema, "0x")
const PROOF_NODE_A = parse(BytesSchema, "0xf8b1a0aabb")
const PROOF_NODE_B = parse(BytesSchema, "0xf8b1a0ccdd")
const ACCOUNT_PROOF_NODE = parse(
  BytesSchema,
  "0xf8b1a0eeff",
)
const WITHDRAWAL_BLOCK = parse(
  Uint256Schema,
  "0x000000000000000000000000000000000000000000000000000000000000007b",
)
const GAME_L2_BLOCK = parse(
  Uint256Schema,
  "0x00000000000000000000000000000000000000000000000000000000000003e8",
)
const GAME_TIMESTAMP = parse(Uint64Schema, "0x64")

const GAME_TYPE = parse(Uint32Schema, "0x1")
const STATUS_DEFENDER_WINS = parse(Uint8Schema, "0x2")
const STATUS_IN_PROGRESS = parse(Uint8Schema, "0x0")

const WITHDRAWAL_TRANSACTION = {
  nonce: parse(Uint256Schema, "0x01"),
  sender: SENDER,
  target: TARGET,
  value: parse(Uint256Schema, "0x0de0b6b3a7640000"),
  gasLimit: parse(Uint256Schema, "0x030d40"),
  data: parse(BytesSchema, "0xdeadbeef"),
}

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
const IS_GAME_BLACKLISTED_SELECTOR = function_selector(
  "isGameBlacklisted",
  [address_codec()],
)

const EthCallParamsSchema = tuple([
  object({ to: AddressSchema, input: BytesSchema }),
  BlockNumberOrTagSchema,
])
const GetBlockParamsSchema = tuple([
  BlockNumberOrTagSchema,
  boolean(),
])
const GetProofParamsSchema = tuple([
  AddressSchema,
  array(BytesMax32Schema),
  BlockNumberOrTagOrHashSchema,
])

function encode_result<Args extends readonly unknown[]>(
  args: { readonly [K in keyof Args]: AbiCodec<Args[K]> },
  values: NoInfer<Args>,
): Bytes {
  return parse(
    BytesSchema,
    bytes_to_hex(encode_sequence(args, values)),
  )
}

function ok_response<T>(result: T): Response {
  return { jsonrpc: "2.0", id: "1", result }
}

function build_block(
  number: ReturnType<typeof parse_uint>,
) {
  return {
    hash: BLOCK_HASH,
    parentHash: PARENT_HASH,
    sha3Uncles: SHA3_UNCLES,
    miner: ZERO_ADDRESS,
    stateRoot: STATE_ROOT,
    transactionsRoot: TX_ROOT,
    receiptsRoot: RECEIPTS_ROOT,
    logsBloom: EMPTY_LOGS_BLOOM,
    number,
    gasLimit: parse(UintSchema, "0x1c9c380"),
    gasUsed: parse(UintSchema, "0x0"),
    timestamp: parse(UintSchema, "0x65"),
    extraData: EMPTY_BYTES,
    mixHash: MIX_HASH,
    nonce: ZERO_NONCE,
    size: parse(UintSchema, "0x200"),
    transactions: [],
    uncles: [],
  }
}

function parse_uint(value: string) {
  return parse(UintSchema, value)
}

function build_account_proof(slot_key: string) {
  return {
    address: L2_MESSAGE_PASSER,
    accountProof: [ACCOUNT_PROOF_NODE],
    balance: parse(Uint256Schema, "0x0"),
    codeHash: ZERO_HASH,
    nonce: parse(UintSchema, "0x0"),
    storageHash: STORAGE_HASH,
    storageProof: [
      {
        key: parse(BytesMax32Schema, slot_key),
        value: parse(Uint256Schema, "0x1"),
        proof: [PROOF_NODE_A, PROOF_NODE_B],
      },
    ],
  }
}

function build_l1_reader(options: {
  game_status: typeof STATUS_DEFENDER_WINS
  blacklisted: boolean
  was_respected: boolean
  game_l2_block: typeof GAME_L2_BLOCK
}): Reader {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    if (method !== "eth_call") {
      throw new Error(
        `unexpected L1 method: ${String(method)}`,
      )
    }
    const [{ input }] = parse(EthCallParamsSchema, params)
    const selector = input.slice(0, 10)
    if (selector === RESPECTED_GAME_TYPE_SELECTOR)
      return ok_response(
        encode_result([uint32_codec()], [GAME_TYPE]),
      )
    if (selector === GAME_COUNT_SELECTOR)
      return ok_response(
        encode_result(
          [uint256_codec()],
          [parse(Uint256Schema, "0x03")],
        ),
      )
    if (selector === GAME_AT_INDEX_SELECTOR)
      return ok_response(
        encode_result(
          [uint32_codec(), uint64_codec(), address_codec()],
          [GAME_TYPE, GAME_TIMESTAMP, GAME_PROXY],
        ),
      )
    if (selector === WAS_RESPECTED_SELECTOR)
      return ok_response(
        encode_result(
          [bool_codec()],
          [options.was_respected],
        ),
      )
    if (selector === STATUS_SELECTOR)
      return ok_response(
        encode_result(
          [uint8_codec()],
          [options.game_status],
        ),
      )
    if (selector === L2_BLOCK_NUMBER_SELECTOR)
      return ok_response(
        encode_result(
          [uint256_codec()],
          [options.game_l2_block],
        ),
      )
    if (selector === IS_GAME_BLACKLISTED_SELECTOR)
      return ok_response(
        encode_result(
          [bool_codec()],
          [options.blacklisted],
        ),
      )
    throw new Error(`unexpected L1 selector: ${selector}`)
  }
}

function build_l2_reader(): {
  reader: Reader
  calls: string[]
} {
  const calls: string[] = []
  const reader: Reader = async (
    call: Call,
  ): Promise<Response> => {
    const [method, params] = call
    calls.push(String(method))
    if (method === "eth_getBlockByNumber") {
      const [block_number] = parse(
        GetBlockParamsSchema,
        params,
      )
      return ok_response(
        build_block(parse(UintSchema, block_number)),
      )
    }
    if (method === "eth_getProof") {
      const [, slots] = parse(GetProofParamsSchema, params)
      const slot = slots[0]
      if (!slot)
        throw new Error("eth_getProof called with no slots")
      return ok_response(build_account_proof(slot))
    }
    throw new Error(
      `unexpected L2 method: ${String(method)}`,
    )
  }
  return { reader, calls }
}

function build_resolved(input: {
  l1: Reader
  l2: Reader
}): ResolvedBridge {
  return {
    l1: { chain_id: SEPOLIA_CHAIN_ID, reader: input.l1 },
    l2: { chain_id: OP_SEPOLIA_CHAIN_ID, reader: input.l2 },
  }
}

describe("fetch_message_proof", () => {
  it("returns the MessageProof for the latest resolved respected game covering the withdrawal", async () => {
    const l1_reader = build_l1_reader({
      game_status: STATUS_DEFENDER_WINS,
      blacklisted: false,
      was_respected: true,
      game_l2_block: GAME_L2_BLOCK,
    })
    const { reader: l2_reader, calls: l2_calls } =
      build_l2_reader()
    const resolved = build_resolved({
      l1: l1_reader,
      l2: l2_reader,
    })
    const proof = await fetch_message_proof({
      withdrawal_transaction: WITHDRAWAL_TRANSACTION,
      withdrawal_l2_block_number: WITHDRAWAL_BLOCK,
    })(resolved)
    expect(proof.withdrawalTransaction).toEqual(
      WITHDRAWAL_TRANSACTION,
    )
    expect(proof.disputeGameIndex).toBe(
      parse(Uint256Schema, "0x2"),
    )
    expect(proof.outputRootProof.version).toBe(
      parse(Bytes32Schema, `0x${"0".repeat(64)}`),
    )
    expect(proof.outputRootProof.stateRoot).toBe(
      parse(Bytes32Schema, STATE_ROOT),
    )
    expect(
      proof.outputRootProof.messagePasserStorageRoot,
    ).toBe(parse(Bytes32Schema, STORAGE_HASH))
    expect(proof.outputRootProof.latestBlockhash).toBe(
      parse(Bytes32Schema, BLOCK_HASH),
    )
    expect(proof.withdrawalProof).toEqual([
      PROOF_NODE_A,
      PROOF_NODE_B,
    ])
    expect(l2_calls).toEqual([
      "eth_getBlockByNumber",
      "eth_getProof",
    ])
  })

  it("throws when no resolved game covers the withdrawal's L2 block", async () => {
    const l1_reader = build_l1_reader({
      game_status: STATUS_IN_PROGRESS,
      blacklisted: false,
      was_respected: true,
      game_l2_block: GAME_L2_BLOCK,
    })
    const { reader: l2_reader } = build_l2_reader()
    const resolved = build_resolved({
      l1: l1_reader,
      l2: l2_reader,
    })
    await expect(
      fetch_message_proof({
        withdrawal_transaction: WITHDRAWAL_TRANSACTION,
        withdrawal_l2_block_number: WITHDRAWAL_BLOCK,
      })(resolved),
    ).rejects.toThrow(/no resolved dispute game/)
  })
})
