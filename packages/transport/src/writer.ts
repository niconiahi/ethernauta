import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { chainIdSchema } from "./chain/chain-id"
import type { Http } from "./http"
import {
  type ChainEntry,
  require_chain,
} from "./require-chain"

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
  chains: ChainEntry[],
): (_input: WriteContext) => ResolvedWriter {
  return (_input: WriteContext): ResolvedWriter => {
    const context = parse(WriteContextSchema, _input)
    const transports = require_chain(
      chains,
      context.chain_id,
    )
    return [transports, context]
  }
}

export type Writer = ReturnType<typeof create_writer>
