// Pure ECDSA signing over secp256k1: takes a 32-byte
// digest and a private key, returns {r, s, recovery}.
//
// The digest construction is EIP-specific (EIP-191 prefix,
// EIP-712 typed-data hash, RLP transaction hash, …) and
// lives wherever the spec lives. This function only does
// the signing step.
//
// @noble/secp256k1 needs an HMAC-SHA256 (RFC 6979) wired
// before `sign` runs. We attach it once per call rather
// than relying on module-level mutation, so importing this
// helper has no side effects.

import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha2"
import {
  etc,
  type RecoveredSignature,
  sign,
} from "@noble/secp256k1"

export function sign_digest(
  digest: Uint8Array,
  private_key: Uint8Array,
): RecoveredSignature {
  etc.hmacSha256Sync = (k, ...m) =>
    hmac(sha256, k, etc.concatBytes(...m))
  return sign(digest, private_key)
}
