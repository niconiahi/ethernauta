// EIP-191 `personal_sign` over a UTF-8 message:
//   keccak256( "\x19Ethereum Signed Message:\n" || len || message )
// signed with the given private key and serialized to the
// 65-byte `r||s||v` wire form. Counterpart of `recover_address`
// for the same digest.

import type { Bytes65 } from "@ethernauta/core"
import { build_personal_message } from "@ethernauta/eip/191"
import { keccak_256 } from "@noble/hashes/sha3"

import { sign_digest } from "./sign-digest"
import { signature_to_hex } from "./signature-to-hex"

export function personal_sign_message(
  message: string,
  private_key: Uint8Array,
): Bytes65 {
  const digest = keccak_256(build_personal_message(message))
  const signature = sign_digest(digest, private_key)
  return signature_to_hex(signature)
}
