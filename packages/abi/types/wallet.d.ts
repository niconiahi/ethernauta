import { Hash32 } from "@ethernauta/core"

export type Wallet = {
  sign: (
    method: string,
    params: unknown[] | Record<string, unknown>,
  ) => Promise<Hash32>
  connect: () => Promise<void>
}

declare global {
  interface Window {
    wallet: Wallet
  }
}
