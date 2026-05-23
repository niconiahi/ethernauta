// EIP-191 message verify with EIP-1271 contract-signature fallback.
// Builds the personal-message prefix from EIP-191 and delegates to the
// EIP-1271 `isValidSignature(bytes32, bytes)` call.

import type { Hash32 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import { build_personal_message } from "@ethernauta/eip/191"
import { verify_hash } from "@ethernauta/eip/1271"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import {
  type InferOutput,
  instance,
  object,
  parse,
  string,
  union,
} from "valibot"

export const verifyMessage1271ParametersSchema = object({
  address: addressSchema,
  message: union([string(), instance(Uint8Array)]),
  signature: bytesSchema,
})
export type VerifyMessage1271Parameters = InferOutput<
  typeof verifyMessage1271ParametersSchema
>

export function verify_message_1271(
  _parameters: VerifyMessage1271Parameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyMessage1271ParametersSchema,
      _parameters,
    )
    const prefixed = build_personal_message(
      parameters.message,
    )
    const hash = bytes_to_hex(
      keccak_256(prefixed),
    ) as Hash32
    return verify_hash({
      address: parameters.address,
      hash,
      signature: parameters.signature,
    })(resolved)
  }
}
