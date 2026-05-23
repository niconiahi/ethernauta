import { describe, expect, it, vi } from "vitest"
import {
  create_envelope,
  create_provider,
  type Provider,
  type RequestArguments,
} from "./provider"

describe("create_envelope", () => {
  it("passes request straight through to the supplied handler", async () => {
    const handler = vi
      .fn<(args: RequestArguments) => Promise<unknown>>()
      .mockResolvedValue("0xaa36a7")
    const provider = create_envelope({ request: handler })
    const id = await provider.request({
      method: "eth_chainId",
    })
    expect(id).toBe("0xaa36a7")
    expect(handler).toHaveBeenCalledWith({
      method: "eth_chainId",
    })
  })

  it("propagates handler errors verbatim", async () => {
    const provider = create_envelope({
      request: async () => {
        throw { code: 4001, message: "User denied" }
      },
    })
    await expect(
      provider.request({ method: "eth_sendTransaction" }),
    ).rejects.toMatchObject({
      code: 4001,
      message: "User denied",
    })
  })

  it("emits subscribed events to listeners", () => {
    const provider = create_envelope({
      request: async () => null,
    })
    const listener = vi.fn()
    provider.on("chainChanged", listener)
    provider.emit("chainChanged", "0xaa36a7")
    expect(listener).toHaveBeenCalledWith("0xaa36a7")
  })

  it("stops calling a listener after removeListener", () => {
    const provider = create_envelope({
      request: async () => null,
    })
    const listener = vi.fn()
    provider.on("accountsChanged", listener)
    provider.removeListener("accountsChanged", listener)
    provider.emit("accountsChanged", ["0xabc"])
    expect(listener).not.toHaveBeenCalled()
  })

  it("fans out to multiple listeners on the same event", () => {
    const provider = create_envelope({
      request: async () => null,
    })
    const a = vi.fn()
    const b = vi.fn()
    provider.on("chainChanged", a)
    provider.on("chainChanged", b)
    provider.emit("chainChanged", "0x1")
    expect(a).toHaveBeenCalledWith("0x1")
    expect(b).toHaveBeenCalledWith("0x1")
  })
})

function fake_provider(
  request: (args: RequestArguments) => Promise<unknown>,
): {
  provider: Provider
  captured: { last: RequestArguments | undefined }
} {
  const captured: { last: RequestArguments | undefined } = {
    last: undefined,
  }
  const provider: Provider = {
    async request(args) {
      captured.last = args
      return request(args)
    },
    on() {},
    removeListener() {},
  }
  return { provider, captured }
}

describe("create_provider", () => {
  it("returns a reader that wraps provider.request as Http", async () => {
    const { provider, captured } = fake_provider(
      async () => "0xaa36a7",
    )
    const resolver = create_provider(provider)
    const [transports, context] = resolver.reader({
      chain_id: "eip155:11155111",
    })
    expect(context.chain_id).toBe("eip155:11155111")
    expect(transports).toHaveLength(1)
    const response = await transports[0]!([
      "eth_chainId",
      [],
    ])
    expect(captured.last?.method).toBe("eth_chainId")
    expect("result" in response && response.result).toBe(
      "0xaa36a7",
    )
  })

  it("returns a signer that proxies to provider.request", async () => {
    const { provider, captured } = fake_provider(
      async () => "0xfeedbeef",
    )
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
    const { provider } = fake_provider(async () => "0x1")
    const resolver = create_provider(provider)
    expect(() => resolver.reader({} as never)).toThrow()
  })

  it("propagates wallet rejection from signer (4001)", async () => {
    const { provider } = fake_provider(async () => {
      throw { code: 4001, message: "User denied" }
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
