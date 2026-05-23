// EIP-712 typed-data verification, three flavors:
//
//   verify_typed_data_deployed
//     EIP-712 digest + EIP-1271 `isValidSignature` on the address.
//     Assumes the signer is on-chain — EOA or already-deployed
//     contract account.
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
} from "@ethernauta/core"
import { verify_hash as verify_hash_1271 } from "@ethernauta/eip/1271"
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
  return bytes_to_hex(hash_typed_data(typedData)) as Hash32
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
    return verify_hash_1271({
      address: parameters.address,
      hash: digest_of(parameters.typedData),
      signature: parameters.signature,
    })(resolved)
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
    const verify = is_wrapped_signature(parameters.signature)
      ? verify_typed_data_universal
      : verify_typed_data_deployed
    return verify(parameters)(resolved)
  }
}
