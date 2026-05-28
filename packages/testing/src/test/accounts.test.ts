import { afterEach, describe, expect, it } from "vitest"

import {
  anvil_account,
  anvil_accounts,
} from "./accounts"
import {
  clear_mnemonic,
  DEFAULT_ANVIL_MNEMONIC,
  set_mnemonic,
} from "./endpoint-store"

// Anvil's first 10 default-mnemonic addresses, verified against
// a running anvil's `eth_accounts` output. These are the
// well-known fixtures every foundry / hardhat / ganache user
// has seen — if the derivation drifts, this catches it.
const ANVIL_DEFAULT_ADDRESSES = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cfFFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
] as const

describe("anvil_account / anvil_accounts", () => {
  afterEach(() => {
    clear_mnemonic()
  })

  it("derives the canonical 10 anvil addresses from the default mnemonic", () => {
    set_mnemonic(DEFAULT_ANVIL_MNEMONIC)
    const accounts = anvil_accounts()
    expect(accounts).toHaveLength(10)
    for (let i = 0; i < accounts.length; i += 1) {
      expect(accounts[i]?.address.toLowerCase()).toBe(
        ANVIL_DEFAULT_ADDRESSES[i]?.toLowerCase(),
      )
    }
  })

  it("anvil_account(0) returns account #0 — the canonical 'rich' address", () => {
    set_mnemonic(DEFAULT_ANVIL_MNEMONIC)
    const account = anvil_account(0)
    expect(account.address.toLowerCase()).toBe(
      ANVIL_DEFAULT_ADDRESSES[0]?.toLowerCase(),
    )
    expect(account.privateKey.length).toBe(32)
  })

  it("anvil_account(5) returns the 6th derived account", () => {
    set_mnemonic(DEFAULT_ANVIL_MNEMONIC)
    const account = anvil_account(5)
    expect(account.address.toLowerCase()).toBe(
      ANVIL_DEFAULT_ADDRESSES[5]?.toLowerCase(),
    )
  })

  it("uses a custom mnemonic when one is set", () => {
    const custom =
      "test test test test test test test test test test test ball"
    set_mnemonic(custom)
    const account = anvil_account(0)
    // Custom mnemonic must not collide with the default's
    // first-account address (proves the helper actually
    // reads the mnemonic from shared state).
    expect(account.address.toLowerCase()).not.toBe(
      ANVIL_DEFAULT_ADDRESSES[0]?.toLowerCase(),
    )
  })

  it("throws the no-plugin error when called before set_mnemonic", () => {
    expect(() => anvil_account(0)).toThrow()
  })

  it("anvil_accounts(count) honours the count argument", () => {
    set_mnemonic(DEFAULT_ANVIL_MNEMONIC)
    expect(anvil_accounts(3)).toHaveLength(3)
    expect(anvil_accounts(20)).toHaveLength(20)
  })
})
