import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { Hash32Schema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { eth_getTransactionReceipt } from "./eth-get-transaction-receipt"

function transport_with<T>(
  result: T,
): (_call: Call) => Promise<Response> {
  return async () => ({
    id: "test",
    jsonrpc: "2.0",
    result,
  })
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_10.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

const TX_HASH = parse(
  Hash32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)
const RECEIPT_BASE = {
  blockHash:
    "0x1111111111111111111111111111111111111111111111111111111111111111",
  blockNumber: "0x4d2",
  from: "0x1111111111111111111111111111111111111111",
  cumulativeGasUsed: "0x5208",
  gasUsed: "0x5208",
  logs: [],
  logsBloom: `0x${"00".repeat(256)}`,
  transactionHash: TX_HASH,
  transactionIndex: "0x0",
  effectiveGasPrice: "0x1",
  to: "0x2222222222222222222222222222222222222222",
  contractAddress: null,
  status: "0x1",
}

describe("eth_getTransactionReceipt (OP-aware)", () => {
  it("surfaces depositNonce + depositReceiptVersion on a deposit-tx receipt", async () => {
    const transport = transport_with({
      ...RECEIPT_BASE,
      type: "0x7e",
      depositNonce: "0x2a",
      depositReceiptVersion: "0x1",
    })
    const resolved = testing_reader(transport)
    const receipt = await eth_getTransactionReceipt([
      TX_HASH,
    ])(resolved)
    if (receipt === null) {
      throw new Error("expected receipt")
    }
    expect(receipt.depositNonce).toBe("0x2a")
    expect(receipt.depositReceiptVersion).toBe("0x1")
  })

  it("parses a regular-tx receipt with neither op extra", async () => {
    const transport = transport_with({
      ...RECEIPT_BASE,
      type: "0x2",
    })
    const resolved = testing_reader(transport)
    const receipt = await eth_getTransactionReceipt([
      TX_HASH,
    ])(resolved)
    if (receipt === null) {
      throw new Error("expected receipt")
    }
    expect(receipt.depositNonce).toBeUndefined()
    expect(receipt.depositReceiptVersion).toBeUndefined()
  })

  it("returns null on a NotFound response", async () => {
    const transport = transport_with(null)
    const resolved = testing_reader(transport)
    const receipt = await eth_getTransactionReceipt([
      TX_HASH,
    ])(resolved)
    expect(receipt).toBeNull()
  })
})
