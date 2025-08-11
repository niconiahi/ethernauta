import type { InferOutput } from "valibot"
import { nullable, object } from "valibot"

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "../base"
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

export const transaction2930SignedSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  gasPrice: uintSchema,
  accessList: accessListSchema,
  chainId: uintSchema,
  yParity: uintSchema,
  r: uintSchema,
  s: uintSchema,
})
export type Transaction2930Signed = InferOutput<
  typeof transaction2930SignedSchema
>
