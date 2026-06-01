import { parse, ValiError } from "valibot"
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
import type { ChainEntry } from "./require-chain"
import type { Signer } from "./signer"

const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const OP_SEPOLIA = encode_chain_id({
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
    chainId: SEPOLIA,
    transports: [labelled_transport("sepolia")],
  },
  {
    chainId: OP_SEPOLIA,
    transports: [labelled_transport("op-sepolia")],
  },
]

describe("BridgeInputSchema", () => {
  it("accepts a valid origin + destination pair", () => {
    const input = parse(BridgeInputSchema, {
      origin: SEPOLIA,
      destination: OP_SEPOLIA,
    })
    expect(input.origin).toBe(SEPOLIA)
    expect(input.destination).toBe(OP_SEPOLIA)
  })

  it("rejects a malformed chain id", () => {
    expect(() =>
      parse(BridgeInputSchema, {
        origin: "not a chain id",
        destination: OP_SEPOLIA,
      }),
    ).toThrow(ValiError)
  })
})

describe("create_bridge", () => {
  it("wires each side's reader to the matching chain entry", async () => {
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      origin: SEPOLIA,
      destination: OP_SEPOLIA,
    })
    const origin_response = await resolved.origin.reader([
      "eth_blockNumber",
    ])
    const destination_response =
      await resolved.destination.reader(["eth_blockNumber"])
    expect(origin_response).toMatchObject({
      result: "sepolia",
    })
    expect(destination_response).toMatchObject({
      result: "op-sepolia",
    })
  })

  it("carries chain_id on each side", () => {
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      origin: SEPOLIA,
      destination: OP_SEPOLIA,
    })
    expect(resolved.origin.chain_id).toBe(SEPOLIA)
    expect(resolved.destination.chain_id).toBe(OP_SEPOLIA)
  })

  it("leaves both signers undefined when no signer factory is passed", () => {
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      origin: SEPOLIA,
      destination: OP_SEPOLIA,
    })
    expect(resolved.origin.signer).toBeUndefined()
    expect(resolved.destination.signer).toBeUndefined()
  })

  it("calls the signer factory once per side with each side's chain_id", async () => {
    const seen_chain_ids: string[] = []
    const signer_for = (chain_id: string): Signer => {
      return async () => `signed:${chain_id}`
    }
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      origin: SEPOLIA,
      destination: OP_SEPOLIA,
      signer: ({ chain_id }) => {
        seen_chain_ids.push(chain_id)
        return signer_for(chain_id)
      },
    })
    expect(seen_chain_ids).toEqual([SEPOLIA, OP_SEPOLIA])
    const origin_signer = resolved.origin.signer
    const destination_signer = resolved.destination.signer
    if (!origin_signer || !destination_signer) {
      throw new Error("signers should be wired")
    }
    expect(
      await origin_signer("eth_sendTransaction", []),
    ).toBe(`signed:${SEPOLIA}`)
    expect(
      await destination_signer("eth_sendTransaction", []),
    ).toBe(`signed:${OP_SEPOLIA}`)
  })

  it("throws when a chain id has no entry in CHAINS", () => {
    const bridge = create_bridge(CHAINS)
    const UNKNOWN = encode_chain_id({
      namespace: "eip155",
      reference: "424242",
    })
    expect(() =>
      bridge({ origin: SEPOLIA, destination: UNKNOWN }),
    ).toThrow(/no chain configured/)
  })
})

describe("Bridgeable<T>", () => {
  it("verbs see signer = undefined when no signer factory was passed", async () => {
    let seen_origin_signer: Signer | undefined
    let seen_destination_signer: Signer | undefined
    const probe: Bridgeable<void> = async (resolved) => {
      seen_origin_signer = resolved.origin.signer
      seen_destination_signer = resolved.destination.signer
    }
    const bridge = create_bridge(CHAINS)
    const resolved = bridge({
      origin: SEPOLIA,
      destination: OP_SEPOLIA,
    })
    await probe(resolved)
    expect(seen_origin_signer).toBeUndefined()
    expect(seen_destination_signer).toBeUndefined()
  })
})
