import type { Provider, RequestArguments } from "@ethernauta/eip/1193"
import { invariant } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { callSchema } from "./call"
import {
  create_injected_signer,
  create_injected_transport,
  create_provider,
} from "./provider"
import { ReadContextSchema } from "./reader"

function fake_provider(_handler: {
  request?: (args: RequestArguments) => Promise<unknown>
}): {
  provider: Provider
  captured: { last: RequestArguments | undefined }
} {
  const captured: { last: RequestArguments | undefined } = {
    last: undefined,
  }
  const provider: Provider = {
    async request(args) {
      captured.last = args
      if (_handler.request) return _handler.request(args)
      throw new Error("no request handler")
    },
    on() {},
    removeListener() {},
    emit() {},
  }
  return { provider, captured }
}

describe("create_injected_transport", () => {
  it("wraps provider.request results in a JSON-RPC response envelope", async () => {
    const { provider, captured } = fake_provider({
      request: async () => "0x1234",
    })
    const transport = create_injected_transport(provider)
    const response = await transport(
      parse(callSchema, ["eth_chainId", []]),
    )
    expect(captured.last?.method).toBe("eth_chainId")
    expect("result" in response && response.result).toBe(
      "0x1234",
    )
  })

  it("converts an EIP-1193 ProviderRpcError into a FailedResponse", async () => {
    const { provider } = fake_provider({
      request: async () => {
        throw { code: 4100, message: "unauthorized" }
      },
    })
    const transport = create_injected_transport(provider)
    const response = await transport(
      parse(callSchema, ["eth_call", []]),
    )
    expect("error" in response).toBe(true)
    if (!("error" in response)) return
    expect(response.error.message).toBe("unauthorized")
  })
})

describe("create_injected_signer", () => {
  it("returns the signed transaction from the provider", async () => {
    const { provider } = fake_provider({
      request: async () => "0xfeedbeef",
    })
    const sign = create_injected_signer(provider)
    const [signer, context] = sign({ chain_id: "eip155:1" })
    const result = await signer("eth_signTransaction", [
      { to: "0xaaaa", value: "0x1" },
    ])
    expect(result).toBe("0xfeedbeef")
    expect(context.chain_id).toBe("eip155:1")
  })

  it("JSON-encodes non-string results (e.g. eth_requestAccounts)", async () => {
    const { provider } = fake_provider({
      request: async () => [
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      ],
    })
    const sign = create_injected_signer(provider)
    const [signer] = sign({ chain_id: "eip155:1" })
    const result = await signer("eth_requestAccounts", [])
    expect(JSON.parse(result)).toEqual([
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ])
  })

  it("re-raises 4001 USER_REJECTED in the codebase shape", async () => {
    const { provider } = fake_provider({
      request: async () => {
        throw { code: 4001, message: "User denied" }
      },
    })
    const sign = create_injected_signer(provider)
    const [signer] = sign({ chain_id: "eip155:1" })
    await expect(
      signer("eth_signTransaction", []),
    ).rejects.toMatchObject({
      code: 4001,
      message: "User denied",
    })
  })
})

describe("create_provider", () => {
  it("returns a reader whose transport delegates to provider.request", async () => {
    const { provider, captured } = fake_provider({
      request: async () => "0xaa36a7",
    })
    const resolver = create_provider(provider)
    const [transports, context] = resolver.reader({
      chain_id: "eip155:11155111",
    })
    expect(context.chain_id).toBe("eip155:11155111")
    expect(transports).toHaveLength(1)
    const [transport] = transports
    invariant(transport, "expected one transport")
    const response = await transport(["eth_chainId", []])
    expect(captured.last?.method).toBe("eth_chainId")
    expect("result" in response && response.result).toBe(
      "0xaa36a7",
    )
  })

  it("returns a signer that proxies to provider.request", async () => {
    const { provider, captured } = fake_provider({
      request: async () => "0xfeedbeef",
    })
    const resolver = create_provider(provider)
    const [signer, context] = resolver.signer({
      chain_id: "eip155:1",
    })
    const result = await signer("eth_signTransaction", [
      { to: "0xaaaa", value: "0x1" },
    ])
    expect(result).toBe("0xfeedbeef")
    expect(context.chain_id).toBe("eip155:1")
    expect(captured.last?.method).toBe(
      "eth_signTransaction",
    )
  })

  it("validates the reader context schema", () => {
    expect(() => parse(ReadContextSchema, {})).toThrow()
  })

  it("propagates wallet rejection from signer (4001)", async () => {
    const { provider } = fake_provider({
      request: async () => {
        throw { code: 4001, message: "User denied" }
      },
    })
    const resolver = create_provider(provider)
    const [signer] = resolver.signer({
      chain_id: "eip155:1",
    })
    await expect(
      signer("eth_sendTransaction", []),
    ).rejects.toMatchObject({
      code: 4001,
      message: "User denied",
    })
  })
})
