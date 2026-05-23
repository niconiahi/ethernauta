// EIP-712 typed-data verify with EIP-1271 contract-signature fallback.
// Computes the digest via the existing EIP-712 hasher and delegates to
// EIP-1271 `isValidSignature(bytes32, bytes)`.

import type { Hash32 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import {
  hash_typed_data,
  typedDataSchema,
} from "@ethernauta/eip/712"
import { verify_hash } from "@ethernauta/eip/1271"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { type InferOutput, object, parse } from "valibot"

export const verifyTypedData1271ParametersSchema = object({
  address: addressSchema,
  typedData: typedDataSchema,
  signature: bytesSchema,
})
export type VerifyTypedData1271Parameters = InferOutput<
  typeof verifyTypedData1271ParametersSchema
>

export function verify_typed_data_1271(
  _parameters: VerifyTypedData1271Parameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyTypedData1271ParametersSchema,
      _parameters,
    )
    const hash = bytes_to_hex(
      hash_typed_data(parameters.typedData),
    ) as Hash32
    return verify_hash({
      address: parameters.address,
      hash,
      signature: parameters.signature,
    })(resolved)
  }
}
