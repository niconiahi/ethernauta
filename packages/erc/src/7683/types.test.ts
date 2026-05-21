import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  fillInstructionSchema,
  gaslessCrossChainOrderSchema,
  onchainCrossChainOrderSchema,
  outputSchema,
} from "./types"

const ADDR =
  "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845" as const
const B32 = `0x${"11".repeat(32)}` as const

describe("types.ts — outputSchema", () => {
  it("should accept a well-formed output", () => {
    expect(() =>
      parse(outputSchema, {
        token: B32,
        amount: "0x10",
        recipient: B32,
        chainId: "0x1",
      }),
    ).not.toThrow()
  })

  it("should reject a non-bytes32 token", () => {
    expect(() =>
      parse(outputSchema, {
        token: "0x1234",
        amount: "0x10",
        recipient: B32,
        chainId: "0x1",
      }),
    ).toThrow()
  })
})

describe("types.ts — fillInstructionSchema", () => {
  it("should accept a well-formed fill instruction", () => {
    expect(() =>
      parse(fillInstructionSchema, {
        destinationChainId: "0xa",
        destinationSettler: B32,
        originData: "0xdead",
      }),
    ).not.toThrow()
  })
})

describe("types.ts — onchainCrossChainOrderSchema", () => {
  it("should accept a well-formed onchain order", () => {
    expect(() =>
      parse(onchainCrossChainOrderSchema, {
        fillDeadline: "0x1000",
        orderDataType: B32,
        orderData: "0x",
      }),
    ).not.toThrow()
  })
})

describe("types.ts — gaslessCrossChainOrderSchema", () => {
  it("should accept a well-formed gasless order", () => {
    expect(() =>
      parse(gaslessCrossChainOrderSchema, {
        originSettler: ADDR,
        user: ADDR,
        nonce: "0x1",
        originChainId: "0xaa36a7",
        openDeadline: "0x6800",
        fillDeadline: "0x6800",
        orderDataType: B32,
        orderData: "0x",
      }),
    ).not.toThrow()
  })

  it("should reject when originSettler is missing", () => {
    expect(() =>
      parse(gaslessCrossChainOrderSchema, {
        user: ADDR,
        nonce: "0x1",
        originChainId: "0xaa36a7",
        openDeadline: "0x6800",
        fillDeadline: "0x6800",
        orderDataType: B32,
        orderData: "0x",
      }),
    ).toThrow()
  })
})
