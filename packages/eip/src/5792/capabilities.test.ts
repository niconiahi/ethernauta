import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
  callsStatusSchema,
  sendCallsParameterSchema,
} from "./capabilities"

describe("capabilities.ts", () => {
  it("should validate a wallet_sendCalls parameter", () => {
    const param = {
      version: "1.0",
      chainId: "0x1",
      from: "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
      calls: [
        {
          to: "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
          data: "0xa9059cbb",
          value: "0x0",
        },
      ],
    }
    expect(() =>
      parse(sendCallsParameterSchema, param),
    ).not.toThrow()
  })

  it("should validate a wallet_sendCalls with capabilities map", () => {
    const param = {
      version: "1.0",
      chainId: "0x1",
      calls: [],
      capabilities: { paymaster: { url: "https://x" } },
    }
    expect(() =>
      parse(sendCallsParameterSchema, param),
    ).not.toThrow()
  })

  it("should reject when chainId is not hex", () => {
    const param = {
      version: "1.0",
      chainId: "1",
      calls: [],
    }
    expect(() =>
      parse(sendCallsParameterSchema, param),
    ).toThrow()
  })

  it("should validate a CONFIRMED status with receipts", () => {
    const status = {
      status: "CONFIRMED",
      receipts: [{ transactionHash: "0xabc" }],
    }
    expect(() =>
      parse(callsStatusSchema, status),
    ).not.toThrow()
  })

  it("should validate a PENDING status without receipts", () => {
    const status = { status: "PENDING" }
    expect(() =>
      parse(callsStatusSchema, status),
    ).not.toThrow()
  })

  it("should reject unknown status enum", () => {
    const status = { status: "DONE" }
    expect(() =>
      parse(callsStatusSchema, status),
    ).toThrow()
  })
})
