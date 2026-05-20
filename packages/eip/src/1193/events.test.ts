import { describe, expect, it, vi } from "vitest"
import { create_emitter } from "./events"

describe("events.ts", () => {
  it("should call a listener with the emitted payload", () => {
    const emitter = create_emitter()
    const listener = vi.fn<(chainId: string) => void>()
    emitter.on("chainChanged", listener)
    emitter.emit("chainChanged", "0x1")
    expect(listener).toHaveBeenCalledWith("0x1")
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("should support multiple listeners on one event", () => {
    const emitter = create_emitter()
    const a = vi.fn()
    const b = vi.fn()
    emitter.on("accountsChanged", a)
    emitter.on("accountsChanged", b)
    emitter.emit("accountsChanged", ["0xabc"])
    expect(a).toHaveBeenCalledWith(["0xabc"])
    expect(b).toHaveBeenCalledWith(["0xabc"])
  })

  it("should stop calling a removed listener", () => {
    const emitter = create_emitter()
    const listener = vi.fn()
    emitter.on("chainChanged", listener)
    emitter.removeListener("chainChanged", listener)
    emitter.emit("chainChanged", "0x1")
    expect(listener).not.toHaveBeenCalled()
  })

  it("should isolate listeners per event", () => {
    const emitter = create_emitter()
    const on_chain = vi.fn()
    const on_accounts = vi.fn()
    emitter.on("chainChanged", on_chain)
    emitter.on("accountsChanged", on_accounts)
    emitter.emit("chainChanged", "0x1")
    expect(on_chain).toHaveBeenCalledTimes(1)
    expect(on_accounts).not.toHaveBeenCalled()
  })

  it("should be a no-op when emitting with no listeners", () => {
    const emitter = create_emitter()
    expect(() =>
      emitter.emit("chainChanged", "0x1"),
    ).not.toThrow()
  })

  it("should not register duplicate listener references", () => {
    const emitter = create_emitter()
    const listener = vi.fn()
    emitter.on("chainChanged", listener)
    emitter.on("chainChanged", listener)
    emitter.emit("chainChanged", "0x1")
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
