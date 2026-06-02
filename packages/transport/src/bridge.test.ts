import { AddressSchema } from "@ethernauta/core"
import { parse, string, ValiError } from "valibot"
import { describe, expect, it } from "vitest"

import {
  type Bridgeable,
  BridgeInputSchema,
  create_bridge,
} from "./bridge"
import type { Call } from "./call"
import { encode_chain_id } from "./chain"
import type { Http } from "./http"
import type { Response } from "./json-rpc"
import type { ChainEntry } from "./reader"
import type { Signer } from "./signer"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const OP_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: "11155420",
})

function labelled_transport(label: string): Http {
  return async (_call: Call): Promise<Response> => ({
    jsonrpc: "2.0",
    id: "1",
    result: label,
  })
}

const CHAINS: ChainEntry[] = [
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [labelled_transport("sepolia")],
  },
  {
    chainId: OP_SEPOLIA_CHAIN_ID,
    transports: [labelled_transport("op-sepolia")],
  },
]

describe("BridgeInputSchema", () => {
  it("accepts a valid l1 + l2 pair", () => {
    const input = parse(BridgeInputSchema, {
      l1: SEPOLIA_CHAIN_ID,
      l2: OP_SEPOLIA_CHAIN_ID,
    })
    expect(input.l1).toBe(SEPOLIA_CHAIN_ID)
    expect(input.l2).toBe(OP_SEPOLIA_CHAIN_ID)
  })

  it("rejects a malformed chain id", () => {
    expect(() =>
      parse(BridgeInputSchema, {
        l1: "not a chain id",
        l2: OP_SEPOLIA_CHAIN_ID,
      }),
    ).toThrow(ValiError)
  })
})

describe("create_bridge", () => {
  it("wires each side's reader to the matching chain entry", async () => {
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      l1: SEPOLIA_CHAIN_ID,
      l2: OP_SEPOLIA_CHAIN_ID,
    })
    const l1_response = await resolved.l1.reader([
      "eth_blockNumber",
    ])
    const l2_response = await resolved.l2.reader([
      "eth_blockNumber",
    ])
    expect(l1_response).toMatchObject({
      result: "sepolia",
    })
    expect(l2_response).toMatchObject({
      result: "op-sepolia",
    })
  })

  it("carries chain_id on each side", () => {
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      l1: SEPOLIA_CHAIN_ID,
      l2: OP_SEPOLIA_CHAIN_ID,
    })
    expect(resolved.l1.chain_id).toBe(SEPOLIA_CHAIN_ID)
    expect(resolved.l2.chain_id).toBe(OP_SEPOLIA_CHAIN_ID)
  })

  it("throws when a chain id has no entry in CHAINS", () => {
    const bridge = create_bridge(CHAINS)
    const UNKNOWN = encode_chain_id({
      namespace: "eip155",
      reference: "424242",
    })
    expect(() =>
      bridge({ l1: SEPOLIA_CHAIN_ID, l2: UNKNOWN }),
    ).toThrow(/no chain configured/)
  })
})

describe("Bridgeable<T>", () => {
  it("invokes the verb with both readers", async () => {
    const probe: Bridgeable<{ l1: string; l2: string }> =
      async (resolved) => {
        const l1_response = await resolved.l1.reader([
          "eth_blockNumber",
        ])
        const l2_response = await resolved.l2.reader([
          "eth_blockNumber",
        ])
        if (
          !("result" in l1_response) ||
          !("result" in l2_response)
        ) {
          throw new Error("both sides should return result")
        }
        return {
          l1: parse(string(), l1_response.result),
          l2: parse(string(), l2_response.result),
        }
      }
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      l1: SEPOLIA_CHAIN_ID,
      l2: OP_SEPOLIA_CHAIN_ID,
    })
    const seen = await probe(resolved)
    expect(seen.l1).toBe("sepolia")
    expect(seen.l2).toBe("op-sepolia")
  })
})

describe("create_bridge with signer", () => {
  it("unpacks [signer, ctx] and stores only the function on top-level", async () => {
    const captured: string[] = []
    const signer: Signer = async (method) => {
      captured.push(method)
      return "0xdead"
    }
    const ctx = {
      chain_id: SEPOLIA_CHAIN_ID,
      to: parse(
        AddressSchema,
        "0x0000000000000000000000000000000000000001",
      ),
    }
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      l1: SEPOLIA_CHAIN_ID,
      l2: OP_SEPOLIA_CHAIN_ID,
      signer: [signer, ctx],
    })
    expect(typeof resolved.signer).toBe("function")
    if (!resolved.signer) {
      throw new Error("signer should be defined")
    }
    await resolved.signer("eth_signTransaction", [
      { foo: "bar" },
    ])
    expect(captured.length).toBe(1)
    expect(captured[0]).toBe("eth_signTransaction")
  })

  it("leaves signer undefined when no signer input is provided", () => {
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      l1: SEPOLIA_CHAIN_ID,
      l2: OP_SEPOLIA_CHAIN_ID,
    })
    expect(resolved.signer).toBeUndefined()
  })
})
