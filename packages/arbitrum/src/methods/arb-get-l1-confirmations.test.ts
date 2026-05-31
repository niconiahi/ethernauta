import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { UintSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { arb_getL1Confirmations } from "./arb-get-l1-confirmations"

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

const BLOCK = parse(UintSchema, "0x186a0")

describe("arb_getL1Confirmations", () => {
  it("emits the method with the block number and accepts a JSON-number result (upstream uint64 default)", async () => {
    const { transport, last_call } = stub_with_capture(42)
    const resolved = testing_reader(transport)
    const confirmations = await arb_getL1Confirmations([
      BLOCK,
    ])(resolved)
    expect(last_call.value).toEqual([
      "arb_getL1Confirmations",
      [BLOCK],
    ])
    expect(confirmations).toBe("0x2a")
  })

  it("also accepts a hex-string result when an operator wraps with hexutil.Uint64", async () => {
    const { transport } = stub_with_capture("0x2a")
    const resolved = testing_reader(transport)
    const confirmations = await arb_getL1Confirmations({
      blockNumber: BLOCK,
    })(resolved)
    expect(confirmations).toBe("0x2a")
  })

  it("normalizes the named-object positional shape identically to the tuple shape", async () => {
    const { transport, last_call } = stub_with_capture(0)
    const resolved = testing_reader(transport)
    await arb_getL1Confirmations({ blockNumber: BLOCK })(
      resolved,
    )
    expect(last_call.value).toEqual([
      "arb_getL1Confirmations",
      [BLOCK],
    ])
  })

  it("throws when the dispatcher returns an error", async () => {
    const transport = async (
      _call: Call,
    ): Promise<Response> => ({
      id: "test",
      jsonrpc: "2.0" as const,
      error: { code: -32000, message: "block not found" },
    })
    const resolved = testing_reader(transport)
    await expect(
      arb_getL1Confirmations([BLOCK])(resolved),
    ).rejects.toThrow("block not found")
  })
})
