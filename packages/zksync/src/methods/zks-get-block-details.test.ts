import { eip155_324 } from "@ethernauta/chain/eip155-324"
import { Uint64Schema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { zks_getBlockDetails } from "./zks-get-block-details"

function stub_http<T>(
  response_result: T,
): (_call: Call) => Promise<Response> {
  return async (_call: Call) => ({
    id: "test",
    jsonrpc: "2.0" as const,
    result: response_result,
  })
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_324.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

// Wire response from `zks_getBlockDetails`. Upstream merges
// `BlockDetailsBase` into the parent object via
// `#[serde(flatten)]` — both the parent's `number` /
// `l1BatchNumber` / `operatorAddress` fields and the base's
// lifecycle fields land on the same level.
const BLOCK_PAYLOAD = {
  number: "0x2a",
  l1BatchNumber: "0xd",
  timestamp: "0x66000000",
  l1TxCount: "0x0",
  l2TxCount: "0x5",
  rootHash:
    "0x0000000000000000000000000000000000000000000000000000000000000001",
  status: "verified",
  commitTxHash:
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  committedAt: "2026-05-31T00:00:00Z",
  proveTxHash:
    "0x0000000000000000000000000000000000000000000000000000000000000003",
  provenAt: "2026-05-31T00:00:00Z",
  executeTxHash:
    "0x0000000000000000000000000000000000000000000000000000000000000004",
  executedAt: "2026-05-31T00:00:00Z",
  l1GasPrice: "0x3b9aca00",
  l2FairGasPrice: "0xee6b280",
  baseSystemContractsHashes: {
    bootloader:
      "0x0000000000000000000000000000000000000000000000000000000000000005",
    default_aa:
      "0x0000000000000000000000000000000000000000000000000000000000000006",
  },
  operatorAddress:
    "0x0000000000000000000000000000000000000064",
  protocolVersion: "0x1c",
}

describe("zks_getBlockDetails", () => {
  it("decodes the flattened BlockDetailsBase fields onto the parent object", async () => {
    const resolved = testing_reader(
      stub_http(BLOCK_PAYLOAD),
    )
    const details = await zks_getBlockDetails([
      parse(Uint64Schema, "0x2a"),
    ])(resolved)
    expect(details).not.toBeNull()
    if (details === null) return
    expect(details.number).toBe("0x2a")
    expect(details.l1BatchNumber).toBe("0xd")
    expect(details.operatorAddress).toBe(
      "0x0000000000000000000000000000000000000064",
    )
    expect(details.status).toBe("verified")
    expect(details.l2FairGasPrice).toBe("0xee6b280")
    expect(
      details.baseSystemContractsHashes.bootloader,
    ).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000005",
    )
  })

  it("returns null when the node has no record of the block yet", async () => {
    const resolved = testing_reader(stub_http(null))
    const details = await zks_getBlockDetails({
      blockNumber: parse(Uint64Schema, "0xffffff"),
    })(resolved)
    expect(details).toBeNull()
  })
})
