import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { addressSchema } from "./chain/address"
import { chainIdSchema } from "./chain/chain-id"
import type { Http } from "./http"
import {
  type ChainEntry,
  require_chain,
} from "./require-chain"

export const ContractContextSchema = object({
  chain_id: chainIdSchema,
  to: addressSchema,
})
export type ContractContext = InferOutput<
  typeof ContractContextSchema
>

export type ResolvedContract = [Http[], ContractContext]

export type Callable<T> = (
  _resolved: ResolvedContract,
) => Promise<T>

export function create_contract(
  chains: ChainEntry[],
): (_input: ContractContext) => ResolvedContract {
  return (_input: ContractContext): ResolvedContract => {
    const context = parse(ContractContextSchema, _input)
    const transports = require_chain(
      chains,
      context.chain_id,
    )
    return [transports, context]
  }
}

export type Contract = ReturnType<typeof create_contract>
