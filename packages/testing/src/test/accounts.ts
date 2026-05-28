// Pre-funded account helpers. Anvil starts with 10 accounts
// derived from its mnemonic (defaulting to the well-known
// `"test test test test test test test test test test test
// junk"` phrase); these helpers materialise the same
// derivation in-process so the consumer can address accounts
// by index without reading anvil's stdout. The plugin's setup
// file records the mnemonic in use via `set_mnemonic`; the
// helpers read it here.

import { AddressSchema } from "@ethernauta/core"
import {
  derive_private_key,
  type HDKey,
  mnemonic_to_seed,
  private_key_to_address,
  seed_to_master_key,
} from "@ethernauta/crypto"
import type { InferOutput } from "valibot"
import { instance, object, parse } from "valibot"

import { get_mnemonic } from "./endpoint-store"

export const AnvilAccountSchema = object({
  address: AddressSchema,
  private_key: instance(Uint8Array),
})
export type AnvilAccount = InferOutput<
  typeof AnvilAccountSchema
>

// Anvil pre-funds 10 accounts by default; the consumer can
// override via `accounts: N` at plugin construction. The
// derivation is independent of how many anvil pre-funded —
// the helper materialises whatever count the caller asks for
// (capped at the canonical 10 unless the consumer needs more).
const DEFAULT_ACCOUNT_COUNT = 10

export function anvil_account(index: number): AnvilAccount {
  const mnemonic = get_mnemonic()
  const seed = mnemonic_to_seed(mnemonic)
  const master = seed_to_master_key(seed)
  return derive_at(master, index)
}

export function anvil_accounts(
  count: number = DEFAULT_ACCOUNT_COUNT,
): AnvilAccount[] {
  const mnemonic = get_mnemonic()
  const seed = mnemonic_to_seed(mnemonic)
  const master = seed_to_master_key(seed)
  const out: AnvilAccount[] = []
  for (let i = 0; i < count; i += 1) {
    out.push(derive_at(master, i))
  }
  return out
}

function derive_at(
  master: HDKey,
  index: number,
): AnvilAccount {
  const private_key = parse(
    instance(Uint8Array),
    derive_private_key(master, `m/44'/60'/0'/0/${index}`),
  )
  const address = private_key_to_address(private_key)
  return { address, private_key }
}
