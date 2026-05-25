// EIP-712 typed-data verification, three flavors:
//
//   verify_typed_data_deployed
//     EIP-712 digest + EOA-or-EIP-1271 dispatch. Detects whether the
//     target address has code: empty code → ECDSA recover, otherwise
//     `isValidSignature`.
//
//   verify_typed_data_universal
//     EIP-712 digest + EIP-6492 universal validator. Handles EOA,
//     deployed contract, and counterfactual smart account in one
//     simulated deploy.
//
//   verify_typed_data
//     Router. Branches on the EIP-6492 magic-bytes suffix.

import type { Hash32 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
  hash32Schema,
} from "@ethernauta/core"
import {
  hash_typed_data,
  typedDataSchema,
} from "@ethernauta/eip/712"
import {
  is_wrapped_signature,
  verify_hash as verify_hash_6492,
} from "@ethernauta/eip/6492"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { type InferOutput, object, parse } from "valibot"

import { verify_hash_deployed } from "./verify-hash-deployed"

export const verifyTypedDataParametersSchema = object({
  address: addressSchema,
  typedData: typedDataSchema,
  signature: bytesSchema,
})
export type VerifyTypedDataParameters = InferOutput<
  typeof verifyTypedDataParametersSchema
>

function digest_of(
  typedData: VerifyTypedDataParameters["typedData"],
): Hash32 {
  return parse(
    hash32Schema,
    bytes_to_hex(hash_typed_data(typedData)),
  )
}

export function verify_typed_data_deployed(
  _parameters: VerifyTypedDataParameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyTypedDataParametersSchema,
      _parameters,
    )
    return verify_hash_deployed(
      parameters.address,
      digest_of(parameters.typedData),
      parameters.signature,
      resolved,
    )
  }
}

export function verify_typed_data_universal(
  _parameters: VerifyTypedDataParameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyTypedDataParametersSchema,
      _parameters,
    )
    return verify_hash_6492({
      address: parameters.address,
      hash: digest_of(parameters.typedData),
      signature: parameters.signature,
    })(resolved)
  }
}

export function verify_typed_data(
  _parameters: VerifyTypedDataParameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyTypedDataParametersSchema,
      _parameters,
    )
    const verify = is_wrapped_signature(
      parameters.signature,
    )
      ? verify_typed_data_universal
      : verify_typed_data_deployed
    return verify(parameters)(resolved)
  }
}
