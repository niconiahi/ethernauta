// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1961 = {
  name: "Selendra Network Mainnet",
  shortName: "SEL",
  chain: "SEL",
  icon: "selendra",
  rpc: [
    "https://rpc.selendra.org",
    "https://rpc2.selendra.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Selendra",
    symbol: "SEL",
    decimals: 18,
  },
  infoURL: "https://selendra.org",
  chainId: 1961,
  networkId: 1961,
  explorers: [
    {
      name: "Selendra Portal",
      url: "https://explorer.selendra.org",
      standard: "none",
    },
  ],
} satisfies Chain
