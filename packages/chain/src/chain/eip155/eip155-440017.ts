// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_440017 = {
  name: "Graphite Mainnet",
  shortName: "graphite",
  chain: "Graphite",
  icon: "graphite",
  rpc: [
    "https://anon-entrypoint-1.atgraphite.com",
    "wss://ws-anon-entrypoint-1.atgraphite.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Graphite",
    symbol: "@G",
    decimals: 18,
  },
  infoURL: "https://atgraphite.com/",
  chainId: 440017,
  networkId: 440017,
  slip44: 440017,
  explorers: [
    {
      name: "Graphite Mainnet Explorer",
      url: "https://main.atgraphite.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
