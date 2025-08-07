// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_54170 = {
  name: "Graphite Testnet",
  shortName: "graphiteTest",
  chain: "Graphite",
  icon: "graphite",
  rpc: [
    "https://anon-entrypoint-test-1.atgraphite.com",
    "wss://ws-anon-entrypoint-test-1.atgraphite.com",
  ],
  faucets: ["https://faucet.atgraphite.com/"],
  nativeCurrency: {
    name: "Graphite",
    symbol: "@G",
    decimals: 18,
  },
  infoURL: "https://atgraphite.com/",
  chainId: 54170,
  networkId: 54170,
  explorers: [
    {
      name: "Graphite Testnet Explorer",
      url: "https://test.atgraphite.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
