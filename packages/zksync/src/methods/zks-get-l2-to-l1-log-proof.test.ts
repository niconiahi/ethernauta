import { eip155_324 } from "@ethernauta/chain/eip155-324"
import { Hash32Schema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { zks_getL2ToL1LogProof } from "./zks-get-l2-to-l1-log-proof"

// Capture what the dispatcher receives so we can assert the wire
// shape the binding builds (positional list ordering + trailing
// nulls), not just that the response is decoded.
function record_call(response_result: unknown): {
  capture: { last_call: Call | null }
  http: (call: Call) => Promise<Response>
} {
  const capture: { last_call: Call | null } = {
    last_call: null,
  }
  const http = async (call: Call): Promise<Response> => {
    capture.last_call = call
    return {
      id: "test",
      jsonrpc: "2.0" as const,
      result: response_result,
    }
  }
  return { capture, http }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_324.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

const TX_HASH = parse(
  Hash32Schema,
  "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
)
const ROOT = parse(
  Hash32Schema,
  "0xcafebabecafebabecafebabecafebabecafebabecafebabecafebabecafebabe",
)
const PROOF_RESULT = {
  proof: [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ],
  id: "0x7",
  root: ROOT,
  batchNumber: "0x2a",
}

describe("zks_getL2ToL1LogProof", () => {
  it("forwards the named-object form as a 3-element positional list with trailing nulls", async () => {
    const { capture, http } = record_call(PROOF_RESULT)
    const resolved = testing_reader(http)
    const proof = await zks_getL2ToL1LogProof({
      txHash: TX_HASH,
    })(resolved)
    expect(capture.last_call).toEqual([
      "zks_getL2ToL1LogProof",
      [TX_HASH, null, null],
    ])
    expect(proof?.proof).toHaveLength(2)
    expect(proof?.id).toBe("0x7")
    expect(proof?.batchNumber).toBe("0x2a")
  })

  it("forwards a 1-tuple form unchanged", async () => {
    const { capture, http } = record_call(null)
    const resolved = testing_reader(http)
    const proof = await zks_getL2ToL1LogProof([TX_HASH])(
      resolved,
    )
    expect(capture.last_call).toEqual([
      "zks_getL2ToL1LogProof",
      [TX_HASH],
    ])
    expect(proof).toBeNull()
  })
})
