import type { Address, Bytes, Hash32 } from "@ethernauta/core"
import type { Http, ResolvedReader } from "@ethernauta/transport"
import { describe, expect, it, vi } from "vitest"

import { verify_hash } from "./verify-hash"

const ADDRESS =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as Address
const HASH =
  "0x88cd2108bf28cb88ce6b8e54bd9f4f99c1d1a3a3c5b8b1d3b3e4b8b2c4e6a7a8" as Hash32
const SIGNATURE = `0x${"ab".repeat(65)}` as Bytes
const CHAIN_ID = "eip155:1"

function resolved_with(transport: Http): ResolvedReader {
  return [[transport], { chain_id: CHAIN_ID }]
}

function ok(result: unknown) {
  return { jsonrpc: "2.0" as const, id: 1, result }
}

function err(message: string) {
  return {
    jsonrpc: "2.0" as const,
    id: 1,
    error: { code: -32000 as const, message },
  }
}

describe("verify-hash.ts (6492)", () => {
  it("should return true when the validator returns 0x01", async () => {
    const transport = vi.fn().mockResolvedValue(ok("0x01"))
    const result = await verify_hash({
      address: ADDRESS,
      hash: HASH,
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
  })

  it("should return false when the validator returns 0x00", async () => {
    const transport = vi.fn().mockResolvedValue(ok("0x00"))
    const result = await verify_hash({
      address: ADDRESS,
      hash: HASH,
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })

  it("should return false (not throw) when the validator reverts", async () => {
    const transport = vi
      .fn()
      .mockResolvedValue(err("execution reverted"))
    const result = await verify_hash({
      address: ADDRESS,
      hash: HASH,
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })

  it("should return false (not throw) when every transport rejects", async () => {
    const transport = vi
      .fn()
      .mockRejectedValue(new Error("network down"))
    const result = await verify_hash({
      address: ADDRESS,
      hash: HASH,
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })

  it("should return false when the validator returns more than one byte", async () => {
    const transport = vi
      .fn()
      .mockResolvedValue(ok("0x0101"))
    const result = await verify_hash({
      address: ADDRESS,
      hash: HASH,
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })

  it("should send an eth_call with no `to` and validator bytecode in input", async () => {
    const transport = vi.fn().mockResolvedValue(ok("0x01"))
    await verify_hash({
      address: ADDRESS,
      hash: HASH,
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    const call = transport.mock.calls[0]?.[0]
    expect(call?.[0]).toBe("eth_call")
    const [tx, block] = call?.[1] as [
      { to?: unknown; input: string },
      string,
    ]
    expect(tx.to).toBeUndefined()
    expect(tx.input.startsWith("0x608060405234801561001057")).toBe(
      true,
    )
    expect(block).toBe("latest")
  })
})
