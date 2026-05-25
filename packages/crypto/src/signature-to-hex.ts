// Canonical 65-byte wire form for an Ethereum off-chain
// signature: `r (32) || s (32) || v (1)`, where
// `v = 27 + recovery`. Used by:
//
//   - EIP-191  (`personal_sign`, prefixed messages)
//   - EIP-712  (`eth_signTypedData_v4`, typed structured data)
//   - Pre-EIP-155 legacy transactions
//   - Any contract calling `ecrecover(hash, signature)` via
//     OpenZeppelin ECDSA.recover (expects `bytes` of length 65)
//
// NOT used by:
//   - EIP-1559 / EIP-2930 / EIP-4844 transactions, which pack
//     `y_parity` (0 or 1) directly into RLP fields
//   - EIP-155 legacy transactions, which use
//     `v = 35 + 2*chainId + recovery` inside RLP
//   - EIP-2098, which steals the parity bit into the top of `s`
//     and emits a 64-byte form instead

import {
  type Bytes65,
  bytes65Schema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import type { RecoveredSignature } from "@noble/secp256k1"
import { parse } from "valibot"

export function signature_to_hex(
  signature: RecoveredSignature,
): Bytes65 {
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
  return parse(bytes65Schema, bytes_to_hex(out))
}
