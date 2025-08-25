import type { InferOutput } from "valibot"
import { nullable, object } from "valibot"

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "../base"
import { accessListSchema } from "./access-list"

export const transaction1559UnsignedSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  gasPrice: uintSchema,
  accessList: accessListSchema,
  chainId: uintSchema,
})
export type Transaction1559Unsigned = InferOutput<
  typeof transaction1559UnsignedSchema
>

export const transaction1559SignedSchema = object({
  type: byteSchema,
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  maxPriorityFeePerGas: uintSchema,
  maxFeePerGas: uintSchema,
  gasPrice: uintSchema,
  accessList: accessListSchema,
  chainId: uintSchema,
  yParity: uintSchema,
  r: uintSchema,
  s: uintSchema,
})
export type Transaction1559Signed = InferOutput<
  typeof transaction1559SignedSchema
>
