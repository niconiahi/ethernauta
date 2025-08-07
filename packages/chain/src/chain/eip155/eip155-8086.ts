// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8086 = {
  name: "Bitcoin Chain",
  shortName: "Bitcoin",
  chain: "BTC",
  icon: "BTCChain",
  rpc: ["https://rpc.bitcoinevm.org"],
  faucets: [],
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://bitcoinevm.org",
  chainId: 8086,
  networkId: 8086,
  explorers: [],
} satisfies Chain
