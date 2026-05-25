// https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
//
// BIP-32 root: take a 64-byte seed (typically the output of
// `mnemonic_to_seed`) and produce the extended master key
// from which every account in the wallet derives.

import { HDKey } from "@scure/bip32"

export function seed_to_master_key(
  seed: Uint8Array,
): HDKey {
  return HDKey.fromMasterSeed(seed)
}
