import {
  type Address,
  addressSchema,
  type Bytes,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { type ChainId, chainIdSchema } from "./chain/chain-id"

export const ContractContextSchema = object({
  chain_id: chainIdSchema,
  to: addressSchema,
})
export type ContractContext = InferOutput<
  typeof ContractContextSchema
>

export function contract(
  _input: ContractContext,
): ContractContext {
  return parse(ContractContextSchema, _input)
}

export type Callable<T> = {
  chain_id: ChainId
  to: Address
  data: Bytes
  decode: (result: Bytes) => T
}
