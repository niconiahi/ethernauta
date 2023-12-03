import { Address, Uint256, Uint64, addressSchema, uint256Schema, uint64Schema } from "../base";
import { Input, object } from "valibot";

export const withdrawalSchema = object({
  index: uint64Schema,
  validatorIndex: uint64Schema,
  address: addressSchema,
  amount: uint256Schema
})
export type Withdrawal = Input<typeof withdrawalSchema>
