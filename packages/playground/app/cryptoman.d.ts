import type { Transaction } from "@cryptoman/transport"

export type SignResponse = {
  id: string
  error?: string
  signature?: string
}

export type Cryptoman = {
  sign: (
    method: string,
    params: unknown[],
  ) => Promise<`0x${string}`>
  connect: () => Promise<void>
}

declare global {
  interface Window {
    cryptoman: Cryptoman
    transactions: Map<`0x${string}`, Transaction>
  }
}
