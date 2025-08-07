// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_315 = {
  name: "WorldEcoMoney",
  shortName: "wem",
  chain: "WEM",
  icon: "wem",
  rpc: ["https://rpc.wemblockchain.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
    {
      name: "Smart Contracts",
    },
    {
      name: "Custom Gas Model",
    },
    {
      name: "Low-Latency Transactions",
    },
  ],
  nativeCurrency: {
    name: "WEM Coin",
    symbol: "WEM",
    decimals: 18,
  },
  infoURL: "https://worldecomoney.com",
  chainId: 315,
  networkId: 315,
  explorers: [
    {
      name: "wemscan",
      url: "https://wemscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
