// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2731 = {
  name: "Elizabeth Testnet",
  shortName: "TIME",
  chain: "Elizabeth",
  icon: "timenet",
  rpc: ["https://testnet-rpc.timenetwork.io"],
  faucets: [],
  nativeCurrency: {
    name: "TIME",
    symbol: "TIME",
    decimals: 18,
  },
  infoURL:
    "https://whitepaper.anttime.net/overview/anttime",
  chainId: 2731,
  networkId: 2731,
  explorers: [
    {
      name: "Time Network Explorer",
      url: "https://testnet-scanner.timenetwork.io",
      standard: "none",
    },
  ],
} satisfies Chain
