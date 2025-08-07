// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3344 = {
  name: "Pentagon Chain",
  shortName: "PentagonChain",
  chain: "Pentagon Chain",
  icon: "pentagonchain",
  rpc: ["https://rpc.pentagon.games"],
  faucets: ["https://bridge.pentagon.games"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Pentagon Chain",
    symbol: "PC",
    decimals: 18,
  },
  infoURL: "https://pentagon.games",
  chainId: 3344,
  networkId: 3344,
  explorers: [
    {
      name: "Pentagon Chain Explorer",
      url: "https://explorer.pentagon.games",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
