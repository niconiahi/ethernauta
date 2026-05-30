import {
  array,
  custom,
  type InferOutput,
  object,
  optional,
  string,
} from "valibot"

import {
  DEFAULT_STRATEGY,
  type DispatcherStrategy,
  DispatcherStrategySchema,
} from "./dispatcher"
import type { Http } from "./http"

export const ChainEntrySchema = object({
  chainId: string(),
  transports: array(
    custom<Http>((value) => typeof value === "function"),
  ),
  strategy: optional(DispatcherStrategySchema),
})
export type ChainEntry = InferOutput<
  typeof ChainEntrySchema
>

export function require_chain(
  chains: ChainEntry[],
  chain_id: string,
): { transports: Http[]; strategy: DispatcherStrategy } {
  const chain = chains.find((c) => c.chainId === chain_id)
  if (!chain) {
    throw new Error(`no chain configured for: ${chain_id}`)
  }
  return {
    transports: chain.transports,
    strategy: chain.strategy ?? DEFAULT_STRATEGY,
  }
}
