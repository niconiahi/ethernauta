import { hash_typed_data, type TypedData } from "@ethernauta/eip/712"

import { sign_digest, signature_to_hex } from "./ecdsa"

export function sign_typed_data(
  typed_data: TypedData,
  private_key: Uint8Array,
): `0x${string}` {
  const digest = hash_typed_data(typed_data)
  const signature = sign_digest(digest, private_key)
  return signature_to_hex(signature)
}
