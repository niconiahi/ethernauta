import { Hash32 } from "@ethernauta/eth"

export type Wallet = {
  sign: (
    method: string,
    params: unknown[] | Record<string, unknown>,
  ) => Promise<Hash32>
  connect: () => void
}

declare global {
  interface Window {
    wallet: Wallet
  }
}
