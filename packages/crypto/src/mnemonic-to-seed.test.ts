import { describe, expect, it } from "vitest"

import { mnemonic_to_seed } from "./mnemonic-to-seed"

const TEST_MNEMONIC =
  "smile price bomb movie minimum treat hurdle adult wing come space cross"

describe("mnemonic-to-seed.ts — mnemonic_to_seed", () => {
  it("produces a 64-byte seed for a valid BIP-39 mnemonic", () => {
    const seed = mnemonic_to_seed(TEST_MNEMONIC)
    expect(seed).toBeInstanceOf(Uint8Array)
    expect(seed.length).toBe(64)
  })

  it("throws on an invalid mnemonic", () => {
    expect(() =>
      mnemonic_to_seed("not a real bip39 phrase at all"),
    ).toThrow(/Invalid mnemonic/)
  })
})
