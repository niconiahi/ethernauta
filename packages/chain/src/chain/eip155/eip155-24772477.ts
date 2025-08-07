// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_24772477 = {
  name: "6Degree of Outreach - Testnet",
  shortName: "6dotest",
  chain: "6DO",
  icon: "6do",
  rpc: ["https://rpc-testnet.6dochain.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "6Degree-Testnet Coin",
    symbol: "6DO-T",
    decimals: 18,
  },
  infoURL: "https://6do.world",
  chainId: 24772477,
  networkId: 24772477,
  explorers: [
    {
      name: "6Degree Testnet Chain Explorer",
      url: "https://explorer-testnet.6dochain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
