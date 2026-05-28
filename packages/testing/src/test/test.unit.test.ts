import { afterEach, describe, expect, it } from "vitest"

import { NO_PLUGIN_MESSAGE, clear_endpoint, set_endpoint } from "./endpoint-store"
import { test as anvilTest } from "./test"

// Unit tests that do not need a live anvil — exercise the
// validation boundary and the no-plugin error.

describe("test()", () => {
  afterEach(() => {
    clear_endpoint()
  })

  it("throws the documented error when no plugin has set an endpoint", () => {
    expect(() => anvilTest()).toThrowError(NO_PLUGIN_MESSAGE)
  })

  it("returns the endpoint URL when the plugin has set one", () => {
    set_endpoint("http://127.0.0.1:41723")
    expect(anvilTest()).toBe("http://127.0.0.1:41723")
  })

  it("accepts a fully-specified valid config", () => {
    set_endpoint("http://127.0.0.1:41723")
    expect(
      anvilTest({
        chainId: 31337,
        accounts: 10,
        mnemonic: "test test test",
        blockTime: 1,
        baseFee: 1_000_000_000n,
        hardfork: "cancun",
        port: 41723,
        extraArgs: ["--silent"],
        isolate: true,
      }),
    ).toBe("http://127.0.0.1:41723")
  })
})
