import { eip155_1 } from "@ethernauta/chain"
import { addressSchema, bytesSchema } from "@ethernauta/core"
import {
  encode_chain_id,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { buffer_gas_limit } from "./buffer-gas-limit"
import { stub_http } from "./test-helpers"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})
const TRANSFER_TARGET = parse(
  addressSchema,
  "0x0000000000000000000000000000000000000001",
)
const CONTRACT_TARGET = parse(
  addressSchema,
  "0x0000000000000000000000000000000000000002",
)
const INPUT_DATA = parse(bytesSchema, "0xdeadbeef")

describe("buffer_gas_limit", () => {
  it("returns the estimate unchanged at multiplier 1.0", async () => {
    // eth_estimateGas → 0x5208 (21000 — native transfer baseline).
    const resolved: ResolvedReader = [
      [stub_http("0x5208")],
      { chain_id: CHAIN_ID },
    ]
    const buffered = await buffer_gas_limit({
      tx: { to: TRANSFER_TARGET },
      multiplier: 1.0,
    })(resolved)
    expect(buffered).toBe("0x5208")
  })

  it("buffers by 1.2× and rounds up", async () => {
    // 21000 × 1.2 = 25200 = 0x6270.
    const resolved: ResolvedReader = [
      [stub_http("0x5208")],
      { chain_id: CHAIN_ID },
    ]
    const buffered = await buffer_gas_limit({
      tx: { to: TRANSFER_TARGET },
      multiplier: 1.2,
    })(resolved)
    expect(buffered).toBe("0x6270")
  })

  it("buffers by 2.0× on a contract call", async () => {
    // 0x186a0 = 100_000. × 2 = 200_000 = 0x30d40.
    const resolved: ResolvedReader = [
      [stub_http("0x186a0")],
      { chain_id: CHAIN_ID },
    ]
    const buffered = await buffer_gas_limit({
      tx: {
        to: CONTRACT_TARGET,
        input: INPUT_DATA,
      },
      multiplier: 2.0,
    })(resolved)
    expect(buffered).toBe("0x30d40")
  })
})
