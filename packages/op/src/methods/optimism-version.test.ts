import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { optimism_version } from "./optimism-version"

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
      jsonrpc: "2.0",
      result: response_result,
    }
  }
  return { transport, last_call }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_10.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

describe("optimism_version", () => {
  it("emits the method with no params and returns the version string", async () => {
    const { transport, last_call } =
      stub_with_capture("v1.10.2")
    const resolved = testing_reader(transport)
    const version = await optimism_version()(resolved)
    expect(last_call.value).toEqual(["optimism_version"])
    expect(version).toBe("v1.10.2")
  })
})
