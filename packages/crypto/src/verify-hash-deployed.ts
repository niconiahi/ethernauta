// Shared "verify a digest for a deployed signer" helper used by both
// verify_message_deployed and verify_typed_data_deployed.
//
// Decision: branches on `eth_getCode` at the target address.
//   - empty code (`0x`) → EOA — `ecrecover(hash, sig) == address`
//   - non-empty code   → contract — EIP-1271 `isValidSignature`
//
// Both branches return `false` on failure (parse error, revert, network
// error) rather than throwing — matches the "anything that isn't a
// match is false" semantics callers expect from a verifier.

import {
  type Address,
  type Bytes,
  bytesSchema,
  type Hash32,
} from "@ethernauta/core"
import { verify_hash } from "@ethernauta/eip/1271"
import { eth_getCode } from "@ethernauta/eth"
import type { ResolvedReader } from "@ethernauta/transport"
import { parse, safeParse } from "valibot"

import {
  recover_address,
  recoverSignatureSchema,
} from "./recover"

const EMPTY_BYTES = parse(bytesSchema, "0x")

export async function verify_hash_deployed(
  address: Address,
  hash: Hash32,
  signature: Bytes,
  resolved: ResolvedReader,
): Promise<boolean> {
  let code: Bytes
  try {
    code = await eth_getCode({ address })(resolved)
  } catch {
    return false
  }
  if (code === EMPTY_BYTES) {
    const eoa_sig = safeParse(
      recoverSignatureSchema,
      signature,
    )
    if (!eoa_sig.success) return false
    try {
      const recovered = recover_address(hash, eoa_sig.output)
      return (
        recovered.toLowerCase() === address.toLowerCase()
      )
    } catch {
      return false
    }
  }
  return verify_hash({ address, hash, signature })(resolved)
}
