import { it, expect } from "vitest"
import {
  mnemonic_to_seed as mnemonics_to_seed,
  seed_to_master_key,
  derive_private_key,
  private_key_to_address,
  to_hex,
} from "./crypto"

const MNEMONICS =
  "smile price bomb movie minimum treat hurdle adult wing come space cross"

it("should convert the mnemonics into a valid seed", () => {
  const seed = mnemonics_to_seed(MNEMONICS)
  expect(seed).toBeInstanceOf(Uint8Array)
  expect(seed.length).toBe(64)
})

it("should derive the master key from the seed", () => {
  const seed = mnemonics_to_seed(MNEMONICS)
  const master_key = seed_to_master_key(seed)
  expect(master_key.privateKey).toBeInstanceOf(Uint8Array)
  expect(master_key.chainCode).toBeInstanceOf(Uint8Array)
})

it("should derive the private key from master key", () => {
  const seed = mnemonics_to_seed(MNEMONICS)
  const master_key = seed_to_master_key(seed)
  const private_key = derive_private_key(master_key)
  const expected_private_key =
    "708305be9b138ce8c68cbbf3a577aff1fbf44374d91784ead911d40e9c6b9c4c"
  expect(to_hex(private_key)).toBe(expected_private_key)
})

it("should derive the public address from private key", () => {
  const seed = mnemonics_to_seed(MNEMONICS)
  const master_key = seed_to_master_key(seed)
  const private_key = derive_private_key(master_key)
  const address = private_key_to_address(private_key)
  const expected_address =
    "0x636C0fCd6DA2207aBfA80427b556695A4ad0AF94"
  expect(address.toLowerCase()).toBe(
    expected_address.toLowerCase(),
  )
})
