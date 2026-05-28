// https://eips.ethereum.org/EIPS/eip-1559

import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { AccessListSchema } from "@ethernauta/eip/2930"
import type { InferOutput } from "valibot"
import { nullable, object } from "valibot"

export const Transaction1559SignedSchema = object({
  type: ByteSchema,
  nonce: UintSchema,
  to: nullable(AddressSchema),
  gas: UintSchema,
  value: UintSchema,
  input: BytesSchema,
  maxPriorityFeePerGas: UintSchema,
  maxFeePerGas: UintSchema,
  gasPrice: UintSchema,
  accessList: AccessListSchema,
  chainId: UintSchema,
  yParity: UintSchema,
  r: UintSchema,
  s: UintSchema,
})
export type Transaction1559Signed = InferOutput<
  typeof Transaction1559SignedSchema
>
