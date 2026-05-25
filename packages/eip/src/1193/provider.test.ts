import { describe, expect, it, vi } from "vitest"
import {
  create_provider,
  type RequestArguments,
} from "./provider"

describe("create_provider", () => {
  it("passes request straight through to the supplied handler", async () => {
    const handler = vi
      .fn<(args: RequestArguments) => Promise<unknown>>()
      .mockResolvedValue("0xaa36a7")
    const provider = create_provider({ request: handler })
    const id = await provider.request({
      method: "eth_chainId",
    })
    expect(id).toBe("0xaa36a7")
    expect(handler).toHaveBeenCalledWith({
      method: "eth_chainId",
    })
  })

  it("propagates handler errors verbatim", async () => {
    const provider = create_provider({
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
    const provider = create_provider({
      request: async () => null,
    })
    const listener = vi.fn()
    provider.on("chainChanged", listener)
    provider.emit("chainChanged", "0xaa36a7")
    expect(listener).toHaveBeenCalledWith("0xaa36a7")
  })

  it("stops calling a listener after removeListener", () => {
    const provider = create_provider({
      request: async () => null,
    })
    const listener = vi.fn()
    provider.on("accountsChanged", listener)
    provider.removeListener("accountsChanged", listener)
    provider.emit("accountsChanged", ["0xabc"])
    expect(listener).not.toHaveBeenCalled()
  })

  it("fans out to multiple listeners on the same event", () => {
    const provider = create_provider({
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
