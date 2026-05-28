import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { ChainIdSchema } from "./chain/chain-id"
import type { Http } from "./http"
import {
  type ChainEntry,
  require_chain,
} from "./require-chain"

export const ReadContextSchema = object({
  chain_id: ChainIdSchema,
})
export type ReadContext = InferOutput<
  typeof ReadContextSchema
>

export type ResolvedReader = [Http[], ReadContext]

export type Readable<T> = (
  _resolved: ResolvedReader,
) => Promise<T>

export function create_reader(
  chains: ChainEntry[],
): (_input: ReadContext) => ResolvedReader {
  return (_input: ReadContext): ResolvedReader => {
    const context = parse(ReadContextSchema, _input)
    const transports = require_chain(
      chains,
      context.chain_id,
    )
    return [transports, context]
  }
}

export type Reader = ReturnType<typeof create_reader>
