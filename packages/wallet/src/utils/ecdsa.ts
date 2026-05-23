// ECDSA primitives over secp256k1, plus the canonical 65-byte
// hex serialization shared by every Ethereum off-chain signature.
//
// `sign_digest` is the pure crypto step — sign a 32-byte digest
// with a private key, return {r, s, recovery}. Has no Ethereum
// opinions; the *digest construction* is the EIP-specific part
// and lives wherever the spec lives (eip/712, eip/191, tx
// signing in this package, etc.).
//
// `signature_to_hex` is the 65-byte wire format:
//   r (32 bytes) || s (32 bytes) || v (1 byte), where v = 27 + recovery
//
// Where the 65-byte form is the on-wire signature shape:
//   - EIP-191  (`personal_sign`, prefixed messages)
//   - EIP-712  (`eth_signTypedData_v4`, typed structured data)
//   - Legacy   (pre-EIP-155 transactions, before chainId was
//              baked into v)
//   - Any contract that calls `ecrecover(hash, signature)` via
//              OpenZeppelin ECDSA.recover or a hand-rolled
//              equivalent expecting `bytes` of length 65.
//
// Where it is NOT used:
//   - EIP-1559 / EIP-2930 / EIP-4844 transactions sign the same
//     way (sign_digest over an RLP-encoded digest), but pack
//     `y_parity = recovery` (0 or 1) directly into RLP fields
//     rather than a v offset by 27.
//   - EIP-155 legacy txs use `v = 35 + 2*chainId + recovery` and
//     also live inside RLP fields, not a flat 65-byte string.
//   - EIP-2098 defines a *compact* 64-byte alternative by
//     stealing the parity bit into the top of `s`. Not produced
//     by this function.

import { bytes_to_hex } from "@ethernauta/utils"
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
  // @noble/secp256k1 needs a deterministic HMAC-SHA256 (RFC 6979)
  // to derive `k`. We wire it once per call — cheap and avoids a
  // module-level mutation.
  etc.hmacSha256Sync = (k, ...m) =>
    hmac(sha256, k, etc.concatBytes(...m))
  return sign(digest, private_key)
}

export function signature_to_hex(
  signature: RecoveredSignature,
): `0x${string}` {
  const out = new Uint8Array(65)
  const r = signature.r.toString(16).padStart(64, "0")
  const s = signature.s.toString(16).padStart(64, "0")
  for (let i = 0; i < 32; i++) {
    out[i] = Number.parseInt(r.slice(i * 2, i * 2 + 2), 16)
    out[32 + i] = Number.parseInt(
      s.slice(i * 2, i * 2 + 2),
      16,
    )
  }
  out[64] = 27 + signature.recovery
  return bytes_to_hex(out)
}
