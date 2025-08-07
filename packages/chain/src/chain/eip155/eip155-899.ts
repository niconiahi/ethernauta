// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_899 = {
  name: "MAXI Chain Mainnet",
  shortName: "maxi-mainnet",
  chain: "MAXI",
  icon: "maxi",
  rpc: ["https://rpc.maxi.network"],
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
    name: "MAXI GAS",
    symbol: "MGAS",
    decimals: 18,
  },
  infoURL: "https://maxi.network",
  chainId: 899,
  networkId: 899,
  explorers: [
    {
      name: "Maxi Chain Mainnet Explorer",
      url: "https://mainnet.maxi.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
