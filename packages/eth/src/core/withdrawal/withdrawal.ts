import type { Input } from "valibot"
import { object } from "valibot"

import { addressSchema, uint256Schema, uint64Schema } from "../base"

export const withdrawalSchema = object({
  index: uint64Schema,
  validatorIndex: uint64Schema,
  address: addressSchema,
  amount: uint256Schema,
})
export type Withdrawal = Input<typeof withdrawalSchema>
