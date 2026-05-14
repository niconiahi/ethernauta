import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { chainIdSchema } from "./chain/chain-id"
import type { Http } from "./http"

export const WriteContextSchema = object({
  chain_id: chainIdSchema,
})
export type WriteContext = InferOutput<
  typeof WriteContextSchema
>

export type ResolvedWriter = [Http[], WriteContext]

export type Writable<T> = (
  _resolved: ResolvedWriter,
) => Promise<T>

export function create_writer(
  chains: Array<{ chainId: string; transports: Http[] }>,
): (_input: WriteContext) => ResolvedWriter {
  return (_input: WriteContext): ResolvedWriter => {
    const context = parse(WriteContextSchema, _input)
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

export type Writer = ReturnType<typeof create_writer>
