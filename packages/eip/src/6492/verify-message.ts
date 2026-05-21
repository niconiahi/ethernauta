// https://eips.ethereum.org/EIPS/eip-6492

import type { Hash32 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
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

import { build_personal_message } from "../191/personal-message"
import { verify_hash } from "./verify-hash"

export const verifyMessageParametersSchema = object({
  address: addressSchema,
  message: union([string(), instance(Uint8Array)]),
  signature: bytesSchema,
})
export type VerifyMessageParameters = InferOutput<
  typeof verifyMessageParametersSchema
>

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
