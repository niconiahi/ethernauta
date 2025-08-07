// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_911867 = {
  name: "Odyssey Testnet",
  shortName: "odyssey-testnet",
  chain: "ETH",
  rpc: ["https://odyssey.ithaca.xyz"],
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ithaca.xyz",
  chainId: 911867,
  networkId: 911867,
  explorers: [
    {
      name: "odyssey explorer",
      url: "https://odyssey-explorer.ithaca.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
