// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1617 = {
  name: "Ethereum Inscription Mainnet",
  shortName: "etins",
  chain: "ETINS",
  rpc: ["https://rpc.etins.org"],
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
    name: "Ethereum Inscription",
    symbol: "ETINS",
    decimals: 18,
  },
  infoURL: "https://www.etins.org",
  chainId: 1617,
  networkId: 1617,
  explorers: [
    {
      name: "Ethereum Inscription Explorer",
      url: "https://explorer.etins.org",
      standard: "none",
    },
  ],
} satisfies Chain
