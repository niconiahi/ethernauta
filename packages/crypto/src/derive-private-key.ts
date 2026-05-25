// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
//
// BIP-44 derivation along the canonical Ethereum path
// `m/44'/60'/0'/0/<index>`. The default targets the first
// account (`/0`); pass a different path for additional
// accounts or for non-Ethereum coin types.

import type { HDKey } from "@scure/bip32"

const DEFAULT_PATH = "m/44'/60'/0'/0/0"

export function derive_private_key(
  master: HDKey,
  path: string = DEFAULT_PATH,
): Uint8Array {
  const child = master.derive(path)
  if (!child.privateKey) {
    throw new Error("No private key available")
  }
  return child.privateKey
}
