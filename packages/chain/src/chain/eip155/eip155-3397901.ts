// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3397901 = {
  name: "Funki Sepolia Testnet",
  shortName: "funkisepolia",
  chain: "ETH",
  icon: "funki",
  rpc: ["https://funki-testnet.alt.technology"],
  faucets: ["https://funkichain.com/portfolio"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://funkichain.com",
  chainId: 3397901,
  networkId: 3397901,
  explorers: [
    {
      name: "Funki Sepolia Testnet Explorer",
      url: "https://testnet.funkiscan.io",
      standard: "none",
    },
    {
      name: "Funki Sepolia Sandbox Explorer",
      url: "https://testnet-explorer.funkichain.com",
      standard: "none",
    },
    {
      name: "Funki Sepolia Testnet Explorer",
      url: "https://testnet.funkiscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
