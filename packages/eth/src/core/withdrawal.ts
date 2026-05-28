import {
  AddressSchema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object } from "valibot"

export const WithdrawalSchema = object({
  index: Uint64Schema,
  validatorIndex: Uint64Schema,
  address: AddressSchema,
  amount: Uint256Schema,
})
export type Withdrawal = InferOutput<
  typeof WithdrawalSchema
>
