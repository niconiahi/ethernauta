// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5090 = {
  name: "Pione Chain Mainnet",
  shortName: "pio",
  chain: "PIO",
  icon: "pio",
  rpc: ["https://rpc.pionescan.com"],
  faucets: [],
  nativeCurrency: {
    name: "Pione",
    symbol: "PIO",
    decimals: 18,
  },
  infoURL: "https://pionechain.com",
  chainId: 5090,
  networkId: 5090,
  explorers: [
    {
      name: "Pione Chain Explorer",
      url: "https://pionescan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
