// https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
//
// BIP-39 mnemonic → 64-byte seed. Validates the input
// against the English wordlist first, then runs the
// PBKDF2-HMAC-SHA512 derivation @scure/bip39 ships. Pair
// with `seed_to_master_key` to feed BIP-32 derivation.

import {
  mnemonicToSeedSync,
  validateMnemonic,
} from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english"

export function mnemonic_to_seed(
  mnemonic: string,
): Uint8Array {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error("Invalid mnemonic")
  }
  return mnemonicToSeedSync(mnemonic)
}
