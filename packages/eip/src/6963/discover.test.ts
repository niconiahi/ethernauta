import { describe, expect, it } from "vitest"
import {
  discover_providers,
  forget_picked_provider,
  type Provider,
  pick_provider,
  remember_picked_provider,
  restore_picked_provider,
  type Storage,
} from "."

const STUB_PROVIDER: Provider = {
  request: async () => null,
  on: () => {},
  removeListener: () => {},
}

function build_target(): EventTarget {
  return new EventTarget()
}

describe("discover.ts", () => {
  it("should discover a single announced provider", async () => {
    const target = build_target()
    function answer(event: Event) {
      if (event.type !== "eip6963:requestProvider") return
      target.dispatchEvent(
        new CustomEvent("eip6963:announceProvider", {
          detail: {
            info: {
              uuid: "u",
              name: "Wallet A",
              icon: "data:,",
              rdns: "io.walleta",
            },
            provider: STUB_PROVIDER,
          },
        }),
      )
    }
    target.addEventListener(
      "eip6963:requestProvider",
      answer,
    )
    const providers = await discover_providers({
      target,
      ms: 30,
    })
    expect(providers).toHaveLength(1)
    expect(providers[0]!.info.rdns).toBe("io.walleta")
  })

  it("should dedupe announcements by rdns", async () => {
    const target = build_target()
    function answer() {
      const detail = {
        info: {
          uuid: "u",
          name: "Wallet A",
          icon: "data:,",
          rdns: "io.walleta",
        },
        provider: STUB_PROVIDER,
      }
      target.dispatchEvent(
        new CustomEvent("eip6963:announceProvider", {
          detail,
        }),
      )
      target.dispatchEvent(
        new CustomEvent("eip6963:announceProvider", {
          detail,
        }),
      )
    }
    target.addEventListener(
      "eip6963:requestProvider",
      answer,
    )
    const providers = await discover_providers({
      target,
      ms: 30,
    })
    expect(providers).toHaveLength(1)
  })

  it("should collect multiple wallets", async () => {
    const target = build_target()
    target.addEventListener(
      "eip6963:requestProvider",
      () => {
        for (const rdns of [
          "io.walleta",
          "io.walletb",
          "io.walletc",
        ]) {
          target.dispatchEvent(
            new CustomEvent("eip6963:announceProvider", {
              detail: {
                info: {
                  uuid: rdns,
                  name: rdns,
                  icon: "data:,",
                  rdns,
                },
                provider: STUB_PROVIDER,
              },
            }),
          )
        }
      },
    )
    const providers = await discover_providers({
      target,
      ms: 30,
    })
    const ids = providers.map((p) => p.info.rdns).sort()
    expect(ids).toEqual([
      "io.walleta",
      "io.walletb",
      "io.walletc",
    ])
  })

  it("should resolve to [] when no wallet responds", async () => {
    const target = build_target()
    const providers = await discover_providers({
      target,
      ms: 20,
    })
    expect(providers).toEqual([])
  })

  it("should pick a provider by rdns", async () => {
    const target = build_target()
    target.addEventListener(
      "eip6963:requestProvider",
      () => {
        for (const rdns of [
          "io.walleta",
          "com.ethernauta.wallet",
        ]) {
          target.dispatchEvent(
            new CustomEvent("eip6963:announceProvider", {
              detail: {
                info: {
                  uuid: rdns,
                  name: rdns,
                  icon: "data:,",
                  rdns,
                },
                provider: STUB_PROVIDER,
              },
            }),
          )
        }
      },
    )
    const ethernauta = await pick_provider(
      "com.ethernauta.wallet",
      { target, ms: 30 },
    )
    expect(ethernauta?.info.rdns).toBe(
      "com.ethernauta.wallet",
    )
    const missing = await pick_provider("io.unknown", {
      target,
      ms: 30,
    })
    expect(missing).toBeUndefined()
  })
})

function make_storage(): Storage {
  const map = new Map<string, string>()
  return {
    get(key) {
      return map.get(key) ?? null
    },
    set(key, value) {
      map.set(key, value)
    },
    remove(key) {
      map.delete(key)
    },
  }
}

describe("persistence helpers", () => {
  it("remember and forget round-trip through storage", () => {
    const storage = make_storage()
    remember_picked_provider({
      storage,
      key: "wallet",
      rdns: "com.ethernauta.wallet",
    })
    expect(storage.get("wallet")).toBe(
      "com.ethernauta.wallet",
    )
    forget_picked_provider({ storage, key: "wallet" })
    expect(storage.get("wallet")).toBeNull()
  })

  it("restore returns null when no rdns is persisted", async () => {
    const target = build_target()
    const storage = make_storage()
    const provider = await restore_picked_provider({
      storage,
      key: "wallet",
      target,
      ms: 20,
    })
    expect(provider).toBeNull()
  })

  it("restore rehydrates the live Provider matching the persisted rdns", async () => {
    const target = build_target()
    const storage = make_storage()
    remember_picked_provider({
      storage,
      key: "wallet",
      rdns: "com.ethernauta.wallet",
    })
    const ETHERNAUTA: Provider = {
      request: async () => "ethernauta",
      on: () => {},
      removeListener: () => {},
    }
    const OTHER: Provider = {
      request: async () => "other",
      on: () => {},
      removeListener: () => {},
    }
    target.addEventListener(
      "eip6963:requestProvider",
      () => {
        target.dispatchEvent(
          new CustomEvent("eip6963:announceProvider", {
            detail: {
              info: {
                uuid: "u",
                name: "Other",
                icon: "data:,",
                rdns: "io.other",
              },
              provider: OTHER,
            },
          }),
        )
        target.dispatchEvent(
          new CustomEvent("eip6963:announceProvider", {
            detail: {
              info: {
                uuid: "v",
                name: "Ethernauta",
                icon: "data:,",
                rdns: "com.ethernauta.wallet",
              },
              provider: ETHERNAUTA,
            },
          }),
        )
      },
    )
    const provider = await restore_picked_provider({
      storage,
      key: "wallet",
      target,
      ms: 30,
    })
    expect(provider).toBe(ETHERNAUTA)
  })

  it("restore returns null when the persisted wallet did not announce", async () => {
    const target = build_target()
    const storage = make_storage()
    remember_picked_provider({
      storage,
      key: "wallet",
      rdns: "com.ethernauta.wallet",
    })
    const provider = await restore_picked_provider({
      storage,
      key: "wallet",
      target,
      ms: 20,
    })
    expect(provider).toBeNull()
  })
})
