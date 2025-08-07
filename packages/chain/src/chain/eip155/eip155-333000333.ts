// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_333000333 = {
  name: "Meld",
  shortName: "meld",
  title: "Meld Mainnet",
  chain: "MELD",
  icon: "meld",
  rpc: ["https://rpc-1.meld.com"],
  faucets: [],
  features: [],
  nativeCurrency: {
    name: "gMeld",
    symbol: "gMELD",
    decimals: 18,
  },
  infoURL: "https://meld.com",
  chainId: 333000333,
  networkId: 333000333,
  explorers: [
    {
      name: "explorer",
      url: "https://meldscan.io",
      standard: "EIP3091",
    },
    {
      name: "explorer",
      url: "https://subnets.avax.network/meld",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
