import { build_personal_message } from "@ethernauta/eip/191"
import { keccak_256 } from "@noble/hashes/sha3"
import { sign_digest, signature_to_hex } from "./ecdsa"

export function personal_sign_message(
  message: string,
  private_key: Uint8Array,
): `0x${string}` {
  const digest = keccak_256(build_personal_message(message))
  const signature = sign_digest(digest, private_key)
  return signature_to_hex(signature)
}
