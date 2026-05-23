// EIP-712 typed-data verify with EIP-6492 counterfactual / wrapped-sig support.

import type { Hash32 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import {
  hash_typed_data,
  typedDataSchema,
} from "@ethernauta/eip/712"
import { verify_hash } from "@ethernauta/eip/6492"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { type InferOutput, object, parse } from "valibot"

export const verifyTypedData6492ParametersSchema = object({
  address: addressSchema,
  typedData: typedDataSchema,
  signature: bytesSchema,
})
export type VerifyTypedData6492Parameters = InferOutput<
  typeof verifyTypedData6492ParametersSchema
>

export function verify_typed_data_6492(
  _parameters: VerifyTypedData6492Parameters,
): Readable<boolean> {
  return async (
    resolved: ResolvedReader,
  ): Promise<boolean> => {
    const parameters = parse(
      verifyTypedData6492ParametersSchema,
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
