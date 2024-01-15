import type { Http } from "../http"

export function createReader(
  chains: Array<{ chain: string, transports: Http[] }>,
): (_targetChain: string) => Http[] {
  return (targetChain: string): Http[] => {
    const chain = chains.find(({ chain }) => chain === targetChain)

    if (!chain) {
      throw new Error(`you need at least one transport for the targeted chain`)
    }

    return chain.transports
  }
}
export type Reader = ReturnType<typeof createReader>
export type Readable<T> = (_transports: Http[]) => Promise<T>
