import { invariant } from "@ethernauta/utils"
import { describe, expect, it } from "vitest"
import {
  clear_provider_detail,
  discover_providers,
  type EIP6963ProviderDetail,
  get_provider_detail,
  pick_provider,
  type Provider,
  set_provider_detail,
  type Store,
} from "."

const STUB_PROVIDER: Provider = {
  request: async () => null,
  on: () => {},
  removeListener: () => {},
  emit: () => {},
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
    const [first] = providers
    invariant(
      first,
      "expected at least one announced provider",
    )
    expect(first.info.rdns).toBe("io.walleta")
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

function make_store(): Store {
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

function provider_detail_for(
  rdns: string,
  provider: Provider,
): EIP6963ProviderDetail {
  return {
    info: {
      uuid: "u",
      name: "fake",
      icon: "data:,",
      rdns,
    },
    provider,
  }
}

describe("persistence helpers", () => {
  it("set and clear round-trip through the store", () => {
    const store = make_store()
    set_provider_detail({
      store,
      key: "wallet",
      provider_detail: provider_detail_for(
        "com.ethernauta.wallet",
        STUB_PROVIDER,
      ),
    })
    expect(store.get("wallet")).toBe(
      "com.ethernauta.wallet",
    )
    clear_provider_detail({ store, key: "wallet" })
    expect(store.get("wallet")).toBeNull()
  })

  it("get returns null when no rdns is persisted", async () => {
    const target = build_target()
    const store = make_store()
    const provider_detail = await get_provider_detail({
      store,
      key: "wallet",
      target,
      ms: 20,
    })
    expect(provider_detail).toBeNull()
  })

  it("get rehydrates the full provider_detail matching the persisted rdns", async () => {
    const target = build_target()
    const store = make_store()
    const ETHERNAUTA: Provider = {
      request: async () => "ethernauta",
      on: () => {},
      removeListener: () => {},
      emit: () => {},
    }
    const OTHER: Provider = {
      request: async () => "other",
      on: () => {},
      removeListener: () => {},
      emit: () => {},
    }
    set_provider_detail({
      store,
      key: "wallet",
      provider_detail: provider_detail_for(
        "com.ethernauta.wallet",
        ETHERNAUTA,
      ),
    })
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
    const provider_detail = await get_provider_detail({
      store,
      key: "wallet",
      target,
      ms: 30,
    })
    expect(provider_detail?.provider).toBe(ETHERNAUTA)
    expect(provider_detail?.info.rdns).toBe(
      "com.ethernauta.wallet",
    )
  })

  it("get returns null when the persisted wallet did not announce", async () => {
    const target = build_target()
    const store = make_store()
    set_provider_detail({
      store,
      key: "wallet",
      provider_detail: provider_detail_for(
        "com.ethernauta.wallet",
        STUB_PROVIDER,
      ),
    })
    const provider_detail = await get_provider_detail({
      store,
      key: "wallet",
      target,
      ms: 20,
    })
    expect(provider_detail).toBeNull()
  })
})
