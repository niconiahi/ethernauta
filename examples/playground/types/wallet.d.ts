import { Hash32 } from "@ethernauta/eth"

export type Wallet = {
  sign: (
    method: string,
    params: unknown[],
  ) => Promise<Hash32>
  connect: () => Promise<void>
}

declare global {
  interface Window {
    wallet: Wallet
  }
}
