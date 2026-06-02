import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import { ChainIdSchema } from "./chain/chain-id"
import {
  type ChainEntry,
  create_dispatcher,
  type Reader,
  require_chain,
} from "./reader"

export const WriteContextSchema = object({
  chain_id: ChainIdSchema,
})
export type WriteContext = InferOutput<
  typeof WriteContextSchema
>

export type ResolvedWriter = [Reader, WriteContext]

export type Writable<T> = (
  _resolved: ResolvedWriter,
) => Promise<T>

export function create_writer(
  chains: ChainEntry[],
): (_input: WriteContext) => ResolvedWriter {
  return (_input: WriteContext): ResolvedWriter => {
    const context = parse(WriteContextSchema, _input)
    const { transports, strategy } = require_chain(
      chains,
      context.chain_id,
    )
    return [
      create_dispatcher(transports, strategy),
      context,
    ]
  }
}

export type Writer = ReturnType<typeof create_writer>
