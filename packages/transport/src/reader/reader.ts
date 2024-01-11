import type { Http } from "../http"

export function createReader(transports: Http[]): Http {
  // for now, just pick the first transport and use it
  return transports[0]
}

export function createReader_V2(chains: Array<{ chain: string, transports: Http[] }>): (_targetChain: string) => Http {
  return (targetChain: string): Http => {
    const chain = chains.find(({ chain }) => chain === targetChain)

    if (!chain) {
      throw new Error(`you need at least one transport for the targeted chain`)
    }

    const response = Promise.any(chain.transports.map(transport => transport))

    return chain.transports[0]
  }
}

export type Reader = ReturnType<typeof createReader>
export type Readable<T> = (_reader: Reader) => Promise<T>
