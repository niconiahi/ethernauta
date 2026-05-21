import type { Address, Bytes } from "@ethernauta/core"
import type {
  Http,
  ResolvedReader,
} from "@ethernauta/transport"
import { describe, expect, it, vi } from "vitest"

import { verify_message } from "./verify-message"

const ADDRESS =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as Address
const SIGNATURE = `0x${"ab".repeat(65)}` as Bytes
const CHAIN_ID = "eip155:1"

function resolved_with(transport: Http): ResolvedReader {
  return [[transport], { chain_id: CHAIN_ID }]
}

describe("verify-message.ts (6492)", () => {
  it("should return true when the validator accepts the eip-191 hash", async () => {
    const transport = vi.fn().mockResolvedValue({
      jsonrpc: "2.0" as const,
      id: 1,
      result: "0x01",
    })
    const result = await verify_message({
      address: ADDRESS,
      message: "hello",
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
    expect(transport).toHaveBeenCalledOnce()
  })

  it("should return false when the validator rejects", async () => {
    const transport = vi.fn().mockResolvedValue({
      jsonrpc: "2.0" as const,
      id: 1,
      result: "0x00",
    })
    const result = await verify_message({
      address: ADDRESS,
      message: "hello",
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })
})
