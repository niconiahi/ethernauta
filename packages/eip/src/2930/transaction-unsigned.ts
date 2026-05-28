// https://eips.ethereum.org/EIPS/eip-2930

import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { nullable, object } from "valibot"
import { AccessListSchema } from "./access-list"

export const Transaction2930UnsignedSchema = object({
  type: ByteSchema,
  nonce: UintSchema,
  to: nullable(AddressSchema),
  gas: UintSchema,
  value: UintSchema,
  input: BytesSchema,
  gasPrice: UintSchema,
  accessList: AccessListSchema,
  chainId: UintSchema,
})
export type Transaction2930Unsigned = InferOutput<
  typeof Transaction2930UnsignedSchema
>
