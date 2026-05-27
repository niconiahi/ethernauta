// https://eips.ethereum.org/EIPS/eip-1559

import {
  addressSchema,
  byteSchema,
  bytesSchema,
  uintSchema,
} from "@ethernauta/core"
import { accessListSchema } from "@ethernauta/eip/2930"
import type { InferOutput } from "valibot"
import { nullable, object } from "valibot"

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
