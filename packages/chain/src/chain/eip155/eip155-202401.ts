// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_202401 = {
  name: "YMTECH-BESU Testnet",
  shortName: "YMTECH-BESU",
  chain: "YMTECH-BESU",
  rpc: ["http://39.119.118.216:8545"],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.ymtech.co.kr",
  chainId: 202401,
  networkId: 202401,
  explorers: [
    {
      name: "YMTECH-BESU Chainlens",
      url: "http://39.119.118.198",
      standard: "none",
    },
  ],
} satisfies Chain
