import { describe, expect, it } from "vitest"

import { build_anvil_args } from "./spawn-anvil"

describe("build_anvil_args", () => {
  it("emits the bare port flag when no other options are set", () => {
    expect(build_anvil_args({ port: 41723 })).toEqual([
      "--port",
      "41723",
    ])
  })

  it("translates first-class overrides into anvil CLI flags", () => {
    const args = build_anvil_args({
      port: 9000,
      chainId: 1337,
      accounts: 20,
      mnemonic: "test test test",
      blockTime: 2,
      baseFee: 1_000_000_000n,
      hardfork: "cancun",
    })
    expect(args).toEqual([
      "--port",
      "9000",
      "--chain-id",
      "1337",
      "--accounts",
      "20",
      "--mnemonic",
      "test test test",
      "--block-time",
      "2",
      "--base-fee",
      "1000000000",
      "--hardfork",
      "cancun",
    ])
  })

  it("threads fork.url and fork.blockNumber", () => {
    const args = build_anvil_args({
      port: 9001,
      fork: {
        url: "https://sepolia.example.com",
        blockNumber: 12345n,
      },
    })
    expect(args).toEqual([
      "--port",
      "9001",
      "--fork-url",
      "https://sepolia.example.com",
      "--fork-block-number",
      "12345",
    ])
  })

  it("omits --fork-block-number when only the url is given", () => {
    const args = build_anvil_args({
      port: 9002,
      fork: { url: "https://example.com" },
    })
    expect(args).toEqual([
      "--port",
      "9002",
      "--fork-url",
      "https://example.com",
    ])
  })

  it("appends extraArgs verbatim", () => {
    const args = build_anvil_args({
      port: 9003,
      extraArgs: ["--silent", "--gas-limit", "30000000"],
    })
    expect(args).toEqual([
      "--port",
      "9003",
      "--silent",
      "--gas-limit",
      "30000000",
    ])
  })
})
