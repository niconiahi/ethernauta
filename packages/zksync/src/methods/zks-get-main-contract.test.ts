import { eip155_324 } from "@ethernauta/chain/eip155-324"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { zks_getMainContract } from "./zks-get-main-contract"

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

describe("zks_getMainContract", () => {
  it("returns the L1 diamond proxy address as a checksummed Address", async () => {
    const expected =
      "0x32400084c286cf3e17e7b677ea9583e60a000324"
    const resolved = testing_reader(stub_http(expected))
    const address = await zks_getMainContract()(resolved)
    expect(address).toBe(expected)
  })
})
