import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { UintSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { invariant } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { arb_getRawBlockMetadata } from "./arb-get-raw-block-metadata"

function stub_with_capture<T>(response_result: T): {
  transport: (_call: Call) => Promise<Response>
  last_call: { value: Call | null }
} {
  const last_call: { value: Call | null } = { value: null }
  const transport = async (
    _call: Call,
  ): Promise<Response> => {
    last_call.value = _call
    return {
      id: "test",
      jsonrpc: "2.0" as const,
      result: response_result,
    }
  }
  return { transport, last_call }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_42161.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

const FROM = parse(UintSchema, "0x186a0")
const TO = parse(UintSchema, "0x186a5")

describe("arb_getRawBlockMetadata", () => {
  it("emits the method with the from/to range and normalizes JSON-number blockNumbers", async () => {
    const { transport, last_call } = stub_with_capture([
      { blockNumber: 100000, rawMetadata: "0xdeadbeef" },
      { blockNumber: 100001, rawMetadata: "0xc0ffee" },
    ])
    const resolved = testing_reader(transport)
    const meta = await arb_getRawBlockMetadata([FROM, TO])(
      resolved,
    )
    expect(last_call.value).toEqual([
      "arb_getRawBlockMetadata",
      [FROM, TO],
    ])
    expect(meta).toHaveLength(2)
    const [first, second] = meta
    invariant(first, "expected first entry")
    invariant(second, "expected second entry")
    expect(first.blockNumber).toBe("0x186a0")
    expect(first.rawMetadata).toBe("0xdeadbeef")
    expect(second.blockNumber).toBe("0x186a1")
  })

  it("accepts hex-string blockNumber results (operator wrapping with hexutil.Uint64)", async () => {
    const { transport } = stub_with_capture([
      { blockNumber: "0x186a0", rawMetadata: "0x" },
    ])
    const resolved = testing_reader(transport)
    const meta = await arb_getRawBlockMetadata({
      fromBlock: FROM,
      toBlock: TO,
    })(resolved)
    const [first] = meta
    invariant(first, "expected first entry")
    expect(first.blockNumber).toBe("0x186a0")
  })

  it("accepts named block tags (e.g. 'latest') for fromBlock / toBlock", async () => {
    const { transport, last_call } = stub_with_capture([])
    const resolved = testing_reader(transport)
    await arb_getRawBlockMetadata({
      fromBlock: "latest",
      toBlock: "latest",
    })(resolved)
    expect(last_call.value).toEqual([
      "arb_getRawBlockMetadata",
      ["latest", "latest"],
    ])
  })

  it("throws when the dispatcher returns an error", async () => {
    const transport = async (
      _call: Call,
    ): Promise<Response> => ({
      id: "test",
      jsonrpc: "2.0" as const,
      error: { code: -32000, message: "range too large" },
    })
    const resolved = testing_reader(transport)
    await expect(
      arb_getRawBlockMetadata([FROM, TO])(resolved),
    ).rejects.toThrow("range too large")
  })
})
