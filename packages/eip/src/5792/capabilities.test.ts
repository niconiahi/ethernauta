import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
  CALLS_STATUS,
  CallsStatusSchema,
  SendCallsParameterSchema,
  SendCallsResultSchema,
} from "./capabilities"

describe("capabilities.ts", () => {
  it("should validate a wallet_sendCalls parameter", () => {
    const param = {
      version: "2.0.0",
      chainId: "0xaa36a7",
      from: "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
      atomicRequired: false,
      calls: [
        {
          to: "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
          data: "0xa9059cbb",
          value: "0x0",
        },
      ],
    }
    expect(() =>
      parse(SendCallsParameterSchema, param),
    ).not.toThrow()
  })

  it("should validate a wallet_sendCalls with capabilities map", () => {
    const param = {
      version: "2.0.0",
      chainId: "0x1",
      calls: [],
      capabilities: {
        paymasterService: { url: "https://x" },
      },
    }
    expect(() =>
      parse(SendCallsParameterSchema, param),
    ).not.toThrow()
  })

  it("should reject when chainId is not hex", () => {
    const param = {
      version: "2.0.0",
      chainId: "1",
      calls: [],
    }
    expect(() =>
      parse(SendCallsParameterSchema, param),
    ).toThrow()
  })

  it("should validate a sendCalls result with id", () => {
    const result = {
      id: "0xabcd",
      capabilities: { custom: { foo: "bar" } },
    }
    expect(() =>
      parse(SendCallsResultSchema, result),
    ).not.toThrow()
  })

  it("should validate a CONFIRMED status with full receipts", () => {
    const status = {
      version: "2.0.0",
      id: "0xbatch1",
      chainId: "0xaa36a7",
      status: CALLS_STATUS.CONFIRMED,
      atomic: false,
      receipts: [
        {
          logs: [
            {
              address:
                "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
              topics: [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              ],
              data: "0x",
            },
          ],
          status: "0x1",
          blockHash:
            "0xdb9a5f2320c0a10d28bfa1c563a1bbf592665e9b5d0bf41f4a9a4a64bb1a8b22",
          blockNumber: "0x1",
          gasUsed: "0x5208",
          transactionHash:
            "0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
        },
      ],
    }
    expect(() =>
      parse(CallsStatusSchema, status),
    ).not.toThrow()
  })

  it("should validate a PENDING status without receipts", () => {
    const status = {
      version: "2.0.0",
      id: "0xbatch2",
      chainId: "0x1",
      status: CALLS_STATUS.PENDING,
      atomic: true,
    }
    expect(() =>
      parse(CallsStatusSchema, status),
    ).not.toThrow()
  })

  it("should reject status code that is not an integer", () => {
    const status = {
      version: "2.0.0",
      id: "0x1",
      chainId: "0x1",
      status: 1.5,
      atomic: false,
    }
    expect(() => parse(CallsStatusSchema, status)).toThrow()
  })
})
