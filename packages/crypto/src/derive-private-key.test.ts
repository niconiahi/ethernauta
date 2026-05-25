import { bytes_to_hex } from "@ethernauta/utils"
import { describe, expect, it } from "vitest"

import { derive_private_key } from "./derive-private-key"
import { mnemonic_to_seed } from "./mnemonic-to-seed"
import { seed_to_master_key } from "./seed-to-master-key"

const TEST_MNEMONIC =
  "smile price bomb movie minimum treat hurdle adult wing come space cross"

describe("derive-private-key.ts — derive_private_key", () => {
  it("derives the canonical m/44'/60'/0'/0/0 private key from the test mnemonic", () => {
    const master = seed_to_master_key(
      mnemonic_to_seed(TEST_MNEMONIC),
    )
    const private_key = derive_private_key(master)
    expect(bytes_to_hex(private_key)).toBe(
      "0x708305be9b138ce8c68cbbf3a577aff1fbf44374d91784ead911d40e9c6b9c4c",
    )
  })

  it("supports an explicit derivation path", () => {
    const master = seed_to_master_key(
      mnemonic_to_seed(TEST_MNEMONIC),
    )
    const account_0 = derive_private_key(
      master,
      "m/44'/60'/0'/0/0",
    )
    const account_1 = derive_private_key(
      master,
      "m/44'/60'/0'/0/1",
    )
    expect(bytes_to_hex(account_0)).not.toBe(
      bytes_to_hex(account_1),
    )
  })
})
