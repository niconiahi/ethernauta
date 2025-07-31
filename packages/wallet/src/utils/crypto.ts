import {
  mnemonicToSeedSync,
  validateMnemonic,
} from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english"
import { HDKey } from "@scure/bip32"
import { keccak_256 } from "@noble/hashes/sha3"
import { getPublicKey } from "@noble/secp256k1"
import invariant from "./tiny-invariant"

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
  private_key: Uint8Array,
) {
  const publicKey = getPublicKey(private_key, false)
  const hash = keccak_256(publicKey.slice(1))
  return `0x${to_hex(hash.slice(-20))}` satisfies `0x${string}`
}

export function to_hex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function get_public_key(key: HDKey) {
  const private_key = key.privateKey
  invariant(private_key, "a private key should exist")
  return private_key
}

export function get_private_key(key: HDKey) {
  const private_key = key.privateKey
  invariant(private_key, "a private key should exist")
  return private_key
}

export function big_to_hex(number: bigint): `0x${string}` {
  return `0x${number.toString(16)}` satisfies `0x${string}`
}
export function hex_to_big(hex: `0x${string}`): bigint {
  return BigInt(hex)
}

export function number_to_hex(
  number: number,
): `0x${string}` {
  return `0x${number.toString(16)}` satisfies `0x${string}`
}
export function hex_to_number(hex: `0x${string}`): number {
  return Number(hex)
}
