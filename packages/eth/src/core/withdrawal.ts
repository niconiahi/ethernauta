import type { InferOutput } from "valibot"
import { object } from "valibot"

import {
  addressSchema,
  uint64Schema,
  uint256Schema,
} from "@ethernauta/core"

export const withdrawalSchema = object({
  index: uint64Schema,
  validatorIndex: uint64Schema,
  address: addressSchema,
  amount: uint256Schema,
})
export type Withdrawal = InferOutput<
  typeof withdrawalSchema
>
