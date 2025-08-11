import type { InferOutput } from "valibot"
import { array, nullable, object, optional } from "valibot"

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "../base"
import { accessListSchema } from "./access-list"
import { authorizationListSchema } from "./authorization-list"

const transaction7702UnsignedSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: addressSchema,
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  gasPrice: optional(uintSchema),
  accessList: accessListSchema,
  chainId: uintSchema,
  // authorizationList: authorizationListSchema,
})
export type Transaction7702Unsigned = InferOutput<
  typeof transaction7702UnsignedSchema
>

export const transaction7702SignedSchema = object({
  ...transaction7702UnsignedSchema.entries,
  yParity: uintSchema,
  v: optional(byteSchema),
  r: uintSchema,
  s: uintSchema,
})
export type Transaction7702Signed = InferOutput<
  typeof transaction7702SignedSchema
>
