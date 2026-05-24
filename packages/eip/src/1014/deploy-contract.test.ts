import { address, uint256 } from "@ethernauta/abi"
import { bytesSchema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signer,
} from "@ethernauta/transport"
import { invariant } from "@ethernauta/utils"
import { object, parse, string } from "valibot"
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

    const bytecode = parse(bytesSchema, "0x6080604052")
    const result = await deploy_contract({
      bytecode,
      args: [address(), uint256()] as const,
      values: [
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
        "0xde0b6b3a7640000",
      ],
    })(resolved)

    expect(captured.method).toBe("eth_signTransaction")
    invariant(
      Array.isArray(captured.params),
      "expected array-form params",
    )
    const [raw_tx] = captured.params
    invariant(
      raw_tx && typeof raw_tx === "object",
      "expected tx object as first param",
    )
    expect("to" in raw_tx).toBe(false)
    const tx = parse(
      object({ value: string(), input: string() }),
      raw_tx,
    )
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
      bytecode: parse(bytesSchema, "0x6080604052"),
      args: [] as const,
      values: [],
    })(resolved)
    expect(result).toBe("0xabcd")
  })
})
