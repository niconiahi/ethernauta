import type {
  ResolvedSigner,
  Signer,
} from "@ethernauta/transport"
import { describe, expect, it, vi } from "vitest"
import type { AuthorizationSigned } from "../authorization"
import { wallet_signAuthorization } from "./wallet_signAuthorization"

const PARAM = {
  chainId: "0xaa36a7" as const,
  address:
    "0xfA3a1d0c75A8D44A8DcD8c8DfcdcD52DBfdAB845" as const,
  nonce: "0x5" as const,
}

const SIGNED: AuthorizationSigned = {
  ...PARAM,
  yParity: "0x1",
  r: "0xabcd",
  s: "0xef01",
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
