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
import { type InferOutput, object, parse } from "valibot"

import { hash_typed_data } from "../712/hash"
import { typedDataSchema } from "../712/typed-data"
import { verify_hash } from "./verify-hash"

export const verifyTypedDataParametersSchema = object({
  address: addressSchema,
  typedData: typedDataSchema,
  signature: bytesSchema,
})
export type VerifyTypedDataParameters = InferOutput<
  typeof verifyTypedDataParametersSchema
>

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
