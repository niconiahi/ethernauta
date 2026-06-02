import {
  array,
  custom,
  type InferOutput,
  literal,
  object,
  optional,
  parse,
  string,
  union,
} from "valibot"

import type { Call } from "./call"
import { ChainIdSchema } from "./chain/chain-id"
import type { Http } from "./http"
import type { Response } from "./json-rpc"

export const ReaderStrategySchema = object({
  type: union([literal("parallel"), literal("sequential")]),
})
export type ReaderStrategy = InferOutput<
  typeof ReaderStrategySchema
>

export type Reader = (_call: Call) => Promise<Response>

export const DEFAULT_STRATEGY: ReaderStrategy = {
  type: "parallel",
}

export function create_dispatcher(
  transports: Http[],
  strategy: ReaderStrategy,
): Reader {
  if (strategy.type === "parallel") {
    return create_parallel(transports)
  }
  return create_sequential(transports)
}

function create_parallel(transports: Http[]): Reader {
  return (call) =>
    Promise.any(
      transports.map((transport) => transport(call)),
    )
}

function create_sequential(transports: Http[]): Reader {
  return async (call) => {
    const errors: Error[] = []
    for (const transport of transports) {
      try {
        return await transport(call)
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error
            : new Error(String(error)),
        )
      }
    }
    throw new AggregateError(
      errors,
      "all transports failed",
    )
  }
}

export const ChainEntrySchema = object({
  chainId: string(),
  transports: array(
    custom<Http>((value) => typeof value === "function"),
  ),
  strategy: optional(ReaderStrategySchema),
})
export type ChainEntry = InferOutput<
  typeof ChainEntrySchema
>

export function require_chain(
  chains: ChainEntry[],
  chain_id: string,
): { transports: Http[]; strategy: ReaderStrategy } {
  const chain = chains.find((c) => c.chainId === chain_id)
  if (!chain) {
    throw new Error(`no chain configured for: ${chain_id}`)
  }
  return {
    transports: chain.transports,
    strategy: chain.strategy ?? DEFAULT_STRATEGY,
  }
}

export const ReadContextSchema = object({
  chain_id: ChainIdSchema,
})
export type ReadContext = InferOutput<
  typeof ReadContextSchema
>

export type ResolvedReader = [Reader, ReadContext]

export type Readable<T> = (
  _resolved: ResolvedReader,
) => Promise<T>

export function create_reader(
  chains: ChainEntry[],
): (_input: ReadContext) => ResolvedReader {
  return (_input: ReadContext): ResolvedReader => {
    const context = parse(ReadContextSchema, _input)
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
