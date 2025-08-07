// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_129 = {
  name: "Innovator Chain",
  shortName: "Innovator",
  chain: "INNOVATOR",
  icon: "innovator",
  rpc: ["https://rpc.innovatorchain.com"],
  faucets: [],
  features: [],
  nativeCurrency: {
    name: "INOV8",
    symbol: "INOV8",
    decimals: 18,
  },
  infoURL: "https://innovatorchain.com",
  chainId: 129,
  networkId: 129,
  explorers: [
    {
      name: "Innovator Explorer",
      url: "https://evm.innovatorchain.com",
      standard: "none",
    },
  ],
} satisfies Chain
