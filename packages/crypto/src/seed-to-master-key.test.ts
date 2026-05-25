import { describe, expect, it } from "vitest"

import { mnemonic_to_seed } from "./mnemonic-to-seed"
import { seed_to_master_key } from "./seed-to-master-key"

const TEST_MNEMONIC =
  "smile price bomb movie minimum treat hurdle adult wing come space cross"

describe("seed-to-master-key.ts — seed_to_master_key", () => {
  it("returns an HDKey carrying a private key and chain code", () => {
    const seed = mnemonic_to_seed(TEST_MNEMONIC)
    const master = seed_to_master_key(seed)
    expect(master.privateKey).toBeInstanceOf(Uint8Array)
    expect(master.chainCode).toBeInstanceOf(Uint8Array)
  })
})
