// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1949 = {
  name: "Bionix Testnet",
  shortName: "tbio",
  chain: "Bionix",
  icon: "bionix",
  rpc: ["https://testnet-chain.bionixnetwork.com"],
  faucets: [],
  nativeCurrency: {
    name: "Bionix",
    symbol: "tBIO",
    decimals: 18,
  },
  infoURL: "https://bionixnetwork.com",
  chainId: 1949,
  networkId: 1949,
  explorers: [
    {
      name: "Bionix Testnet Explorer",
      url: "https://testnet.bionixnetwork.com",
      standard: "none",
    },
  ],
} satisfies Chain
