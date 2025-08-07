// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_45510 = {
  name: "Deelance Mainnet",
  shortName: "dee",
  title: "Deelance Network Mainnet",
  chain: "DEE",
  icon: "deelance",
  rpc: ["https://rpc.deelance.com"],
  faucets: ["https://faucet.deelance.com"],
  nativeCurrency: {
    name: "Deelance",
    symbol: "DEE",
    decimals: 18,
  },
  infoURL: "https://deelance.com",
  chainId: 45510,
  networkId: 45510,
  explorers: [
    {
      name: "Deelance Mainnet Explorer",
      url: "https://deescan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
