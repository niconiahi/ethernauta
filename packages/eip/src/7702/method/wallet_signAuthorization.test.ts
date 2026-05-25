import { addressSchema, uintSchema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signer,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it, vi } from "vitest"
import type {
  AuthorizationParameter,
  AuthorizationSigned,
} from "../authorization"
import { wallet_signAuthorization } from "./wallet_signAuthorization"

const PARAM: AuthorizationParameter = {
  chainId: parse(uintSchema, "0xaa36a7"),
  address: parse(
    addressSchema,
    "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845",
  ),
  nonce: parse(uintSchema, "0x5"),
}

const SIGNED: AuthorizationSigned = {
  ...PARAM,
  yParity: parse(uintSchema, "0x1"),
  r: parse(uintSchema, "0xabcd"),
  s: parse(uintSchema, "0xef01"),
}

function mock_signer(result: unknown): ResolvedSigner {
  const signer: Signer = vi.fn(async () =>
    JSON.stringify(result),
  )
  return [signer, { chain_id: "eip155:11155111" }]
}

describe("wallet_signAuthorization.ts", () => {
  it("should forward the authorization tuple to the signer", async () => {
    const resolved = mock_signer(SIGNED)
    await wallet_signAuthorization(PARAM)(resolved)
    expect(resolved[0]).toHaveBeenCalledWith(
      "wallet_signAuthorization",
      PARAM,
    )
  })

  it("should return the parsed signed authorization", async () => {
    const out = await wallet_signAuthorization(PARAM)(
      mock_signer(SIGNED),
    )
    expect(out).toEqual(SIGNED)
  })

  it("should reject a malformed signature returned by the wallet", async () => {
    const bad = { ...SIGNED, r: "not-hex" }
    await expect(
      wallet_signAuthorization(PARAM)(mock_signer(bad)),
    ).rejects.toThrow()
  })
})
