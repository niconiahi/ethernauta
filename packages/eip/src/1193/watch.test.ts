import { describe, expect, it } from "vitest"

import type { EventName } from "./events"
import type { Provider } from "./provider"
import { watch_accounts, watch_chain } from "./watch"

function fake_provider(): {
  provider: Provider
  emit: (event: EventName, payload: unknown) => void
  listeners: Map<EventName, Set<(payload: unknown) => void>>
} {
  const listeners = new Map<
    EventName,
    Set<(payload: unknown) => void>
  >()
  const provider: Provider = {
    async request() {
      throw new Error("no request handler in fake_provider")
    },
    on(event, listener) {
      const set =
        listeners.get(event as EventName) ??
        new Set<(payload: unknown) => void>()
      set.add(listener as (payload: unknown) => void)
      listeners.set(event as EventName, set)
    },
    removeListener(event, listener) {
      const set = listeners.get(event as EventName)
      if (!set) return
      set.delete(
        listener as (payload: unknown) => void,
      )
    },
  }
  function emit(event: EventName, payload: unknown) {
    const set = listeners.get(event)
    if (!set) return
    for (const listener of set) listener(payload)
  }
  return { provider, emit, listeners }
}

describe("watch_accounts", () => {
  it("forwards validated addresses to the handler", () => {
    const { provider, emit } = fake_provider()
    const received: string[][] = []
    watch_accounts(provider, (accounts) => {
      received.push(accounts)
    })
    emit("accountsChanged", [
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ])
    expect(received).toEqual([
      ["0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
    ])
  })

  it("returns an unsubscribe that removes the listener", () => {
    const { provider, emit, listeners } = fake_provider()
    const received: string[][] = []
    const off = watch_accounts(provider, (accounts) => {
      received.push(accounts)
    })
    expect(
      listeners.get("accountsChanged")?.size,
    ).toBe(1)
    off()
    expect(
      listeners.get("accountsChanged")?.size,
    ).toBe(0)
    emit("accountsChanged", [
      "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ])
    expect(received).toEqual([])
  })
})

describe("watch_chain", () => {
  it("forwards the chain id payload to the handler", () => {
    const { provider, emit } = fake_provider()
    const received: string[] = []
    watch_chain(provider, (chain_id) => {
      received.push(chain_id)
    })
    emit("chainChanged", "0x1")
    emit("chainChanged", "0xaa36a7")
    expect(received).toEqual(["0x1", "0xaa36a7"])
  })

  it("unsubscribe detaches the listener", () => {
    const { provider, emit, listeners } = fake_provider()
    const received: string[] = []
    const off = watch_chain(provider, (chain_id) => {
      received.push(chain_id)
    })
    off()
    expect(listeners.get("chainChanged")?.size).toBe(0)
    emit("chainChanged", "0x1")
    expect(received).toEqual([])
  })
})
