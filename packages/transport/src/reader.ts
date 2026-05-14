import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"

import { addressSchema } from "./chain/address"
import { chainIdSchema } from "./chain/chain-id"
import type { Http } from "./http"

export const ReadContextSchema = object({
  chain_id: chainIdSchema,
  to: optional(addressSchema),
})
export type ReadContext = InferOutput<
  typeof ReadContextSchema
>

export type ResolvedReader = [Http[], ReadContext]

export type Readable<T> = (
  _resolved: ResolvedReader,
) => Promise<T>

export function create_reader(
  chains: Array<{ chainId: string; transports: Http[] }>,
): (_input: ReadContext) => ResolvedReader {
  return (_input: ReadContext): ResolvedReader => {
    const context = parse(ReadContextSchema, _input)
    const chain = chains.find(
      ({ chainId }) => chainId === context.chain_id,
    )
    if (!chain) {
      throw new Error(
        "you need at least one transport for the targeted chain",
      )
    }
    return [chain.transports, context]
  }
}

export type Reader = ReturnType<typeof create_reader>
