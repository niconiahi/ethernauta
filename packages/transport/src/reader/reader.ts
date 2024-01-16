import { parse } from "valibot"

import { chainIdSchema } from "../chain"
import type { Http } from "../http"

export function createReader(
  chains: Array<{ chainId: string, transports: Http[] }>,
): (_targetChain: string) => Http[] {
  return (_targetChain: string): Http[] => {
    const targetChain = parse(chainIdSchema, _targetChain)
    const chain = chains.find(({ chainId }) => chainId === targetChain)

    if (!chain) {
      throw new Error(`you need at least one transport for the targeted chain`)
    }

    return chain.transports
  }
}
export type Reader = ReturnType<typeof createReader>
export type Readable<T> = (_transports: Http[]) => Promise<T>
