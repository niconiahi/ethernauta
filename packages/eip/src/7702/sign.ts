// https://eips.ethereum.org/EIPS/eip-7702
//
// Pure signing helpers. Each takes a private key, produces a
// fully-formed protocol artifact (signed authorization tuple
// or RLP-encoded signed type-4 tx), and is free of any wallet
// or UI concerns — drop them straight into a wallet view, a
// CLI signer, or a test harness.

import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha2"
import { keccak_256 } from "@noble/hashes/sha3"
import {
  etc,
  type RecoveredSignature,
  sign,
} from "@noble/secp256k1"
import {
  type AuthorizationParameter,
  type AuthorizationSigned,
  hash_authorization,
} from "./authorization"
import {
  encode_set_code_signed,
  encode_set_code_unsigned,
  type SetCodeTransactionSigned,
  type SetCodeTransactionUnsigned,
} from "./transaction"

function big_to_hex(value: bigint): `0x${string}` {
  return `0x${value.toString(16)}`
}

function sign_digest(
  digest: Uint8Array,
  private_key: Uint8Array,
): RecoveredSignature {
  // @noble/secp256k1 needs a deterministic HMAC-SHA256
  // (RFC 6979) to derive `k`. Wired once per call.
  etc.hmacSha256Sync = (k, ...m) =>
    hmac(sha256, k, etc.concatBytes(...m))
  return sign(digest, private_key)
}

/**
 * Sign a single EIP-7702 authorization tuple. The signed
 * tuple is what goes into the `authorization_list` of a
 * type-4 transaction.
 *
 * Per spec, `y_parity`, `r`, `s` are raw 0/1 + scalars — no
 * 27 offset, no EIP-155 chain-id baking. RLP encoding takes
 * the BigInt of each.
 */
export function sign_authorization(
  auth: AuthorizationParameter,
  private_key: Uint8Array,
): AuthorizationSigned {
  const digest = hash_authorization(auth)
  const signature = sign_digest(digest, private_key)
  return {
    chainId: auth.chainId,
    address: auth.address,
    nonce: auth.nonce,
    yParity: big_to_hex(BigInt(signature.recovery)),
    r: big_to_hex(signature.r),
    s: big_to_hex(signature.s),
  }
}

/**
 * Sign a type-4 (SetCode) transaction. Composes the existing
 * unsigned-encode → keccak → ECDSA → signed-encode chain
 * into a single call. Returns the type-prefixed raw bytes
 * ready to hand to `eth_sendRawTransaction`.
 *
 * The caller is responsible for pre-signing every entry in
 * `unsigned.authorizationList` via `sign_authorization`
 * before invoking this — the outer signature commits to the
 * already-signed inner tuples.
 */
export function sign_set_code_transaction(
  unsigned: SetCodeTransactionUnsigned,
  private_key: Uint8Array,
): Uint8Array {
  const digest = keccak_256(
    encode_set_code_unsigned(unsigned),
  )
  const signature = sign_digest(digest, private_key)
  const signed: SetCodeTransactionSigned = {
    ...unsigned,
    yParity: BigInt(signature.recovery),
    r: signature.r,
    s: signature.s,
  }
  return encode_set_code_signed(signed)
}
