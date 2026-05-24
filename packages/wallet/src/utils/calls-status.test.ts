import { CALLS_STATUS } from "@ethernauta/eip/5792"
import type { ReceiptInfo } from "@ethernauta/eth"
import { object, parse, string } from "valibot"
import { describe, expect, it } from "vitest"
import type { BatchRecord } from "./calls-registry"
import {
  compose_capabilities,
  finalize_status,
} from "./calls-status"

const HASH_A =
  "0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899" as const
const HASH_B =
  "0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa" as const

const BATCH: BatchRecord = {
  id: "0xbatch",
  chainId: "0xaa36a7",
  atomic: false,
  transaction_hashes: [HASH_A, HASH_B],
}

function make_receipt(
  transaction_hash: `0x${string}`,
  status: "0x0" | "0x1",
): ReceiptInfo {
  return {
    blockHash:
      "0xdb9a5f2320c0a10d28bfa1c563a1bbf592665e9b5d0bf41f4a9a4a64bb1a8b22",
    blockNumber: "0x1",
    from: "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
    cumulativeGasUsed: "0x5208",
    gasUsed: "0x5208",
    logs: [],
    logsBloom: `0x${"0".repeat(512)}` as `0x${string}`,
    transactionHash: transaction_hash,
    transactionIndex: "0x0",
    effectiveGasPrice: "0x1",
    to: "0x1111111111111111111111111111111111111111",
    contractAddress: null,
    status,
  }
}

describe("calls-status.ts — compose_capabilities", () => {
  it("should declare unsupported atomic for every configured chain", () => {
    const caps = compose_capabilities()
    const keys = Object.keys(caps)
    expect(keys.length).toBeGreaterThan(0)
    for (const key of keys) {
      const chain_caps = parse(
        object({ atomic: object({ status: string() }) }),
        caps[key],
      )
      expect(chain_caps.atomic.status).toBe("unsupported")
    }
  })
})

describe("calls-status.ts — finalize_status", () => {
  it("should report PENDING when at least one call is unmined", () => {
    const status = finalize_status(BATCH, [
      {
        transaction_hash: HASH_A,
        receipt: make_receipt(HASH_A, "0x1"),
      },
      {
        transaction_hash: HASH_B,
        receipt: null,
      },
    ])
    expect(status.status).toBe(CALLS_STATUS.PENDING)
    expect(status.receipts).toBeUndefined()
  })

  it("should report CONFIRMED when every call mined and succeeded", () => {
    const status = finalize_status(BATCH, [
      {
        transaction_hash: HASH_A,
        receipt: make_receipt(HASH_A, "0x1"),
      },
      {
        transaction_hash: HASH_B,
        receipt: make_receipt(HASH_B, "0x1"),
      },
    ])
    expect(status.status).toBe(CALLS_STATUS.CONFIRMED)
    expect(status.receipts).toHaveLength(2)
    expect(status.atomic).toBe(false)
  })

  it("should report REVERTED when every call reverted", () => {
    const status = finalize_status(BATCH, [
      {
        transaction_hash: HASH_A,
        receipt: make_receipt(HASH_A, "0x0"),
      },
      {
        transaction_hash: HASH_B,
        receipt: make_receipt(HASH_B, "0x0"),
      },
    ])
    expect(status.status).toBe(CALLS_STATUS.REVERTED)
  })

  it("should report PARTIALLY_REVERTED when some calls reverted", () => {
    const status = finalize_status(BATCH, [
      {
        transaction_hash: HASH_A,
        receipt: make_receipt(HASH_A, "0x1"),
      },
      {
        transaction_hash: HASH_B,
        receipt: make_receipt(HASH_B, "0x0"),
      },
    ])
    expect(status.status).toBe(
      CALLS_STATUS.PARTIALLY_REVERTED,
    )
  })
})
