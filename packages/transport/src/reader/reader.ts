import type { Http } from "../http"

export function createReader(transports: Http[]): Http {
  // for now, just pick the first transport and use it
  return transports[0]
}

// export function createReader_V2(chains: Array<{ chain: Chain, transports: Http[] }>): (_targetChain: Chain) => Http {
//   return (targetChain: Chain): Http => {
//     const chain = chains.find(({ chain }) => chain === targetChain)

//     if (!chain) {
//       throw new Error(`you need at least one transport for the targeted chain`)
//     }

//     return chain.transports[0]
//   }
// }

export type Reader = ReturnType<typeof createReader>
export type Readable<T> = (_reader: Reader) => Promise<T>
