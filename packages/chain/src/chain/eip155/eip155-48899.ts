// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_48899 = {
  name: "Zircuit Testnet",
  shortName: "zircuit-testnet",
  chain: "Zircuit Testnet",
  icon: "zircuit",
  rpc: ["https://testnet.zircuit.com"],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.zircuit.com/",
  chainId: 48899,
  networkId: 48899,
  explorers: [
    {
      name: "Zircuit",
      url: "https://explorer.testnet.zircuit.com",
      standard: "none",
    },
  ],
} satisfies Chain
