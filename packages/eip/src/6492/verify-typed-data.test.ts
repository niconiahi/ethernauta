import type { Address, Bytes } from "@ethernauta/core"
import type { Http, ResolvedReader } from "@ethernauta/transport"
import { describe, expect, it, vi } from "vitest"

import type { TypedData } from "../712/typed-data"
import { verify_typed_data } from "./verify-typed-data"

const ADDRESS =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as Address
const SIGNATURE = `0x${"ab".repeat(65)}` as Bytes
const CHAIN_ID = "eip155:1"

const TYPED_DATA: TypedData = {
  domain: {
    name: "Ether Mail",
    version: "1",
    chainId: 1,
    verifyingContract:
      "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  },
  types: {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" },
    ],
  },
  primaryType: "Mail",
  message: {
    from: {
      name: "Cow",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
    },
    contents: "Hello, Bob!",
  },
}

function resolved_with(transport: Http): ResolvedReader {
  return [[transport], { chain_id: CHAIN_ID }]
}

describe("verify-typed-data.ts (6492)", () => {
  it("should return true when the validator accepts the eip-712 digest", async () => {
    const transport = vi.fn().mockResolvedValue({
      jsonrpc: "2.0" as const,
      id: 1,
      result: "0x01",
    })
    const result = await verify_typed_data({
      address: ADDRESS,
      typedData: TYPED_DATA,
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(true)
  })

  it("should return false when the validator rejects", async () => {
    const transport = vi.fn().mockResolvedValue({
      jsonrpc: "2.0" as const,
      id: 1,
      result: "0x00",
    })
    const result = await verify_typed_data({
      address: ADDRESS,
      typedData: TYPED_DATA,
      signature: SIGNATURE,
    })(resolved_with(transport as unknown as Http))
    expect(result).toBe(false)
  })
})
