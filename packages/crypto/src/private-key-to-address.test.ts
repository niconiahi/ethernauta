import { describe, expect, it } from "vitest"

import { derive_private_key } from "./derive-private-key"
import { mnemonic_to_seed } from "./mnemonic-to-seed"
import { private_key_to_address } from "./private-key-to-address"
import { seed_to_master_key } from "./seed-to-master-key"

const TEST_MNEMONIC =
  "smile price bomb movie minimum treat hurdle adult wing come space cross"

describe("private-key-to-address.ts — private_key_to_address", () => {
  it("derives the canonical address for the test mnemonic's account 0", () => {
    const master = seed_to_master_key(
      mnemonic_to_seed(TEST_MNEMONIC),
    )
    const private_key = derive_private_key(master)
    const address = private_key_to_address(private_key)
    expect(address.toLowerCase()).toBe(
      "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
    )
  })
})
