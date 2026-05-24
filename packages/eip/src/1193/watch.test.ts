import { describe, expect, it } from "vitest"

import type { EventMap, EventName } from "./events"
import type { Provider } from "./provider"
import { watch_accounts, watch_chain } from "./watch"

function fake_provider(): {
  provider: Provider
  emit: <E extends EventName>(event: E, payload: EventMap[E]) => void
  buckets: { [E in EventName]: Set<(payload: EventMap[E]) => void> }
} {
  const buckets: {
    [E in EventName]: Set<(payload: EventMap[E]) => void>
  } = {
    connect: new Set(),
    disconnect: new Set(),
    chainChanged: new Set(),
    accountsChanged: new Set(),
    message: new Set(),
  }
  const provider: Provider = {
    async request() {
      throw new Error("no request handler in fake_provider")
    },
    on(event, listener) {
      buckets[event].add(listener)
    },
    removeListener(event, listener) {
      buckets[event].delete(listener)
    },
  }
  function emit<E extends EventName>(
    event: E,
    payload: EventMap[E],
  ) {
    for (const listener of buckets[event]) listener(payload)
  }
  return { provider, emit, buckets }
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
    const { provider, emit, buckets } = fake_provider()
    const received: string[][] = []
    const off = watch_accounts(provider, (accounts) => {
      received.push(accounts)
    })
    expect(buckets.accountsChanged.size).toBe(1)
    off()
    expect(buckets.accountsChanged.size).toBe(0)
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
    const { provider, emit, buckets } = fake_provider()
    const received: string[] = []
    const off = watch_chain(provider, (chain_id) => {
      received.push(chain_id)
    })
    off()
    expect(buckets.chainChanged.size).toBe(0)
    emit("chainChanged", "0x1")
    expect(received).toEqual([])
  })
})
