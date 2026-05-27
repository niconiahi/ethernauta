// https://eips.ethereum.org/EIPS/eip-2930

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { nullable, object } from "valibot"
import { accessListSchema } from "./access-list"

export const transaction2930UnsignedSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  gasPrice: uintSchema,
  accessList: accessListSchema,
  chainId: uintSchema,
})
export type Transaction2930Unsigned = InferOutput<
  typeof transaction2930UnsignedSchema
>
