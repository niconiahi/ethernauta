// EIP-191 message verify with EIP-6492 counterfactual / wrapped-sig support.
// Builds the personal-message prefix from EIP-191 and delegates to the
// EIP-6492 universal verifier (which handles deployed EOA, deployed contract,
// and not-yet-deployed contract paths).

import type { Hash32 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import { build_personal_message } from "@ethernauta/eip/191"
import { verify_hash } from "@ethernauta/eip/6492"
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

export const verifyMessage6492ParametersSchema = object({
  address: addressSchema,
  message: union([string(), instance(Uint8Array)]),
  signature: bytesSchema,
})
export type VerifyMessage6492Parameters = InferOutput<
  typeof verifyMessage6492ParametersSchema
>

export function verify_message_6492(
  _parameters: VerifyMessage6492Parameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyMessage6492ParametersSchema,
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
