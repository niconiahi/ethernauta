import {
  mnemonicToSeedSync,
  validateMnemonic,
} from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english"
import { HDKey } from "@scure/bip32"
import { keccak_256 } from "@noble/hashes/sha3"
import { getPublicKey } from "@noble/secp256k1"

export function mnemonic_to_seed(mnemonic: string) {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error("Invalid mnemonic")
  }
  return mnemonicToSeedSync(mnemonic)
}

export function seed_to_master_key(seed: Uint8Array) {
  return HDKey.fromMasterSeed(seed)
}

export function derive_private_key(
  masterKey: HDKey,
  path = "m/44'/60'/0'/0/0",
) {
  const child = masterKey.derive(path)
  if (!child.privateKey)
    throw new Error("No private key available")
  return child.privateKey
}

export function private_key_to_address(
  privateKey: Uint8Array,
) {
  const publicKey = getPublicKey(privateKey, false)
  const hash = keccak_256(publicKey.slice(1))
  return `0x${to_hex(hash.slice(-20))}`
}

export function to_hex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
