import { afterEach, describe, expect, it } from "vitest"

import {
  NO_PLUGIN_MESSAGE,
  clear_endpoint,
  set_endpoint,
} from "./endpoint-store"
import { anvil } from "./test"

// Unit tests that do not need a live anvil — exercise the
// validation boundary and the no-plugin error.

describe("anvil()", () => {
  afterEach(() => {
    clear_endpoint()
  })

  it("throws the documented error when no plugin has set an endpoint", () => {
    expect(() => anvil()).toThrowError(NO_PLUGIN_MESSAGE)
  })

  it("returns the endpoint URL when the plugin has set one", () => {
    set_endpoint("http://127.0.0.1:41723")
    expect(anvil()).toBe("http://127.0.0.1:41723")
  })

  it("accepts a fully-specified valid config", () => {
    set_endpoint("http://127.0.0.1:41723")
    expect(
      anvil({
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
