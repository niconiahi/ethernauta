import { address, uint256 } from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signer,
} from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { deploy_contract } from "./deploy-contract"

describe("deploy_contract", () => {
  it("submits eth_signTransaction with no `to` and bytecode-prefixed input", async () => {
    let captured: { method: string; params: unknown } = {
      method: "",
      params: undefined,
    }
    const signer: Signer = async (method, params) => {
      captured = { method, params }
      return "0xfeedbeef"
    }
    const resolved: ResolvedSigner = [
      signer,
      { chain_id: "eip155:1" },
    ]

    const bytecode = "0x6080604052" as Bytes
    const result = await deploy_contract({
      bytecode,
      args: [address(), uint256()] as const,
      values: [
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
        "0xde0b6b3a7640000",
      ],
    })(resolved)

    expect(captured.method).toBe("eth_signTransaction")
    expect(Array.isArray(captured.params)).toBe(true)
    const tx = (captured.params as Array<Record<string, unknown>>)[0]
    expect(tx).toBeDefined()
    if (!tx) return
    expect("to" in tx).toBe(false)
    expect(tx.value).toBe("0x0")
    expect(tx.input).toBe(
      "0x6080604052" +
        "000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94" +
        "0000000000000000000000000000000000000000000000000de0b6b3a7640000",
    )
    expect(result).toBe("0xfeedbeef")
  })

  it("supports an argless constructor", async () => {
    const signer: Signer = async () => "0xabcd"
    const resolved: ResolvedSigner = [
      signer,
      { chain_id: "eip155:1" },
    ]
    const result = await deploy_contract({
      bytecode: "0x6080604052" as Bytes,
      args: [] as const,
      values: [],
    })(resolved)
    expect(result).toBe("0xabcd")
  })
})
