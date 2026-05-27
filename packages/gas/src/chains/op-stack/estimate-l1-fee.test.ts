import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import {
  encode_chain_id,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { stub_http } from "../../test-helpers"

import { estimate_l1_fee } from "./estimate-l1-fee"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_8453.chainId,
})

describe("estimate_l1_fee", () => {
  it("returns the predeploy's getL1Fee result as a Uint256", async () => {
    // Mock the eth_call response: 32-byte big-endian wei value.
    // Result here is 0x05 = 5 wei (rendered as a 32-byte padded hex).
    const five_wei = `0x${"00".repeat(31)}05`
    const resolved: ResolvedReader = [
      [stub_http(five_wei)],
      { chain_id: CHAIN_ID },
    ]
    const fee = await estimate_l1_fee({
      tx: {
        type: parse(byteSchema, "0x2"),
        chainId: parse(uintSchema, "0x2105"),
        nonce: parse(uintSchema, "0x0"),
        maxPriorityFeePerGas: parse(uintSchema, "0x1"),
        maxFeePerGas: parse(uintSchema, "0x1"),
        gas: parse(uintSchema, "0x5208"),
        to: parse(
          addressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
        value: parse(uintSchema, "0x0"),
        input: parse(bytesSchema, "0x"),
        gasPrice: parse(uintSchema, "0x0"),
        accessList: [],
      },
    })(resolved)
    expect(fee).toBe(five_wei)
  })
})
