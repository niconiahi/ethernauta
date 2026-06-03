import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { eth_getBlockByNumber } from "./eth-get-block-by-number"

function transport_with<T>(result: T): {
  transport: (_call: Call) => Promise<Response>
  last_call: { value: Call | null }
} {
  const last_call: { value: Call | null } = { value: null }
  return {
    transport: async (_call: Call) => {
      last_call.value = _call
      return { id: "test", jsonrpc: "2.0", result }
    },
    last_call,
  }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_10.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

const BLOCK_BASE = {
  hash: "0x1111111111111111111111111111111111111111111111111111111111111111",
  parentHash:
    "0x2222222222222222222222222222222222222222222222222222222222222222",
  sha3Uncles:
    "0x3333333333333333333333333333333333333333333333333333333333333333",
  miner: "0x4200000000000000000000000000000000000011",
  stateRoot:
    "0x4444444444444444444444444444444444444444444444444444444444444444",
  transactionsRoot:
    "0x5555555555555555555555555555555555555555555555555555555555555555",
  receiptsRoot:
    "0x6666666666666666666666666666666666666666666666666666666666666666",
  logsBloom: `0x${"00".repeat(256)}`,
  number: "0x4d2",
  gasLimit: "0x1c9c380",
  gasUsed: "0x5208",
  timestamp: "0x65a0c0d0",
  extraData: "0x",
  mixHash:
    "0x7777777777777777777777777777777777777777777777777777777777777777",
  nonce: "0x0000000000000000",
  size: "0x3e8",
  uncles: [],
}

const REGULAR_TX = {
  type: "0x2",
  blockHash:
    "0x1111111111111111111111111111111111111111111111111111111111111111",
  blockNumber: "0x4d2",
  from: "0x1111111111111111111111111111111111111111",
  hash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  transactionIndex: "0x0",
  nonce: "0x1",
  to: "0x2222222222222222222222222222222222222222",
  gas: "0x5208",
  value: "0x0",
  input: "0x",
  maxFeePerGas: "0x9a",
  maxPriorityFeePerGas: "0x4",
  gasPrice: "0x64",
  accessList: [],
  chainId: "0xa",
  yParity: "0x0",
  r: "0x1",
  s: "0x1",
}

const DEPOSIT_TX = {
  type: "0x7e",
  blockHash:
    "0x1111111111111111111111111111111111111111111111111111111111111111",
  blockNumber: "0x4d2",
  from: "0x3333333333333333333333333333333333333333",
  hash: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  transactionIndex: "0x1",
  nonce: "0x0",
  to: "0x4200000000000000000000000000000000000007",
  gas: "0xf4240",
  value: "0xde0b6b3a7640000",
  input: "0xdeadbeef",
  sourceHash:
    "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
  mint: "0xde0b6b3a7640000",
  l1BlockNumber: "0x123456",
  l1Timestamp: "0x65a0c0c0",
  depositNonce: "0x2a",
  depositReceiptVersion: "0x1",
}

describe("eth_getBlockByNumber (OP-aware)", () => {
  it("parses a hydrated block with a deposit-tx + a 1559 tx", async () => {
    const { transport } = transport_with({
      ...BLOCK_BASE,
      transactions: [DEPOSIT_TX, REGULAR_TX],
    })
    const resolved = testing_reader(transport)
    const block = await eth_getBlockByNumber([
      "latest",
      true,
    ])(resolved)
    if (block === null) throw new Error("expected block")
    expect(Array.isArray(block.transactions)).toBe(true)
    const txs = block.transactions
    if (typeof txs[0] === "string") {
      throw new Error("expected hydrated tx objects")
    }
    expect(txs).toHaveLength(2)
    const deposit = txs[0]
    if (
      deposit === undefined ||
      typeof deposit === "string"
    ) {
      throw new Error("expected hydrated deposit tx")
    }
    if (!("sourceHash" in deposit)) {
      throw new Error(
        "expected the deposit tx branch of the union",
      )
    }
    expect(deposit.sourceHash).toBe(
      "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
    )
    expect(deposit.mint).toBe("0xde0b6b3a7640000")
    expect(deposit.l1BlockNumber).toBe("0x123456")
    expect(deposit.depositNonce).toBe("0x2a")
    expect(deposit.depositReceiptVersion).toBe("0x1")
  })

  it("parses a non-hydrated block (transactions = hashes)", async () => {
    const { transport } = transport_with({
      ...BLOCK_BASE,
      transactions: [
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      ],
    })
    const resolved = testing_reader(transport)
    const block = await eth_getBlockByNumber([
      "latest",
      false,
    ])(resolved)
    if (block === null) throw new Error("expected block")
    expect(block.transactions).toEqual([
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ])
  })

  it("returns null on a NotFound response", async () => {
    const { transport } = transport_with(null)
    const resolved = testing_reader(transport)
    const block = await eth_getBlockByNumber([
      "latest",
      false,
    ])(resolved)
    expect(block).toBeNull()
  })
})
