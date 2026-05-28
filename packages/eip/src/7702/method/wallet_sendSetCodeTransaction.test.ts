import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signer,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it, vi } from "vitest"
import {
  SendSetCodeTransactionParametersSchema,
  wallet_sendSetCodeTransaction,
} from "./wallet_sendSetCodeTransaction"

const BATCH_EXECUTOR = parse(
  AddressSchema,
  "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
)
const EOA = parse(
  AddressSchema,
  "0x1234567890123456789012345678901234567890",
)
const TX_HASH =
  "0xdb9a5f2320c0a10d28bfa1c563a1bbf592665e9e02a86fe7a8a7d2c0e2c5f6b1"

const VALID = {
  to: EOA,
  data: parse(BytesSchema, "0x"),
  delegations: [
    {
      chainId: parse(UintSchema, "0xaa36a7"),
      address: BATCH_EXECUTOR,
    },
  ],
}

function mock_signer(result: string): ResolvedSigner {
  const signer: Signer = vi.fn(async () => result)
  return [signer, { chain_id: "eip155:11155111" }]
}

describe("wallet_sendSetCodeTransaction.ts", () => {
  it("should accept the minimal happy-path params", () => {
    expect(() =>
      parse(SendSetCodeTransactionParametersSchema, VALID),
    ).not.toThrow()
  })

  it("should accept optional value, gasLimit and data", () => {
    const full = {
      ...VALID,
      value: "0x0" as const,
      gasLimit: "0x100000" as const,
      data: "0xa9059cbb" as const,
    }
    expect(() =>
      parse(SendSetCodeTransactionParametersSchema, full),
    ).not.toThrow()
  })

  it("should reject when delegations is missing", () => {
    const bad = { to: EOA }
    expect(() =>
      parse(SendSetCodeTransactionParametersSchema, bad),
    ).toThrow()
  })

  it("should reject when a delegation address is malformed", () => {
    const bad = {
      to: EOA,
      delegations: [
        { chainId: "0x1" as const, address: "0xnope" },
      ],
    }
    expect(() =>
      parse(SendSetCodeTransactionParametersSchema, bad),
    ).toThrow()
  })

  it("should reject when data is not 0x-prefixed even-length hex", () => {
    const bad = { ...VALID, data: "0xabc" }
    expect(() =>
      parse(SendSetCodeTransactionParametersSchema, bad),
    ).toThrow()
  })

  it("should forward the validated params to the signer", async () => {
    const resolved = mock_signer(TX_HASH)
    await wallet_sendSetCodeTransaction(VALID)(resolved)
    expect(resolved[0]).toHaveBeenCalledWith(
      "wallet_sendSetCodeTransaction",
      parse(SendSetCodeTransactionParametersSchema, VALID),
    )
  })

  it("returns the tx hash narrowed via Hash32Schema", async () => {
    const out = await wallet_sendSetCodeTransaction(VALID)(
      mock_signer(TX_HASH),
    )
    expect(out).toBe(TX_HASH)
  })

  it("should reject when the wallet returns a malformed hash", async () => {
    await expect(
      wallet_sendSetCodeTransaction(VALID)(
        mock_signer("0xdeadbeef"),
      ),
    ).rejects.toThrow()
  })
})
