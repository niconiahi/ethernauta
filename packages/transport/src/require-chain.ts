import {
  array,
  custom,
  type InferOutput,
  object,
  string,
} from "valibot"

import type { Http } from "./http"

export const chainEntrySchema = object({
  chainId: string(),
  transports: array(
    custom<Http>((value) => typeof value === "function"),
  ),
})
export type ChainEntry = InferOutput<
  typeof chainEntrySchema
>

export function require_chain(
  chains: ChainEntry[],
  chain_id: string,
): Http[] {
  const chain = chains.find((c) => c.chainId === chain_id)
  if (!chain) {
    throw new Error(`no chain configured for: ${chain_id}`)
  }
  return chain.transports
}
