// Personal-message (EIP-191) verification, three flavors:
//
//   verify_message_deployed
//     EIP-191 prefix + EIP-1271 `isValidSignature` on the address.
//     Assumes the signer is on-chain — EOA or already-deployed
//     contract account. Cheapest path: one `eth_call`.
//
//   verify_message_universal
//     EIP-191 prefix + EIP-6492 universal validator. Handles EOA,
//     deployed contract, and counterfactual (not-yet-deployed) smart
//     account in one simulated deploy. Strict superset of the
//     deployed path, at the cost of always doing the simulation.
//
//   verify_message
//     Router. Detects the EIP-6492 magic-bytes suffix on the
//     signature and dispatches to `verify_message_universal`;
//     otherwise to `verify_message_deployed`. Drop-in for callers
//     that do not need to commit to one path up-front.

import type { Hash32 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import { build_personal_message } from "@ethernauta/eip/191"
import { verify_hash as verify_hash_1271 } from "@ethernauta/eip/1271"
import {
  is_wrapped_signature,
  verify_hash as verify_hash_6492,
} from "@ethernauta/eip/6492"
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

export const verifyMessageParametersSchema = object({
  address: addressSchema,
  message: union([string(), instance(Uint8Array)]),
  signature: bytesSchema,
})
export type VerifyMessageParameters = InferOutput<
  typeof verifyMessageParametersSchema
>

function digest_of(
  message: VerifyMessageParameters["message"],
): Hash32 {
  const prefixed = build_personal_message(message)
  return bytes_to_hex(keccak_256(prefixed)) as Hash32
}

export function verify_message_deployed(
  _parameters: VerifyMessageParameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyMessageParametersSchema,
      _parameters,
    )
    return verify_hash_1271({
      address: parameters.address,
      hash: digest_of(parameters.message),
      signature: parameters.signature,
    })(resolved)
  }
}

export function verify_message_universal(
  _parameters: VerifyMessageParameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyMessageParametersSchema,
      _parameters,
    )
    return verify_hash_6492({
      address: parameters.address,
      hash: digest_of(parameters.message),
      signature: parameters.signature,
    })(resolved)
  }
}

export function verify_message(
  _parameters: VerifyMessageParameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyMessageParametersSchema,
      _parameters,
    )
    const verify = is_wrapped_signature(parameters.signature)
      ? verify_message_universal
      : verify_message_deployed
    return verify(parameters)(resolved)
  }
}
