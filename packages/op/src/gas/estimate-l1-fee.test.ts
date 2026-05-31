import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { estimate_l1_fee } from "./estimate-l1-fee"

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
  reference: eip155_8453.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

describe("estimate_l1_fee", () => {
  it("returns the predeploy's getL1Fee result as a Uint256", async () => {
    // Mock the eth_call response: 32-byte big-endian wei value.
    // Result here is 0x05 = 5 wei (rendered as a 32-byte padded hex).
    const five_wei = `0x${"00".repeat(31)}05`
    const resolved = testing_reader(stub_http(five_wei))
    const fee = await estimate_l1_fee({
      tx: {
        type: parse(ByteSchema, "0x2"),
        chainId: parse(UintSchema, "0x2105"),
        nonce: parse(UintSchema, "0x0"),
        maxPriorityFeePerGas: parse(UintSchema, "0x1"),
        maxFeePerGas: parse(UintSchema, "0x1"),
        gas: parse(UintSchema, "0x5208"),
        to: parse(
          AddressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, "0x"),
        gasPrice: parse(UintSchema, "0x0"),
        accessList: [],
      },
    })(resolved)
    expect(fee).toBe(five_wei)
  })
})
