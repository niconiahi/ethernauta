// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_898 = {
  name: "MAXI Chain Testnet",
  shortName: "maxi-testnet",
  chain: "MAXI",
  icon: "maxi",
  rpc: ["https://rpc-testnet.maxi.network"],
  faucets: ["https://faucet.maxi.network"],
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
  chainId: 898,
  networkId: 898,
  explorers: [
    {
      name: "Maxi Chain Testnet Explorer",
      url: "https://testnet.maxi.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
