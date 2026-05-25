// EIP-712 typed-data signing: hash the structured data per
// the EIP-712 domain-separator rules, sign with the given
// private key, serialize to the 65-byte `r||s||v` wire form.

import type { Bytes65 } from "@ethernauta/core"
import {
  hash_typed_data,
  type TypedData,
} from "@ethernauta/eip/712"

import { sign_digest } from "./sign-digest"
import { signature_to_hex } from "./signature-to-hex"

export function sign_typed_data(
  typed_data: TypedData,
  private_key: Uint8Array,
): Bytes65 {
  const digest = hash_typed_data(typed_data)
  const signature = sign_digest(digest, private_key)
  return signature_to_hex(signature)
}
