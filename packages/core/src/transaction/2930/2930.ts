import type { Input } from "valibot"
import { nullable, object, string } from "valibot"

import { addressSchema, bytesSchema, uintSchema } from "../../base"
import { accessListSchema } from "../../transaction"

export const transaction2930UnsignedSchema = object({
  type: string(),
  nonce: uintSchema,
  to: nullable(addressSchema),
  gas: uintSchema,
  value: uintSchema,
  input: bytesSchema,
  gasPrice: uintSchema,
  accessList: accessListSchema,
  chainId: uintSchema,
})
export type Transaction2930Unsigned = Input<typeof transaction2930UnsignedSchema>

export const transaction2930SignedSchema = object({
  type: string(),
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
export type Transaction2930Signed = Input<typeof transaction2930SignedSchema>
