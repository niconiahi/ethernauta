import type { Http } from "./http"

export type ChainEntry = {
  chainId: string
  transports: Http[]
}

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
